var app = getApp()
Page({
	data:{
		infos:Object
	},
	toDetail (e) {
		let id = e.currentTarget.dataset.id
		wx.navigateTo({url:'../help-question/help-question?id='+id})
	},
	onReady () {
		let that = this
		let token = wx.getStorageSync('token')
		wx.request({
		  url:app.globalData.url+'api/helpList',
		  header:{"Authorization": "Bearer "+token},
		  success: function(res) {
		    if(res.statusCode === 401){
		    	wx.redirectTo({
					url: '../login/login'
				})
		    }
		    that.setData({
		    	infos : res.data.data.data
		    })
		  }
		})
	}
})