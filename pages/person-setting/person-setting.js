var app = getApp()
Page({
	data: {
       infos:Object
   },
	toData () {
		wx.navigateTo({
			url: '../person-data/person-data'
			})
	},
	del(e) {
		let id = e.currentTarget.dataset.id
		let token = wx.getStorageSync('token')
		let that = this
		wx.showModal({
		  title: '删除',
		  content: '确认删除宝宝信息',
		  success: function(res) {
		    if (res.confirm) {
					wx.request({
				    url:app.globalData.url+'api/delChild/'+id+'',
				    method:'GET',
				    header:{"Authorization": "Bearer "+token},
				    success: function(res) {
					    if(res.statusCode === 401){
					    	wx.redirectTo({
									url: '../login/login'
							})
					    }
			              wx.showToast({
			                title: res.data.msg,
			                icon: 'warn',
			                duration: 2000
			              })
					    let data = that.data.infos
				    	for(let i in data){
							let a = data[i].id
							if(a == id){
								data.splice(i,1)
							}
						}
						that.setData({
							infos:data
						})
			     }
			  })	
		    } else if (res.cancel) {
		      
		    }
		  }	
		})
	},
	onLoad(){
		let that = this
		let token = wx.getStorageSync('token')
		wx.request({
	    url:app.globalData.url+'api/userChild',
	    header:{"Authorization": "Bearer "+token},
	    success: function(res) {
		    if(res.statusCode === 401){
		    	wx.redirectTo({
						url: '../login/login'
				})
		    }
		    let infos = res.data.data
		    that.setData({
		    	infos : infos
		    })
	     }
	  })
	}
})