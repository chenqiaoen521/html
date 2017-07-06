var app = getApp()
Page({
    data: {
        imgUrls: [],
        indicatorDots: true,
        autoplay: true,
        interval: 2000,
        duration: 1000,
        kind:[],
        goodlist:[],
        HOST:app.globalData.url,
        ads:[],
        appkind:[],
        firstButton:{},
        movenew:[]
    },
    quan (e) {
        wx.navigateTo({url:'../coupon-fetch/coupon-fetch'})
    },
    onShareAppMessage () {
        wx.showShareMenu({
            withShareTicket: true
        })
        return {
          title: '聚婴汇',
          path: '/pages/index/index'
        }
    },
    onLoad: function(options) {
        var that = this
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    imghight: res.windowWidth
                })              
            }
        })
		wx.request({
            url:that.data.HOST+'api/goods_list',
            success: function(res) {
                that.setData({
                    goodlist : res.data.data
                })
            }
		})
        //轮播banner
        wx.request({
            url:that.data.HOST+'api/banner',
            success: function(res) {
                that.setData({
                    imgUrls : res.data.data
                })
            }
        })
        //广告
        wx.request({
            url:that.data.HOST+'api/ads',
            success: function(res) {
                that.setData({
                    ads : res.data.data
                })
            }
        })
        //分类
        wx.request({
            url:that.data.HOST+'api/app',
            success: function(res) {
                //console.log(res.data.data)
                that.setData({
                    appkind : res.data.data
                })
            }
        })
        //优惠券图标
        wx.request({
            url:that.data.HOST+'api/firstButton',
            success: function(res) {
                console.log(res.data.data)
                that.setData({
                    firstButton : res.data.data
                })
            },
            fail(e){
              console.log(e)
            }
        })
        //移动的新闻
        wx.request({
            url:that.data.HOST+'api/lunboArticles',
            success: function(res) {
              console.log('lunbo')
                console.log(res.data.data)
                that.setData({
                    movenew : res.data.data
                })
            }
        })
        
    },
    //跳转页面
    goxq:function(event){
        wx.navigateTo({
          url: '../details/details?id='+event.currentTarget.dataset.alphaBeta,
        })
    },
    //gomnxq
    gomnxq:function(event){
        wx.navigateTo({
          url: '../help-question/help-question?id='+event.currentTarget.dataset.id,
        })
    },
    //跳转到列表页面
    gokey:function(event){
        wx.navigateTo({
            url: '../shoplist/shoplist?category_id='+ event.currentTarget.dataset.id +'&status=1&flag=1'
        })
    },
    //轮播图跳转
    golink:function(event){
        let n = event.currentTarget.dataset.way;
        if(n==5){
           wx.navigateTo({
              url:'../person-data/person-data'
           }) 
        }else{
           wx.navigateTo({
              url: '../details/details?id='+event.currentTarget.dataset.id,
           })
        }
       
    },
    //楼层到分类
    //url="../shoplist/shoplist?category_id=0&key=宝&status=1"
    tofl (e) {
        let name = e.currentTarget.dataset.key
        name = name.slice(0,1)
        wx.navigateTo({
          url: '../shoplist/shoplist?category_id=0&key='+name+'&status=1'
        })
    }

})