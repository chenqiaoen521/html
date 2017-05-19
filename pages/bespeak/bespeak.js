
// var tcity = require("../../utils/citys.js");

const province=['a','b','c','d','e']
const city= ['a','b','c','d','e']
const area= ['a','b','c','d','e']
var mdStore
var mdDate = new Date().toLocaleDateString()
var today = (function(){
    let date = new Date(),Month = date.getMonth()+1,Day=date.getDate(),CurrentDate = date.getFullYear()+'-';
     if (Month >= 10 ) 
       { 
        CurrentDate += Month + "-"; 
       } 
    else
       { 
        CurrentDate += "0" + Month + "-"; 
       } 
   if (Day >= 10 ) 
       { 
        CurrentDate += Day ; 
       } 
   else
       { 
        CurrentDate += "0" + Day ; 
       } 
    return  CurrentDate
}())
var app = getApp()
Page({
    data: {
        /*provinces: [],
        province: "",
        citys: [],
        city: "",
        countys: [],
        county: '',
        value: [0, 0, 0],*/
        values: [0, 0, 0],
        condition: false,
        index: 0,
        //date: (new Date().toLocaleDateString()),
        date: today,
        time: '12:01',
        mendian: [{name:'请选择区域再选择门店',id:-1}],
        mendianindex:0,
        mTime:Object,
        //选择时间段变颜色

        //注释
        flag:true,
        province:province,
        city: city,
        area: area,
        value: [0, 0, 0],
        provinces:{REGION_NAME:'请'},
        citys: {REGION_NAME:'选择'},
        areas:{REGION_NAME:'区域'},
        //区域组合
        areastr:'2,34,394',

    },
    tip (e) {
        let data = e.currentTarget.dataset
        let ren = data.surplus || 0
        wx.showToast({
            title:'可预约总人数'+data.total+'人,剩余'+ren+'人预约',
            image:'../img/warn.png'
        })
    },
    cS (e) {
    },
    changeshop:function(e){
        mdStore = this.data.mendian[e.detail.value].id
        this.setData({
            mendianindex:e.detail.value
        })
        let token = wx.getStorageSync('token')
        let that  = this
        wx.request({
        url:app.globalData.url+'api/store_time',
        method:'GET',
        header:{"Authorization": "Bearer "+token},
        data:{store_id:mdStore,date:that.data.date},
        success: function(res) {
            if(res.data.data){
               that.setData({
                    mTime:res.data.data
                })
            }
        }
    })
    },
    //选择区域窗口取值变化
    bindChange: function(e) {
        let val = e.detail.value
        let x = val[0]
        let y = val[1]
        let z = val[2] 
        let province = this.data.province[x]
        let city = this.data.city[y]
        if(province){
            this.setData({provinces:this.data.province[x]})
            province = this.data.province[x].REGION_ID
            let that = this
            let token = wx.getStorageSync('token')
            wx.request({
                url:app.globalData.url+'api/region',
                method:'GET',
                data:{'pid':province},
                header:{"Authorization": "Bearer "+token},
                success: function(res) {
                    that.setData({
                        city:res.data.data,
                        citys:res.data.data[y]
                    })
                }
          })
        }
        if(city){
            city = this.data.city[y].REGION_ID
            let that = this
            let token = wx.getStorageSync('token')
            wx.request({
                url:app.globalData.url+'api/region',
                method:'GET',
                data:{'pid':city},
                header:{"Authorization": "Bearer "+token},
                success: function(res) {
                    that.setData({
                        area:res.data.data,
                        areas:res.data.data[z]
                    })
                    that.__checkMen(res.data.data[z])
                }
            })
        }            
    },
    //查询门店
    __checkMen(areas) {
        let that = this
        that.setData({areastr:that.data.provinces.REGION_ID+','+that.data.citys.REGION_ID+','+areas.REGION_ID})
        let token = wx.getStorageSync('token')
        wx.request({
            url:app.globalData.url+'api/store',
            method:'GET',
            header:{"Authorization": "Bearer "+token},
            data:{area:that.data.areastr},
            success: function(res) {
                if(res.data.msg=="暂无门店信息"){
                    wx.showToast({
                        title: '此区域暂无门店',
                        icon: 'success',
                        duration: 1500
                    })
                    that.setData({
                        mendian: [{name:'暂无门店',id:-1}],
                    })
                }else if(res.data.msg=="门店获取成功"){
                    that.setData({mendian:res.data.data})
                    mdStore = that.data.mendian[that.data.mendianindex].id
                    let data = {store_id:mdStore,date:that.data.date}
                    that.__checkTime (data)
                }   
            }
        })
    },
    //查时间段
    __checkTime (data) {
        let that = this
        let token = wx.getStorageSync('token')
        wx.request({
            url:app.globalData.url+'api/store_time',
            method:'GET',
            header:{"Authorization": "Bearer "+token},
            data:data,
            success: function(res) {
                if(res.data.data){
                    that.setData({
                        mTime:res.data.data
                    })
                }    
            }
        })
    },
    //打开和关闭选择地址窗口
    showFlag:function() {
        let that = this
        that.setData({
            flag:!that.data.flag
        })

    },
    bindDateChange: function(e) {
        var that = this
        that.setData({
            date: e.detail.value
        })
        let mdStore = that.data.mendian[that.data.mendianindex].id
        let data = {store_id:mdStore,date:e.detail.value}
        if(mdStore == -1){
             wx.showToast({
                title: '当前门店没有时间段',
                icon: 'success',
                duration: 1500
            })
            return
        }
        that.__checkTime(data)
        //mdDate = that.data.date.id
    },

    bindPickerChange: function(e) {
        let that = this
    },
    open:function(){
        this.setData({
            condition:!this.data.condition
        })
    },
    onLoad:function () {
        let that = this
        let token = wx.getStorageSync('token')
        wx.request({
            url:app.globalData.url+'api/region',
            method:'GET',
            header:{"Authorization": "Bearer "+token},
            success: function(res) {
                that.setData({
                    province:res.data.data
                })
            }
        })
        /*
        wx.request({
            url:app.globalData.url+'api/store_time',
            method:'GET',
            header:{"Authorization": "Bearer "+token},
            data:{store_id:mdStore,date:that.data.date},
            success: function(res) {
                
                if(res.data.data.length>0){
                   that.setData({
                        mTime:res.data.data
                    })
                }
                console.log(that.data.mTime)
            }
        })*/
    },
    //关闭城市选择
    closew:function(){
        let that = this
        that.setData({flag:!that.data.flag})
    },
    //确认提交
    submit:function(e){
        var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/
        if(!e.detail.value.name){
            wx.showToast({
                title: '宝宝姓名不能为空',
                icon: 'success',
                duration: 1500
            })
            return
        }
        if(!e.detail.value.phone){
            wx.showToast({
                title: '联系方式不能为空',
                icon: 'success',
                duration: 1500
            })
            return
        }
        if(!myreg.test(e.detail.value.phone)) {
            wx.showToast({
                title: '手机号输入不正确',
                icon: 'success',
                duration: 1500
            })
            return
        }
        if(!e.detail.value.time){
            wx.showToast({
                title: '时间段不能为空',
                icon: 'success',
                duration: 1500
            })
            return
        }
         let forms = e.detail.value
         let that = this 
         forms.store = this.data.mendian[this.data.mendianindex].id  
         if(forms.store == -1 || typeof forms.store == 'undefined' || forms.store == null || forms.store == '' || forms.store == undefined || forms.store == 'undefined' ){
            wx.showToast({
                title: '门店不能为空',
                icon: 'success',
                duration: 1500
            })
            return
        }
         let token = wx.getStorageSync('token')
         forms.date = this.data.date
         wx.request({
            url:app.globalData.url+'api/commit',
            method:'POST',
            data:forms,
            header:{"Authorization": "Bearer "+token},
            success: function(res) {
                if(!res.data.success){
                     wx.showToast({
                      title: res.data.msg,
                      image:'../img/warn.png',
                      duration: 2000 
                    })  
                    return     
                } 
            let data = res.data.data.info
            let num = data.order_num
            let oi_id = data.oi_id
            let price = data.price
            let store_name = data.subscribe.store_name 
            let time = data.subscribe.start_time + " ~ " + data.subscribe.end_time
            let storeid = data.subscribe.id
            setTimeout(function(){
                        wx.navigateTo ({
                            url: "../swimpay/swimpay?num="+num+"&price="+price+"&store_name="+store_name+"&time="+time+"&oi_id="+oi_id+"&storeid="+storeid
                        })
                    },100)
            }
        })
    }
})
