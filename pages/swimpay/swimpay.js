var app = getApp()
var util = require('../../utils/util.js')
var oldtime = 0
const swimType = 2
Page({
    data: {
        num:Object,//订单号SN
        price:Number,//价格
        status:Object,//状态
        oid:Object,//订单id
        big_status:["等待卖家发货", "卖家已发货", "确认收货", "交易成功", "取消订单", "订单关闭", "删除订单", "等待买家付款", ""],
        info:Object,
        way:false,
        coupons:[],
        count:0,
        store_name:String,
        time:Object,
        coupons_index:-1,
        oi_id:Object,
        storeid:Object
    },
    coupon () {
        let that = this
        this.__getData(function(info){
            let arr = new Array()
            let cp = []
            for(var i in info){
                if(util.isExpire(info[i].end_time)){
                    continue
                }else{ 
                    let str ='游泳券' + " 抵扣"+info[i].jian+'元' + info[i].hasdate
                    if(!util.isExpire(info[i].end_time)){
                        if (i <= 5){
                            arr.push(str)
                            cp.push(info[i])   
                        } 
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
                        let cd = that.data.price - cp[res.tapIndex].condition 
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
                    let sum = that.data.coupons.length
                    that.setData({
                        coupons_index : -1
                    })
                }
            })
        })
    },
    onLoad:function(e){
        this.__getCount(e.storeid)
        let token = wx.getStorageSync('token')
        this.setData({
            num:e.num,
            price:e.price,
            store_name:e.store_name,
            time:e.time,
            oi_id:e.oi_id,
            storeid:e.storeid
        })
    },
    confirm:function() {
        let first = new Date().getTime()
        if(oldtime != 0 && first - oldtime < 2000){
            oldtime = first
            return
        }
        oldtime = first
        let that = this
        let token = wx.getStorageSync('token')
        let coupon_price = 0
        if(that.data.coupons.length == 0 || that.data.coupons_index == -1){
            coupon_price = 0
        }else{
            coupon_price = that.data.coupons[that.data.coupons_index].jian
        }
        wx.request({
            url:app.globalData.url+'api/paySubscribe',
            header:{"Authorization": "Bearer "+token},
            method:'POST',
            data:{
                oi_id:that.data.oi_id,
                voucher_money:coupon_price,
                price:that.data.price
            },
            success:function(res) {
                if(res.statusCode === 401){
                    wx.redirectTo({
                        url: '../login/login'
                    })
                }else{
                    if(!res.data.success){
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'warn',
                            duration: 2000
                        })
                        return
                    }
                    that.__pay ()
                }

            },
            fail:function(e) {
            }
        })
    },
    //回家，朋友
    backHome:function(){
        wx.switchTab({
            url: '../index/index'
        })
    },
    //对呀 走了 
    /*onUnload:function(){
        if(!this.data.way){
            console.log("我走了啊")
            wx.switchTab({
                url: '../index/index'
            })
        }
    },*/
    __getData (cb) {
        let that = this
        let token = wx.getStorageSync('token')
        wx.request({
            url:app.globalData.url+'api/swimVoucher/'+that.data.storeid,
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
    __getCount (id) {
        let that = this
        let token = wx.getStorageSync('token')
        wx.request({
            url:app.globalData.url+'api/swimVoucher/'+id,
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
                if(!util.isExpire(info[i].end_time)){
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
    __pay () {
        let that = this
        let token = wx.getStorageSync('token')
        wx.request({
            url:app.globalData.url+'jsApiSubscribe',
            header:{"Authorization": "Bearer "+token},
            data:{oi_id:that.data.oi_id},
            success: function(res) {
                if(res.statusCode === 401){
                    wx.redirectTo({
                        url: '../login/login'
                    })
                }else{
                    if(!res.data.success){
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'warn',
                            duration: 2000
                        })
                        return
                    }else{
                        that.wxpay(res.data.data.timeStamp,res.data.data.nonceStr,res.data.data.package,res.data.data.signType,res.data.data.paySign)
                    }
                }
            }
        })
    },
    wxpay (timeStamp,nonceStr,pg,signType,paySign) { 
        let that = this
        wx.requestPayment({
            timeStamp:timeStamp,
            nonceStr:nonceStr,
            package:pg,
            signType:signType,
            paySign:paySign,
            success (e) {
                if(e.errMsg == 'requestPayment:ok'){
                    wx.showToast({
                        title: '支付成功',
                        icon: 'success',
                        duration: 2000
                    })
                    setTimeout(function(){
                        wx.redirectTo({url:"../paydan-swim-ok/paydan-swim-ok?oid="+that.data.oi_id})
                    },1500)
                }
            },
            fail (e) {
                
               if(e.errMsg == 'requestPayment:fail cancel'){
                    wx.showToast({
                        title: '用户取消支付',
                        icon: 'warn',
                        duration: 2000
                    })
                }else{
                    wx.showToast({
                        title: '支付失败',
                        icon: 'warn',
                        duration: 2000
                    })
                }
            }
        })
    }
})

