var app = getApp()
Page({
	data :{
		userInfo:Object,
		date:Object
	},
	add () {
		wx.redirectTo({
          url: '../baby/baby'
        })
	},
	changename () {
		wx.navigateTo({
          url: '../person-data-submit/person-data-submit?name=name&value='+this.data.userInfo.nickname+''
        })
	},
	bindDateChange: function(e) {
	    this.setData({
	      date: e.detail.value
	    })
  	},
	formSubmit(e) {
		var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/
		let info = e.detail.value
		let that = this
		let token = wx.getStorageSync('token')
		if(!info.name){
			wx.showToast({
                title: '昵称不能为空',
                icon: 'success',
                duration: 1500
            })
            return
		}
		if(!info.phone){
			wx.showToast({
                title: '电话不能为空',
                icon: 'success',
                duration: 1500
            })
            return
		}
		if(!myreg.test(info.phone)) {
            wx.showToast({
                title: '手机号输入不正确',
                icon: 'success',
                duration: 1500
            })
            return
        }
		if(!info.sex){
			wx.showToast({
                title: '性别不能为空',
                icon: 'success',
                duration: 1500
            })
            return
		}
		info.baby_birth = that.data.date
		wx.request({
		  url:app.globalData.url+'api/updateUserInfo',
		  data:info,
		  method:'POST',
		  header:{"Authorization": "Bearer "+token},
		  success: function(res) {
		  	if(!res.data.success){
	          wx.showToast({
	            title: res.data.msg,
	            icon: 'warn',
	            duration: 2000
	          })
	      	}else{
	      		wx.showToast({
			    title: '保存成功',
			    icon: 'success',
			    duration: 2000
			  })
	      		setTimeout(function(){
	      			wx.navigateBack({
	      				delta:1
	      			})
	      		},1000)
	      	}
		  }
		})
	},
	onLoad () {
		this.__getData()
	},
	onShow () {
		this.__getData()
	},
	__getData() {
		let that = this
		let token = wx.getStorageSync('token')
		wx.request({
		  url:app.globalData.url+'api/user',
		  header:{"Authorization": "Bearer "+token},
		  success: function(res) {
		    if(res.statusCode === 401){
		    	wx.redirectTo({
					url: '../login/login'
				})
		    }
		    if(res.data.data.baby_birth){
		    	that.setData({
		    	date : res.data.data.baby_birth
		    	})
		    }
		    that.setData({
		    	userInfo : res.data.data
		    })
		  }
		})
	}
})