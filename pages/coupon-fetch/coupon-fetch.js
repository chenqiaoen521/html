
var app = getApp()
var util = require('../../utils/util.js')
const GOODS = 1
const SWIM = 2
const DELIVERY = 3
const REGISTER = 0

Page({
	data:{
		coupon:Object,
		data:Object,
		addr:Object,
		quan:Object
	},
	onLoad (e) {
		if(e.data!= undefined){
	      	this.setData({
	        data:e.data,
	        addr:e.addr,
	        coupon_id:e.coupon_id
      		})
    	}
	},
	onShow () {
		this.__getData()
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
		let that = this
		let token = wx.getStorageSync('token')
		wx.request({
		    url:app.globalData.url+'api/getVoucher/'+id,
		    header:{"Authorization": "Bearer "+token},
	    	success: function(res) {
			    if(res.statusCode === 401){
			    	wx.redirectTo({
						url: '../login/login'
					})
			    }
			    if(!res.data.success) {
			    	wx.showToast({
			    		title:res.data.msg,
			    		image:'../img/warn.png'
			    	})
			    	return
			    }else if (res.data.success) {
			    	wx.showToast({title:'领取成功',icon:'success',
			    	success : () => {
			    		setTimeout(function () {
			    			wx.redirectTo({url:'../coupon/coupon'})
			    			},1000)
			    		}
			    	})
			    }else {
			    	wx.showToast({
			    		title:'领取失败',
			    		image:'../img/warn.png'
			    	})
			    }

	     	}
	  	})
	},
	onReady () {
		this.__getData()
	},
	__getData () {
		let that = this
		let token = wx.getStorageSync('token')
		wx.request({
		    url:app.globalData.url+'api/voucherList',
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
			    	info[i].type = util.getType(info[i].type).type
			    	info[i].percent = util.num2percent(info[i].surplus,info[i].num)
			    }
			    this.setData({
			    	coupon:info
			    })
	     }.bind(this)
	  	})
	},
	__getType (tp) {
		let x = ""
		switch(tp){
			case GOODS:
			  x = "抵用券"
			  break;
			case SWIM:
			  x = "游泳券"
			  break;
			case DELIVERY:
			  x = "配送券"
			  break;
			case REGISTER:
			  x = "注册送游泳券"
			  break;
			case 4:
			  x = "(赠送)游泳券"
			  break;
			case 5:
			  x = "(积分兑换)游泳券"
			  break;
		 	case 6:
		  	  x = "(团购)游泳券"
		      break;
		 }
		 return x;
	}
})