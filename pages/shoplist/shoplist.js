var app = getApp()
var flag
Page({
    data: {
        //综合
        zong:1, 
        //销量
        salenum:0, 
        //价格
        price:0, 
        //shuju
        kindlist:Object,
        //全局域名
        HOST:app.globalData.url,
        //传递的参数
        c_id:Object,
        //状态参数
        statusCode:0,
        //传递的关键字
        sendkey:'',
        //下一页
        next_page_url:''
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
        //let c_id = options.category_id
        if(options.flag){flag = options.flag}
        else{flag = 0}
        that.setData({
            c_id : options.category_id,
            statusCode : options.status,
            sendkey : options.key
        })
        let token = wx.getStorageSync('token')


        if(that.data.sendkey!=undefined && token !=" " ){
            wx.request({
                url:that.data.HOST+'api/goods',
                header:{"Authorization": "Bearer "+token},
                data:{category_id:that.data.c_id,key:that.data.sendkey,status:that.data.statusCode,flag:flag},
                success: function(res) {
                    if(res.statusCode === 401){
                        wx.redirectTo({
                            url: '../login/login' 
                        })
                    }
                    //console.log(res.data.data.next_page_url)
                    that.setData({
                        kindlist : res.data.data.data,
                        next_page_url: res.data.data.next_page_url
                    })
                    //console.log(that.data.next_page_url)
                }
            })       
        }
        else{
            wx.request({
                url:that.data.HOST+'api/goods',
                data:{category_id:that.data.c_id,key:that.data.sendkey,status:that.data.statusCode,flag:flag},
                success: function(res) {
                    if(res.statusCode === 401){
                        wx.redirectTo({
                            url: '../login/login' 
                        })
                    }
                    that.setData({
                        kindlist : res.data.data.data,
                        next_page_url: res.data.data.next_page_url
                    })
                }
            })
        }
    },
    //综合
    zongEvent:function(event){
        let that = this;
        if(that.data.zong==0){
            that.setData({ zong : 1 ,salenum:0,price:0});
        }else if(that.data.zong==1){
            that.setData({ zong : 2 });
        }else{          
            that.setData({ zong : 1 });
        }
    },
    //综合
    salenumEvent:function(event){
        let that = this;
        if(that.data.salenum==0){
            that.setData({ salenum : 1 ,zong:0,price:0});
        }else if(that.data.salenum==1){
            that.setData({ salenum : 2 });
        }else{          
            that.setData({ salenum : 1 });
        }
    },
    //综合
    priceEvent:function(event){
        let that = this;
        if(that.data.price==0){
            that.setData({ price : 1 ,salenum:0,zong:0});
        }else if(that.data.price==1){
            that.setData({ price : 2 });
        }else{          
            that.setData({ price : 1 });
        }
    },
    //排序函数
    maketurns:function(event){
        let that = this;
        //上次点击的
        let oldstatus = that.data.statusCode;
        //现在点的
        let nowstatus = event.currentTarget.dataset.statusid

        if(oldstatus==4&&nowstatus==4){
            that.setData({ statusCode : 5})
        }else if(oldstatus==5&&nowstatus==5){
            that.setData({ statusCode : 4})
        }else{
            that.setData({
                statusCode : nowstatus
            })
        }

        let token = wx.getStorageSync('token')
        wx.request({
            url:that.data.HOST+'api/goods',
            //header:{"Authorization": "Bearer "+app.globalData.token},
            //header:{"Authorization": "Bearer "+token},
            data:{category_id:that.data.c_id,key:that.data.sendkey,status:that.data.statusCode,flag:flag},
            success: function(res) {
                if(res.statusCode === 401){
                    wx.redirectTo({
                        url: '../login/login'
                    })
                }
                that.setData({
                    kindlist : res.data.data.data,
                })
            }
        })


    },
    //跳转页面
    goxq:function(event){
        wx.navigateTo({
          url: '../details/details?id='+event.currentTarget.dataset.shopid,
        })
    },
    //跳回首页
    jumpback: function(event) {
        wx.switchTab({
            url: '../index/index'
        })
    },
    /**上拉分页*/
    onReachBottom: function(){
        // if (wx.showLoading) {
        //     wx.showLoading({title:"正在加载中..."})
        // }
        let that = this
        if(that.data.next_page_url == undefined){
            wx.showToast({  
                title: '没有更多了...',
                icon: 'warn',
                duration: 2000
            }) 
        }else{
            // if (wx.showLoading) {
            //     wx.showLoading({title:"正在加载中..."})
            // } 
            that._getData()
        } 
    },
    //获取数据
    _getData: function(){
        let that = this
        let token = wx.getStorageSync('token')  
        /*console.log('路径'+that.data.next_page_url)
        if(that.data.next_page_url == undefined){
            wx.showToast({  
                title: '没有更多了...',
                icon: 'warn',
                duration: 2000
            }) 
            //return 
        }
        else{*/
        wx.request({
            url:that.data.next_page_url,
            data:{category_id:that.data.c_id,key:that.data.sendkey,status:that.data.statusCode,flag:flag},
            header:{"Authorization": "Bearer "+token},
            success (res) {
                if(res.statusCode === 401){
                    wx.redirectTo({
                        url: '../login/login'
                    })
                }
                let orderList = that.data.kindlist.concat(res.data.data.data)
                //console.log(orderList)
                /**分页*/
                let next_page_url = res.data.data.next_page_url
                if(next_page_url != undefined){
                    next_page_url = next_page_url.replace(/http:/g,'https:')
                }
                that.setData({
                    next_page_url:next_page_url,
                    kindlist:orderList
                })
                
                if (wx.hideLoading) {
                    wx.hideLoading()
                }
            },
            fail (e) {
                if (wx.hideLoading) {
                    wx.hideLoading()
                }
            },
            complete () {
                if (wx.hideLoading) {
                    wx.hideLoading()
                }
            }
        })
        //}
    },
    
})