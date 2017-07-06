var app = getApp()
Page({
    data :{
    	list:[],
    	next_page_url:app.globalData.url+'api/convertRecord',
    	HOST:app.globalData.url
    },
    onLoad(){
    	this.getMember();
    },
    getMember () {
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
      		success (res) {
		        if(res.statusCode === 401){
		          wx.redirectTo({
		            url: '../login/login'
		          })
		        }
		        let list = res.data.data.data
		        console.log(list)
		        /**分页*/
	          	let next_page_url = res.data.data.next_page_url
	          	if(next_page_url != undefined){
	              next_page_url = next_page_url.replace(/http:/g,'https:')
	          	}
	          	that.setData({
	           	 next_page_url:next_page_url,
	            	list:that.data.list.concat(list)
	          	})
	            if (wx.hideLoading) {
	            	wx.hideLoading()
	            }
      		},
      		fail (e) {
        
      		}
    	})
    },
    /**上拉分页*/
    onReachBottom (){
      if (wx.showLoading) {
        wx.showLoading({title:"正在加载中..."})
      }
      this.getMember()
    },
})