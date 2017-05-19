var app = getApp()
Page({
    data: {
       //全局域名
       HOST:app.globalData.url,
       //传递的关键字
       sendkey:'',
       //读取的数据
       oldcode:Object,


    },
    onLoad: function(options) {
        var that = this
        let token = wx.getStorageSync('token')
        wx.request({
            url:that.data.HOST+'api/search/history',
            //header:{"Authorization": "Bearer "+app.globalData.token},
            header:{"Authorization": "Bearer "+token},
            success: function(res) {
                if(res.statusCode === 401){
                    wx.redirectTo({
                            url: '../login/login'
                    })
                }
                that.setData({
                    oldcode : res.data.data
                })
                
            }    
        })
    },
    //跳转页面
    golist:function(event){
        let that = this
        //自行绑定的参数
        let wkey = event.currentTarget.dataset.wkey 
        wx.redirectTo({
            url: '../shoplist/shoplist?category_id=0&key='+ wkey +'&status=1'
        }) 
    },
    //点搜索跳转
    keyjump:function(event){
        let that = this
        //自行绑定的参数
        let wkey = event.currentTarget.dataset.sendkey 
        wx.redirectTo({
            url: '../shoplist/shoplist?category_id=0&key='+ forms +'&status=1'
        })

    },
    formSubmit:function(e) {
        let forms = e.detail.value
        let fkey = forms.key
        wx.redirectTo({
            url: '../shoplist/shoplist?category_id=0&key='+ fkey +'&status=1'
        })
    },
    
})