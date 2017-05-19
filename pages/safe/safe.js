var app = getApp()
Page({
    data:{
        //数据列表
        datalist:[],
        HOST:app.globalData.url,
    },
    onLoad: function(options) {
        var that = this 
        wx.request({
            url:that.data.HOST+'api/insurance',
            //header:{"Authorization": "Bearer "+app.globalData.token},
            success: function(res) {
                that.setData({
                    datalist : res.data.data,
                })
            }
		})
    },
    //跳转页面
    goxq:function(event){

        wx.navigateTo({
          url: '../safexq/safexq?id='+event.currentTarget.dataset.alphaBeta,
          success: function(res){
            // success
          },
          fail: function() {
            // fail
          },
          complete: function() {
            // complete
          }
        })
    }
    
})