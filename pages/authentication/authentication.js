
var app = getApp()
var util = require('../../utils/util.js')
const GOODS = 1
const SWIM = 2
const DELIVERY = 3
const REGISTER = 0

Page({
    data:{
        coupon:[],
        data:Object,
        addr:Object,
        quan:Object,
        member:String,
        //next_page_url:app.globalData.url+'api/voucher_buy_list/'+typenumber,
        next_page_url:String,
        typenumber:Object,
    },
    upload () {
        wx.chooseImage({
          count: 1, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            var tempFilePaths = res.tempFilePaths
             }
            })
    },
    onLoad (e) {
        
    },
    onShow () {
        
    },
    
    
    onReady () {
        
    },
 
    
    
    
})