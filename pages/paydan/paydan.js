const app = getApp()
Page({
    data: {
        num:Object,//订单号SN
        price:Number,//价格
        status:Object,//状态
        oid:Object,//订单id
        big_status:["等待卖家发货", "卖家已发货", "确认收货", "交易成功", "取消订单", "订单关闭", "删除订单", "等待买家付款", ""],
        info:Object,
        way:true,
        coupon:Object
    },
    onLoad:function(e){
        let token = wx.getStorageSync('token')
        var that = this
        if(e.id != undefined){
            if(e.coupon){
                that.setData({
                    coupon:JSON.parse(e.coupon)
                })
            }
            wx.request({
                url:app.globalData.url+'api/pay_order',
                header:{"Authorization": "Bearer "+token},
                data:{id:e.id,is_integral:e.is_integral},
                success:function(res) {
                if(res.statusCode === 401){
                    wx.redirectTo({
                        url: '../login/login'
                    })
                }
                if(!res.data.success) {
                    wx.showToast({
                        title:res.data.msg,
                        image:'../img/warn.png',
                        duration:5000
                    })
                    that.setData({way:res.data.success})
                    return
                }else if (res.data.success) {
                    let count = parseInt(res.data.data.status)
                    let name = that.data.big_status.slice(count-1 ,count)
                    that.setData({
                        num : res.data.data.order_num,
                        price :res.data.data.pay_price,
                        status :name,
                        oid:res.data.data.order_id,
                        way:res.data.success
                    })
                }else {
                    wx.showToast({
                        title:'未能支付',
                        image:'../img/warn.png'
                    })
                    that.setData({way:res.data.success})
                    }
                }
            })
        }else{
            let index = parseInt(e.status)
            let status_name = that.data.big_status.slice(index-1 ,index)
            that.setData({
                num : e.num,
                price :e.price,
                status :status_name,
                oid:e.oid
            })
        }
    },
    confirm:function() {
        let that = this
        let token = wx.getStorageSync('token')  
        wx.request({
            url:app.globalData.url+'jsApi',
            header:{"Authorization": "Bearer "+token},
            data:{oi_id:that.data.oid},
            success:function(res) {
                if(res.statusCode === 401){
                    wx.redirectTo({
                        url: '../login/login'
                    })
                }else{
                    if(!res.data.success){
                        wx.showToast({
                            title: res.data.msg,
                            image:'../img/warn.png',
                            duration: 4000
                        })
                        that.setData({way:res.data.success})
                        return
                    }
                    that.setData({way:res.data.success})
                    wx.requestPayment({
                        timeStamp : res.data.data.timeStamp,
                        nonceStr : res.data.data.nonceStr,
                        package : res.data.data.package,
                        signType : res.data.data.signType,
                        paySign:res.data.data.paySign,
                        success (e) {
                            if(e.errMsg == 'requestPayment:ok'){
                                that.setData({
                                    way:true
                                })
                                wx.showToast({
                                    title: '支付成功',
                                    icon: 'success',
                                    duration: 2000
                                })
                                setTimeout(function(){
                                    wx.redirectTo({url:"../paydanok/paydanok?oid="+that.data.oid})
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
    }*/

})