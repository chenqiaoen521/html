var app = getApp()
Page({
    data:{
        //左侧分类
        kind:[],
        //右侧列表
        curkind:Object,
        //选中的类
        num:0,
        //全局域名
        HOST:app.globalData.url,
    },
    onLoad: function(options) {
        var that = this 
        let token = wx.getStorageSync('token')
        wx.request({
            url:that.data.HOST+'api/category',
            //header:{"Authorization": "Bearer "+app.globalData.token},
            header:{"Authorization": "Bearer "+token},
            success: function(res) {
                if(res.statusCode === 401){
                    wx.redirectTo({
                        url: '../login/login'
                    })
                }
                that.setData({
                    kind : res.data.data,
                    curkind : res.data.data[that.data.num].child
                })
            }
		})
        
    },
    getlist:function(event){
        let that = this
        //自行绑定的参数
        let num = event.currentTarget.dataset.alphaBeta 
        let token = wx.getStorageSync('token')
        wx.request({
            url:that.data.HOST+'api/category',
            //header:{"Authorization": "Bearer "+app.globalData.token},
            //header:{"Authorization": "Bearer "+token},
            success: function(res) {
                if(res.statusCode === 401){
                    wx.redirectTo({
                            url: '../login/login'
                    })
                }
                that.setData({
                    num:num,
                    curkind : res.data.data[num].child
                })     
            }
		})   
    },
    golist:function(event){
        let that = this
        let id = event.currentTarget.dataset.golistid
        wx.navigateTo({
            url: '../shoplist/shoplist?category_id='+ id +'&status=1'
        })

    },
  
})