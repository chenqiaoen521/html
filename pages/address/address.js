var app = getApp()
Page({
	data:{
		addresses:Object
	},
    toDetail (e) {
        let id = e.currentTarget.dataset.id
        if(id){
        	wx.navigateTo({
   		    	url: '../address-detail/address-detail?id='+id
   	    	})
        }else{
        	wx.navigateTo({
   		    	url: '../address-detail/address-detail'
   	    	})
        }
        
    },
    del (e) {
    	let id = e.currentTarget.dataset.id
    	let that = this
		let token = wx.getStorageSync('token')		
    	wx.showModal({
		  title: '删除',
		  content: '确定删除收货地址',
		  success: function(res) {
		    if (res.confirm) {
					wx.request({
				    url:app.globalData.url+'api/address/'+id+'',
				    method:'DELETE',
				    header:{"Authorization": "Bearer "+token},
				    success: function(res) {
					    if(res.statusCode === 401){
					    	wx.redirectTo({
									url: '../login/login'
							})
					    }
					    let data = that.data.addresses
				    	for(let i in data){
							let a = data[i].id
							if(a == id){
								data.splice(i,1)
							}
						}
						that.setData({
							addresses:data
						})
			     }
			  })	
		    } else if (res.cancel) {
		      
		    }
		  }	
		})	
    },
    onReady () {
	let that = this
	let token = wx.getStorageSync('token')
		wx.request({
	    url:app.globalData.url+'api/user_address',
	    header:{"Authorization": "Bearer "+token},
	    success: function(res) {
		    if(res.statusCode === 401){
		    	/*wx.request({
		    		url:app.globalData.url+'api/refresh',
		    		method:'POST',
		  			header:{"Authorization": "Bearer "+token},
		  			success (res) {
		  				wx.setStorageSync('token',res.data.data.token)
		  			}
		    	})*/
		    	wx.redirectTo({
					url: '../login/login'
				})
		    }
		    let info = res.data.data
		    that.setData({
		    	addresses : info
		    })
	     }
	  })
	}
})