var app = getApp()
Page({
	onLoad () {
		let that = this
		let token = wx.getStorageSync('token')
		wx.request({
    		url:app.globalData.url+'api/refresh',
    		method:'POST',
  			header:{"Authorization": "Bearer "+token},
  			success (res) {

          console.log(res)
  				if(!res.data.success){
  					/*wx.showModal({
			            title: '提示',
			            content: '程序出现错误,请删除后从新下载',
			            showCancel:false,
			            confirmText:'确定',
			            success: function(res) {
			            	wx.switchTab({
  								url: '../index/index'
							})
		  				}
			  		})*/
			  		return
			  	}
  				wx.setStorageSync('token',res.data.data.token)
  				wx.showToast({
				  title: '登录成功',
				  icon: 'success',
				  duration: 2000,
				  success () {
				  	wx.switchTab({
  						url: '../index/index'
					})
				  }
				})

  			}
    	})	
	}
})