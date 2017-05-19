var app = getApp()
var chuan
var attr
var coupon = 0
var util = require('../../utils/util.js')
var quan
Page({    
    data: {
        array: ['上午', '中午', '下午', '晚上'],
        objectArray: [
        {id: 0,name: '上午'},
        {id: 1,name: '中午'},
        {id: 2,name: '下午'},
        {id: 3,name: '晚上'},
        ],
        index: 0,
        date: '2016-09-01',
        time: '12:01',
        //数据列表
        listinfo:Object,
        //公共域名
        HOST:app.globalData.url,
        quan:0,
        way:false,
        count:0,
        coupons_index:-1,
        coupons:[]
    },
    bindDateChange: function(e) {
        this.setData({
            date: e.detail.value
        })
    },
    coupon () {
        let that = this
        this.__getData(function(info){
            let arr = new Array()
            let cp = []
            for(var i in info){
                if(util.isExpire(info[i].end_time)){
                    
                }else{ 
                    let str = ""
                    if(info[i].type == 1 || info[i].type == 0){
                        str ='抵用券' + " 抵扣"+info[i].jian+'元' + info[i].hasdate
                    }
                    if(info[i].type == 3){
                        str ='配送券' + " 抵扣"+info[i].jian+'元' + info[i].hasdate
                    }
                    if (i <= 5){
                        arr.push(str)
                        cp.push(info[i])   
                    }
                    
                }
            }
            that.setData({
                coupons:cp
            })
            wx.showActionSheet({
                itemList: arr,
                success: function(res) {
                    if(res.cancel&&res.cancel){
                     that.setData({
                        coupons_index : -1
                     })
                    }else{
                        let cd = that.data.listinfo.price - cp[res.tapIndex].condition 
                        if(cd < 0) {
                            wx.showToast({title: '满'+cp[res.tapIndex].condition +'可用',duration:4000,image:'../img/warn.png'})
                            return
                        }
                        that.setData({
                            coupons_index : res.tapIndex
                        })
                    } 
                },
                fail: function(res) {
                    that.setData({
                        coupons_index : -1
                    })
                }
            })
        })
    },
    __getData (cb) {
        let that = this
        let token = wx.getStorageSync('token')
        wx.request({
            url:app.globalData.url+'api/voucher/1',
            header:{"Authorization": "Bearer "+token},
            success: function(res) {
            if(res.statusCode === 401){
                wx.redirectTo({
                    url: '../login/login'
                })
            }
            let info = res.data.data
            for(var i in info){
                info[i].hasdate = util.string2date(info[i].end_time)
            }
            cb(info)
         }
        })
    },
    __getCount () {
        let that = this
        let token = wx.getStorageSync('token')
        wx.request({
            url:app.globalData.url+'api/voucher/1',
            header:{"Authorization": "Bearer "+token},
            success: function(res) {
            if(res.statusCode === 401){
                wx.redirectTo({
                    url: '../login/login'
                })
            }
            let info = res.data.data
            let count = 0
            for(var i in info){
                info[i].hasdate = util.string2date(info[i].end_time)
                if(util.isExpire(info[i].end_time)){
                    
                }else{
                    if(i<=5){
                        count++
                    }
                }
            }
            that.setData({
                count:count
            })
            
         }
        })
    },
    onLoad:function(options){
        this.__getCount()
        chuan = options.data
        attr = options.addr_id
        coupon = options.coupon_id
        
        
        if(coupon>0){
            this.setData({
                quan:coupon
            })
        }
        var that = this
        let token = wx.getStorageSync('token')
        wx.request({
            url:that.data.HOST+'api/order',
            header:{"Authorization": "Bearer "+token},
            data:{data:chuan,addr_id:attr,coupon_id:coupon},
            success: function(res) {
                that.setData({
                    listinfo:res.data.data
                })
                attr = that.data.listinfo.default_address.id
            }
            
        })
    },
    //去详情页  
    goxq:function(event){
        this.setData({
            way:true
        })
        wx.redirectTo({
          url: '../details/details?id='+event.currentTarget.dataset.goodid,
        })
    },
    //提交
    tijiao:function(){
        var that = this
        
        let token = wx.getStorageSync('token')
        if(that.data.listinfo.default_address.id ==' ' || that.data.listinfo.default_address.id ==undefined ){
            wx.showToast({
                title: '收货地址不能为空',
                icon: 'success',
                duration: 1500
            })
        }else{
            let form = {}
            let cou = null
            if(that.data.coupons_index == -1 || that.data.coupons.length == 0){
                form = {data:chuan,addr:attr}
            }else{
                cou = JSON.stringify(that.data.coupons[that.data.coupons_index])
                form = {data:chuan,addr:attr,coupon_id:that.data.coupons[that.data.coupons_index].id}
            }
            wx.request({
                url:that.data.HOST+'api/create_order',
                header:{"Authorization": "Bearer "+token},
                data:form,
                method:'POST',
                success: function(res) {
                    let orderid = res.data.data.order_id
                    if(res.data.success){
                        that.setData({
                            way:true
                        })
                        wx.redirectTo({
                            url: '../paydan/paydan?id='+orderid+'&coupon='+cou
                        })
                    }else{
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'success',
                            duration: 1500
                        })
                    }
                    
                }
            })
        }
    },
    //去选地址
    gochose:function(){
        var that = this
        that.setData({
            way:true
        })
        let token = wx.getStorageSync('token')
        wx.redirectTo({
            url: '../addresschose/addresschose?data='+chuan+'&coupon_id='+coupon+'&addr='+attr,
        })
    },
    //去选择地址
    goadd:function(){
        var that = this
        that.setData({
            way:true
        })
        let token = wx.getStorageSync('token')
        wx.redirectTo({
            url: '../address-detail/address-detail?data='+chuan+'&coupon_id='+coupon+'&addr='+attr,
        })
    },
    //去找优惠券
    goFree:function(){
        var that = this
        that.setData({
            way:true
        })
        wx.redirectTo({
            url: '../coupon/coupon?data='+chuan+'&addr='+attr+'&coupon_id='+coupon,
        })
    },
    //回家，朋友
    backHome:function(){
        wx.switchTab({
            url: '../index/index'
        })
    },
    //对呀 走了 
    onUnload:function(){
        if(!this.data.way){
            wx.switchTab({
                url: '../index/index'
            })
        }
    }

})