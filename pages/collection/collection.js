var app = getApp()
Page({
	data: {
		goods:new Array(),
		HOST:app.globalData.url,
		ids:Object,
		favs:Object,
		next_page_url:app.globalData.url+'api/user_collect'
	},
	checkboxChange (e) {
		let params = e.detail.value
		let ids = []
		for(var i in params){
			let temp = params[i].split(',')[0]
			ids.push(temp)
		}
		this.setData({
			ids: ids,
			favs:params
		})
	},
	//跳回首页
    jumpback: function(event) {
        wx.switchTab({
            url: '../index/index'
        })
    },
	cancel () {
		let that = this
		let token = wx.getStorageSync('token')
		let params = this.data.ids.join(',')
		wx.request({
		  url:app.globalData.url+'api/collect/'+params,
		  method:'DELETE',
		  header:{"Authorization": "Bearer "+token},
		  success: function(res) {
		    if(res.statusCode === 401){
		    	wx.redirectTo({
                  url: '../login/login'
              })
		    }
		    wx.showToast({
	            title: '删除成功',
	            icon: 'success',
	            duration: 2000,
	            success () {
	            	wx.redirectTo({url:'collection'})
	            }
            })
		  }
		})
	},
	todetail (e) {
		wx.navigateTo({
			url:'../details/details?id='+e.currentTarget.dataset.id
		})
	},
	onLoad () {
		this._getData()
	},
	/**上拉分页*/
    onReachBottom (){
      this._getData()
    },
	_getData() {
		let that = this
		let token = wx.getStorageSync('token')
		if(that.data.next_page_url == undefined){
        wx.showToast({  
          title: '已经到最后一页',
          icon: 'warn',
          duration: 2000
        }) 
        return 
      }
		wx.request({
		  url:that.data.next_page_url,
		  header:{"Authorization": "Bearer "+token},
		  success: function(res) {
		    if(res.statusCode === 401){
		    	wx.redirectTo({
                  url: '../login/login'
              })
		    }
		    /**分页*/
          let next_page_url = res.data.data.next_page_url
          if(next_page_url != undefined){
              next_page_url = next_page_url.replace(/http:/g,'https:')
          	}
          	if(res.data.data.data){
          		that.setData({
		    	goods : that.data.goods.concat(res.data.data.data),
		    	next_page_url:next_page_url
		    	})	
          	}
		  }
		})
	}
})