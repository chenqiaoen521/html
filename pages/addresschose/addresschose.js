

var app = getApp()
var chuan
var attr
var coupon
Page({
	data:{
		addresses:Object
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
    onLoad:function(options) {
		let that = this
		let token = wx.getStorageSync('token')
		chuan = options.data
        attr = options.addr_id
        coupon = options.coupon_id
		wx.request({
		    url:app.globalData.url+'api/user_address',
		    header:{"Authorization": "Bearer "+token},
		    success: function(res) {
		    	console.log(res)
			    if(res.statusCode === 401){
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
	},
    toback:function(e) {
        let id = e.currentTarget.dataset.id
        console.log(id)
        wx.redirectTo({
   		    url: '../makedan/makedan?data='+chuan+'&addr_id='+id+'&coupon_id='+coupon
   	    })
    },
    toDetail (e) {
		wx.navigateTo({
		   url: '../address-detail/address-detail?data='+chuan+'&coupon_id='+coupon
	    })
    }
})