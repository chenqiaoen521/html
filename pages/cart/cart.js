var app = getApp()
Page({
    data:{
        //列表
        liebiao:{},
        //公共域名
        HOST:app.globalData.url,
        //合计
        heji:0,
        //个数
        ge:0,
        //是否全选
        allchose:false,

    },
    onShow: function(options) {
        var that = this 
         wx.getSystemInfo({
            success: function(res) {
                that.setData({ imghight: res.windowWidth})
            }
        })
        var token = wx.getStorageSync('token')
        wx.request({
            url:that.data.HOST+'api/shopcar',
            header:{"Authorization": "Bearer "+token},
            success: function(res) {
                if(res.statusCode === 401){
                    wx.redirectTo({
                            url: '../login/login'
                    })
                }
                that.setData({
                    liebiao: res.data.data,
                })    
            }
        })
    }, 
    onLoad: function(options) {
        var that = this 
         wx.getSystemInfo({
            success: function(res) {
                that.setData({ imghight: res.windowWidth})
            }
        })

        var token = wx.getStorageSync('token')
        wx.request({
            url:that.data.HOST+'api/shopcar',
            header:{"Authorization": "Bearer "+token},
            success: function(res) {
                if(res.statusCode === 401){
                    wx.redirectTo({
                            url: '../login/login'
                    })
                }
                that.setData({
                    liebiao: res.data.data,
                }) 
                /*var id = ''
                for(var i=0; i<that.data.liebiao.stock_yes.length;i++){
                    if(i==0){ id = that.data.liebiao.stock_yes[i].id}
                    else{
                        id += ','+that.data.liebiao.stock_yes[i].id
                    }
                }
                console.log(id)*/   
            }
        }) 
    }, 
    //跳回首页
    jumpback: function(event) {
        wx.switchTab({
            url: '../index/index'
        })
    },
    //单选
    sgchose:function(event){
        var that = this;
        var dex = event.currentTarget.dataset.index;
        var n =1; 

        if(that.data.liebiao.stock_yes[dex].check==0){
            that.data.liebiao.stock_yes[dex].check = 1
        }else{
            that.data.liebiao.stock_yes[dex].check = 0
        }

        that.setData({
             liebiao :  that.data.liebiao
        });
        
        //如果是全选状态
        if(that.data.allchose){
            that.setData({
                allchose: !that.data.allchose,
            })   
        }
        //没全选
        else{
            var l = that.data.liebiao.stock_yes.length;
            
            for(var i = 0; i<l;i++ ){
                if(that.data.liebiao.stock_yes[i].check==0){n=0} 
                //console.log(n)   
            }
            //console.log(n)
            if(n==1){
                that.setData({
                    allchose: !that.data.allchose,
                })
            }
        }

        that.getsum(); 
        that.getprice(); 
    },
    //全选
    allchoses:function(){
        var that = this 
        that.setData({
            allchose: !that.data.allchose
        }) 

        var l = that.data.liebiao.stock_yes.length; 
        for(var i = 0; i<l;i++ ){
            if(that.data.allchose){
                that.data.liebiao.stock_yes[i].check=1
            } 
            else{ 
                that.data.liebiao.stock_yes[i].check=0 
            }  
        }
        that.getsum() 
        that.getprice()
    },
    //数量加
    jia:function(event){
        var that = this;
        var dex = event.currentTarget.dataset.index;
        var shopid = event.currentTarget.dataset.shopid;
        var carid = event.currentTarget.dataset.carid;
        //判断库存
        if(that.data.liebiao.stock_yes[dex].num < that.data.liebiao.stock_yes[dex].stock){
            that.data.liebiao.stock_yes[dex].num = ++ that.data.liebiao.stock_yes[dex].num 
            that.setData({
                liebiao :  that.data.liebiao
            });
            var snum = that.data.liebiao.stock_yes[dex].num
        }
        var token = wx.getStorageSync('token')
        wx.request({
            url:that.data.HOST+'api/editCarNum/'+carid,
            header:{"Authorization": "Bearer "+token},
            data:{goods_id:shopid,num:snum},
            method:'POST',
            success: function(res) {      
            }
        })

        that.getsum()
        that.getprice()    
    },
    //数量减
    jian:function(event){
        var that = this;
        var dex = event.currentTarget.dataset.index;
        var shopid = event.currentTarget.dataset.shopid;
        var carid = event.currentTarget.dataset.carid;
        if(that.data.liebiao.stock_yes[dex].num>1){
            that.data.liebiao.stock_yes[dex].num = -- that.data.liebiao.stock_yes[dex].num 
            that.setData({
                liebiao :  that.data.liebiao
            });
            var snum = that.data.liebiao.stock_yes[dex].num
        } 
        var token = wx.getStorageSync('token')
        wx.request({
            url:that.data.HOST+'api/editCarNum/'+carid,
            header:{"Authorization": "Bearer "+token},
            data:{goods_id:shopid,num:snum},
            method:'POST',
            success: function(res) {      
            }
        })

        that.getsum()
        that.getprice()  
    },
    
    //核算数量
    getsum:function(){
        var that = this 
        //计算全选的价格
        let sum = 0;
        var l = that.data.liebiao.stock_yes.length;    
        for(var i = 0; i<l;i++ ){
            if(that.data.liebiao.stock_yes[i].check==0){} 
            else{ sum += that.data.liebiao.stock_yes[i].num }  
        }
        that.setData({
            ge: sum
        })
    },
    //核算价格
    getprice:function(){
        var that = this 
        //计算全选的价格
        let sum = 0;
        var l = that.data.liebiao.stock_yes.length;    
        for(var i = 0; i<l;i++ ){
            if(that.data.liebiao.stock_yes[i].check==0){} 
            else{ 
                sum += that.data.liebiao.stock_yes[i].num * (parseInt(that.data.liebiao.stock_yes[i].price*100))/100
             }  
        }
        that.setData({
            heji: (parseInt(sum*100))/100
        })
    },
    //跳转页面
    goxq:function(event){
        wx.navigateTo({
          url: '../details/details?id='+event.currentTarget.dataset.id,
        })
    },
    //删除商品
    delshop:function(event){
        var that =this

        var token = wx.getStorageSync('token')
        // wx.request({
        //     url:that.data.HOST+'api/del_car',
        //     header:{"Authorization": "Bearer "+token},
        //     data:{id:event.currentTarget.dataset.shanid},
        //     success: function(res) {
        //         if(res.statusCode === 401){
        //             wx.redirectTo({
        //                 url: '../login/login'
        //             })
        //         }
        //         wx.showToast({
        //             title: '删除成功',
        //             icon: 'success',
        //             duration: 1500
        //         }) 
        //         that.onLoad()
        //     }
        // }) 
        wx.showModal({
            title: '删除',
            content: '确认要删除该商品吗',
            success: function(res) {
                if (res.confirm) {
                    wx.request({
                        url:that.data.HOST+'api/del_car',
                        header:{"Authorization": "Bearer "+token},
                        data:{id:event.currentTarget.dataset.shanid},
                        success: function(res) {
                            if(res.statusCode === 401){
                                wx.redirectTo({
                                    url: '../login/login'
                                })
                            }
                            wx.showToast({
                                title: '删除成功',
                                icon: 'success',
                                duration: 1500
                            }) 
                            that.onLoad()
                        }
                    }) 
                } else if (res.cancel) {
                   
                }
            }
        })
    },
    //清空失效宝贝
    clearOut:function(){
        var that = this
        var token = wx.getStorageSync('token')
        var id = ''
        for(var i=0; i<that.data.liebiao.stock_no.length;i++){
            if(i==0){ id = that.data.liebiao.stock_no[i].id}
            else{
                id += ','+that.data.liebiao.stock_no[i].id
            }
        }
        wx.showModal({
            title: '删除',
            content: '确认要清空失效宝贝吗',
            success: function(res) {
                if (res.confirm) {
                    wx.request({
                        url:that.data.HOST+'api/delShiXiao',
                        data:{id:id},
                        header:{"Authorization": "Bearer "+token},
                        success: function(res) {
                            if(res.statusCode === 401){
                                wx.redirectTo({
                                    url: '../login/login'
                                })
                            }
                            wx.showToast({
                                title: '失效宝贝已清空',
                                icon: 'success',
                                duration: 1500
                            }) 
                            that.onLoad()
                        }
                    }) 
                } else if (res.cancel) {
                   
                }
            }
        })
        
    },
    //去订单
    godan:function(){
        var that = this
        if(that.data.ge==0){
            wx.showToast({
                title: '请先选择要结算的商品',
                icon: 'success',
                duration: 1500
            }) 
        }else{
            let str ='';
            var l = that.data.liebiao.stock_yes.length;    
            for(var i = 0; i<l;i++ ){
                if(that.data.liebiao.stock_yes[i].check==0){} 
                else{ 
                    if(str==''){
                        str = that.data.liebiao.stock_yes[i].id + '_' + that.data.liebiao.stock_yes[i].num
                    }else{
                        str += ','+ that.data.liebiao.stock_yes[i].id + '_' + that.data.liebiao.stock_yes[i].num
                    }                        
                }  
            }
            var token = wx.getStorageSync('token');
            var chuan='';
            wx.request({
                url:that.data.HOST+'api/shopping_cart',
                header:{"Authorization": "Bearer "+token},
                data:{data:str},
                success: function(res) {
                    if(res.statusCode === 401){
                        wx.redirectTo({
                            url: '../login/login'
                        })
                    }
                    chuan = res.data.data
                    if(res.data.success!='false'){
                        wx.navigateTo({url:'../makedan/makedan?data='+chuan+'&addr_id=0&coupon_id=0'})
                        that.setData({
                            ge: 0,
                            heji:0,
                            allchose:false,
                        }) 
                    }else{                       
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'success',
                            duration: 1500
                        }) 
                    }
                    
                }
            }) 

        }
        
    },
    //走了
    onUnload:function(){
        
    }
    
})