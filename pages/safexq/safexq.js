var app = getApp()
var WxParse = require('../../wxParse/wxParse.js')

Page({
    data:{
        //数据列表
        word:[],
        HOST:app.globalData.url,
    },
    onLoad: function(options) {
        var that = this 
        let token = wx.getStorageSync('token')
        wx.request({
            url:that.data.HOST+'api/insuranceXq/'+options.id,
            //header:{"Authorization": "Bearer "+app.globalData.token},
            header:{"Authorization": "Bearer "+token},
            success: function(res) {
                if(res.statusCode === 401){
                    wx.redirectTo({
                        url: '../login/login'
                    })
                }
                //console.log(res.data.data)
                that.setData({
                    word : res.data.data,
                })
                //console.log(res.data.data.content)
                let info = res.data.data
                WxParse.wxParse('article','html',info.content,that)   
               
            }
		})
    }, 
})