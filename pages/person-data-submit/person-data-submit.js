var app = getApp()
Page({
	data:{
		name:String,
		value:String
	},
	cancel () {
		this.setData({
			value:''
		})
	},
	formSubmit(e) {
		let info = e.detail.value
		let that = this
		let token = wx.getStorageSync('token')
		wx.request({
		  url:app.globalData.url+'api/updateUserInfo',
		  data:info,
		  method:'POST',
		  header:{"Authorization": "Bearer "+token},
		  success: function(res) {
		    if(res.statusCode === 401){
		    	wx.request({
		    		url:app.globalData.url+'api/refresh',
		    		method:'POST',
		  			header:{"Authorization": "Bearer "+token},
		  			success (res) {
		  				wx.setStorageSync('token',res.data.data.token)
		  			}
		    	})
		    }
		    that.setData({
		    	userInfo : res.data.data
		    })
		  }
		})
	},
	onLoad (option) {
		this.setData({
			name:option.name,
			value:option.value
		})
	}
})