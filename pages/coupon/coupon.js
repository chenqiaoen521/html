var app = getApp()
var util = require('../../utils/util.js')

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
	onReady () {
		this.__getData()
	},
	__getData () {
		let that = this
		let token = wx.getStorageSync('token')
		wx.request({
		    url:app.globalData.url+'api/voucher/0',
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
		    	info[i].type = util.getType(info[i].type)  
		    }
		    that.setData({
		    	coupon:info
		    })
	     }
	  	})
	}
})