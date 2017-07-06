//var WxParse = require('../../wxParse/wxParse.js');

var app = getApp()
var arr=[]
var lin
var WxParse = require('../../wxParse/wxParse.js')
var id = ''
Page({
    data: {
        //收藏
        keep:true,  
        //弹出的属性框
        popkind:false,
        //添加的商品数量
        carnum:1,
        //公共性域名
        HOST:app.globalData.url,
        //数据
        shuju:{},
        //数据描述
        descri:' ',
        //对比数
        cnum:0,
        //组合属性
        zuhe:'',
        //属性数组
        goodstr:Object,
        //设置参考
        flag:false,
        //价格
        goodprice:'',
        //库存
        goodkucun:'',
        is_integral:false,
        goodjifen:'',
    },
    onShareAppMessage () {
        wx.showShareMenu({
            withShareTicket: true
        })
        return {
          title: '聚婴汇',
          path: '/pages/details/details?id='+id
        }
    },
    onLoad: function(options) {
        var that = this 
        wx.getSystemInfo({
            success: function(res) {
                that.setData({ imghight: res.windowWidth})
            }
        })

        let token = wx.getStorageSync('token')
        id = options.id
        wx.request({
            url:that.data.HOST+'api/goods/'+options.id,
            //header:{"Authorization": "Bearer "+app.globalData.token},
            header:{"Authorization": "Bearer "+token},
            success: function(res) {
                if(!res.data.success){
                    wx.showToast({
                      title: '商品已下架或商品不存在',
                      icon: 'success',
                      duration: 2000,
                      complete () {
                        setTimeout(function(){
                           wx.navigateBack({
                            delta: 1
                            }) 
                        },1000)
                      }
                  })  
                }
                let info = res.data.data
                if(res.data.data.is_integral == 1){
                    that.setData({
                        is_integral:true
                    })
                }
                that.setData({
                    shuju: res.data.data,
                    keep:res.data.data.goodsKeep,
                    goodstr:res.data.data.goods_attr,
                    goodprice:res.data.data.sell_price,
                    goodkucun:res.data.data.stock,
                    goodjifen:res.data.data.integral,
                })        
                WxParse.wxParse('article','html',info.content,that)           
            }
            
		})
        arr = []
    }, 
    //弹出分类选择
    popbuy:function(){
        var that = this;
        that.setData({
            popkind: !that.data.popkind
        });  
    },
    //弹出分类选择-加入购物车
    popbuyjr:function(){
        var that = this;

        let token = wx.getStorageSync('token')
        if(that.data.popkind){
            wx.request({
                url:that.data.HOST+'api/addCar',
                header:{"Authorization": "Bearer "+token},
                data:{goods_id:that.data.shuju.id,num:that.data.carnum,attr_ids:that.data.zuhe,useId:5},
                method:'POST',
                success: function(res) {
                    if(res.statusCode === 401){
                        wx.redirectTo({
                            url: '../login/login' 
                        })
                    }
                    // else if(res.statusCode === 1004){
                    //     wx.showToast({
                    //         title: '此商品库存不足',
                    //         icon: 'success',
                    //         duration: 2000
                    //     })
                    // }
                    else{
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'success',
                            duration: 1500
                        }) 
                        that.setData({                                        
                            popkind: !that.data.popkind
                        });
                    }          
                }
            })
    
        }
        else{
            that.setData({ popkind: !that.data.popkind }); 
        } 
    },
    //弹出分类选择-立即购买
    popbuygm:function(){
        var that = this;
        let token = wx.getStorageSync('token')
        if(that.data.popkind){
            wx.request({
                url:that.data.HOST+'api/buyGoods',
                header:{"Authorization": "Bearer "+token},
                method:'POST',
                data:{goods_id:that.data.shuju.id,num:that.data.carnum,attr_ids:that.data.zuhe,useId:5},
                success: function(res) {
                    // that.setData({
                    //     popkind: !that.data.popkind
                    // });
                    let chuan = res.data.data
                    
                    if(res.data.success){                       
                        wx.navigateTo({url:'../makedan/makedan?data='+chuan+'&addr_id=0&coupon_id=0'})
                    }else{                       
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'success',
                            duration: 1500
                        }) 
                        that.setData({
                            popkind: !that.data.popkind
                        });
                    }                                    
                }
            })
        }
        else{
            that.setData({ popkind: !that.data.popkind }); 
        } 
    },
    //收藏
    keepstar:function(event){
        var status = 1;
        var that = this;
        if(that.data.keep=='yes'){
           status = -1; 
        }
        let token = wx.getStorageSync('token')
        wx.request({
            url:that.data.HOST+'api/collect',
            //header:{"Authorization": "Bearer "+app.globalData.token},
            header:{"Authorization": "Bearer "+token},
            data:{goods_id:that.data.shuju.id},
            success: function(res) {
                if(res.statusCode === 401){
                    wx.redirectTo({
                        url: '../login/login' 
                    })
                }
                if(status == 1){
                    that.setData({ keep:"yes" }) 
                    wx.showToast({
                        title: '收藏成功',
                        icon: 'success',
                        duration: 1500
                    })
                }else{
                    that.setData({ keep:"no" })
                    wx.showToast({
                        title: '取消收藏成功',
                        icon: 'success',
                        duration: 1500
                    })
                }
            }
		})                
    },
    //数量加
    jia:function(event){
        var that = this;
        //判断库存
        if(that.data.carnum < that.data.goodkucun){
            that.setData({
                carnum :  ++ that.data.carnum
            });
        }else{
            wx.showToast({
                title: '该商品库存不足',
                icon: 'success',
                duration: 1500
            })
        }   
    },
    //数量减
    jian:function(event){
        var that = this;
        if(that.data.carnum>1){
            that.setData({
                carnum :  -- that.data.carnum
            });
        }     
    },
    //加入购物车
    submit:function(event) {
        var that = this;
        if(!that.data.popkind){
            that.setData({
                popkind: !that.data.popkind
            });  
        }else{
            let l=that.data.shuju.goods_attr.length
            let zu = arr.join(',')
            if(l>0){
                if(arr.length<l||typeof arr[0]==='undefined'){
                    wx.showToast({
                        title: '请选择商品属性',
                        icon: 'success',
                        duration: 1500
                    })
                }else{
                    //是否有此组合
                    if(that.data.shuju.attr_json.sys_attrprice[zu]){
                        that.setData({
                            zuhe:zu,
                            goodprice : that.data.shuju.attr_json.sys_attrprice[zu].sell_price, 
                            goodkucun : that.data.shuju.attr_json.sys_attrprice[zu].stock, 
                            goodjifen : that.data.shuju.attr_json.sys_attrprice[zu].integral,     
                        })
                        that.popbuyjr()  
                    }
                    else{
                        wx.showToast({
                            title: '暂无此组合,请重新选择',
                            icon: 'success',
                            duration: 1500
                        })
                    } 
                }  
            }else{
                that.setData({
                    zuhe:null,    
                })  
                that.popbuyjr()  
            }

        }
    },
    //立即购买
    submit2:function(event) {
        var that = this;
        if(!that.data.popkind){
            that.setData({
                popkind: !that.data.popkind
            });  
        }else{
            let l=that.data.shuju.goods_attr.length
            let zu = arr.join(',')
            if(l>0){
                if(arr.length<l||typeof arr[0]==='undefined'){
                    wx.showToast({
                        title: '请选择商品属性',
                        icon: 'success',
                        duration: 1500
                    })
                }else{
                    //是否有此组合
                    if(that.data.shuju.attr_json.sys_attrprice[zu]){
                        that.setData({
                            zuhe:zu,
                            goodprice : that.data.shuju.attr_json.sys_attrprice[zu].sell_price, 
                            goodkucun : that.data.shuju.attr_json.sys_attrprice[zu].stock, 
                            goodjifen : that.data.shuju.attr_json.sys_attrprice[zu].integral,        
                        })
                        that.popbuygm()  
                    }
                    else{
                        wx.showToast({
                            title: '暂无此组合,请重新选择',
                            icon: 'success',
                            duration: 1500
                        })
                    } 
                } 
            }else{
                that.setData({
                    zuhe:null,    
                })  
                that.popbuygm()  
            }     
        }
    },
    //选择属性
    chose:function(event) {
        var that = this;
        if(!that.data.popkind){
            that.setData({
            popkind: !that.data.popkind
        });  
        }else{
            let sxid = event.currentTarget.dataset.sxid
            let sxnum = event.currentTarget.dataset.sxnum
            arr[sxnum] = sxid
            lin = sxid
            let l=that.data.shuju.goods_attr.length
            arr.splice(sxnum,1,sxid)
            let zu = arr.join(',')
            
            if(arr.length<l||typeof arr[0]==='undefined'){
                   
                }else{
                    //是否有此组合
                    if(that.data.shuju.attr_json.sys_attrprice[zu]){
                        that.setData({
                            zuhe:zu,
                            goodprice : that.data.shuju.attr_json.sys_attrprice[zu].sell_price, 
                            goodkucun : that.data.shuju.attr_json.sys_attrprice[zu].stock, 
                            goodjifen : that.data.shuju.attr_json.sys_attrprice[zu].integral,        
                        })
                       //that.popbuyjr()  
                    }
                    else{
                        wx.showToast({
                            title: '暂无此组合,请重新选择',
                            icon: 'success',
                            duration: 1500
                        })
                    } 
                }  
        }
        
    },   
})



