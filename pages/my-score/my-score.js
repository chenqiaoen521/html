var app = getApp()
Page({
    data :{

    },
    submit (e) {
    	let forms = e.detail.value
	    let that = this
	    let token = wx.getStorageSync('token')
	      wx.request({
	        url:app.globalData.url+'api/child',
	        data:forms,
	        header:{"Authorization": "Bearer "+token},
	        method:'POST',
	        success: function(res) {
	        if(res.statusCode === 401){
            	wx.redirectTo({
                  url: '../login/login'
              })
          	}
	        if(!res.data.success){
	        	wx.showToast({
	                title: res.data.msg,
	                icon: 'warn',
	                duration: 2000
	              })
	        	return
	        }else{
	        	wx.showToast({
	              title: '添加成功',
	              icon: 'success',
	              duration: 2000,
	              success (e) {
	              	setTimeout(function(){
	              		wx.redirectTo({
	              			url:'../person-setting/person-setting'
	              		})
	              	},1000)
	              }
	            })     
	          }
	         }
	      })
    }
})