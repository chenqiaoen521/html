
var app = getApp()
var util = require('../../utils/util.js')
const GOODS = 1
const SWIM = 2
const DELIVERY = 3
const REGISTER = 0

Page({
	data:{
		coupon:[],
		data:Object,
		addr:Object,
		quan:Object,
		member:String,
		//next_page_url:app.globalData.url+'api/voucher_buy_list',
        animationData: {}
	},
	onLoad (e) {
		if(e.data!= undefined){
	      	this.setData({
	        data:e.data,
	        addr:e.addr,
	        coupon_id:e.coupon_id
      		})
    	}
        var animation = wx.createAnimation({
        duration: 1000,
            timingFunction: 'ease',
        })

        this.animation = animation
        // 旋转同时放大
        this.animation.scale(1.05, 1.05).step()
        this.animation.scale(1, 1).step()
        this.setData({
            animationData: this.animation.export()
        })
        
	},
	onShow () {
		//this.__getData()     
	},
    //跳转链接
    Golist(e) {
        var type = e.currentTarget.dataset.typenum
        console.log('../coupon-tuan/coupon-tuan?type='+type)
        wx.navigateTo({
            url: '../coupon-tuan/coupon-tuan?type='+type,
        })
    },
	toMakedan (e) {
		this.setData({
	    	quan:e.currentTarget.dataset.quan
	    })
		wx.redirectTo({
  			url: '../makedan/makedan?data='+this.data.data+'&coupon_id='+e.currentTarget.dataset.id+'&addr_id='+this.data.addr+'&quan='+this.data.quan

		})
	},
	fetch (e) {
		let id = e.currentTarget.dataset.id
		this.__pay(id)
	},
	onReady () {
		//this.__getData()
		app.getMember((id) => {
	        this.setData({
	            member:id
	        })
      	})
	},
	/**上拉分页*/
    onReachBottom (){
      if (wx.showLoading) {
        wx.showLoading({title:"正在加载中..."})
      }
      this.__getData() 	
    },
	__getData () {
		let that = this
		let token = wx.getStorageSync('token')
		if(that.data.next_page_url == undefined){
        wx.showToast({  
          title: '已经到最后一页',
          icon: 'warn',
          duration: 2000
        }) 
        	return 
      	}
		wx.request({
		    url:that.data.next_page_url,
		    header:{"Authorization": "Bearer "+token},
	    	success: function(res) {
			    if(res.statusCode === 401){
			    	wx.redirectTo({
						url: '../login/login'
					})
			    }else{
			    	let info = res.data.data.data
		          	let next_page_url = res.data.data.next_page_url
		          	if(next_page_url != undefined){
		              next_page_url = next_page_url.replace(/http:/g,'https:')
		          	}
		          	that.setData({
		           	 next_page_url:next_page_url,
		            	coupon:that.data.coupon.concat(info)
		          	})
		          	if (wx.hideLoading) {
		            	wx.hideLoading()
		          	}
			    }
	     }.bind(this)
	  	})
	},
	__pay (id) {
        let that = this
        let token = wx.getStorageSync('token')
        wx.request({
            url:app.globalData.url+'jsApiVoucher',
            header:{"Authorization": "Bearer "+token},
            data:{id:id,user_id:that.data.member},
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
                        wx.redirectTo({url:"../coupon/coupon"})
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