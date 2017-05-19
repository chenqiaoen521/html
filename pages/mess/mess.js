var app = getApp()
Page({
    data: {
        articles:Object,
        next_page_url:app.globalData.url+'api/index_notice'
    }, 
    onReady () {
	  this._getData()
    },
    _getData(){
	  let that = this
      let token = wx.getStorageSync('token')  
      wx.request({
        url:that.data.next_page_url,
        header:{"Authorization": "Bearer "+token},
        success (res) {
          if(res.statusCode === 401){
            wx.redirectTo({
                  url: '../login/login'
              })
          }
          let articles = res.data.data
          for(var i in articles){
          	articles[i].created_at = articles[i].created_at.split(' ')[0]
          }
          that.setData({
            articles:articles
          })
        },
        fail (e) {
        }
      })
    }
})