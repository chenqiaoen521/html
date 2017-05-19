var app = getApp()
var WxParse = require('../../wxParse/wxParse.js')
Page({
	data:{
		message:Object
	},
	cancel () {
		this.setData({
			value:''
		})
	},
	onLoad (option) {
		let id = option.id
		let that = this
		let token = wx.getStorageSync('token')
		if(id){
			wx.request({
		    url:app.globalData.url+'api/notice_detail',
		    data:{'id':id},
		    header:{"Authorization": "Bearer "+token},
		    success: function(res) {
			    if(res.statusCode === 401){
			    	wx.redirectTo({
						url: '../login/login'
					})
			    }
			    let info = res.data.data
			    that.setData({
			    	message : info
			    })
			    WxParse.wxParse('article','html',info.content,that)
		     }
		  })
		}
	}
})