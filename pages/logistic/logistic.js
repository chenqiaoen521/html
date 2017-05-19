var app = getApp()
Page({
	data:{
		message:Object,
		HOST:app.globalData.url,
		imgurl:Object,
		count:1
	},
	toDetail (e) {
		let id = e.currentTarget.dataset.id
		wx.navigateTo({url:'../help-question/help-question?id='+id})
	},
	onLoad (option) {
		let that = this
		let token = wx.getStorageSync('token')
		wx.request({
		  url:app.globalData.url+'api/wuLiu/'+option.id,
		  header:{"Authorization": "Bearer "+token},
		  success: function(res) {
		    if(res.statusCode === 401){
		    	wx.redirectTo({
					url: '../login/login'
				})
		    }
		    that.setData({
		    	message:res.data.data,
		    	imgurl:option.imgurl,
		    	count:option.count
		    })
		  }
		})
	}
})