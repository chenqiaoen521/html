var app = getApp()
Page({
	data: {
		type:0,
    order_list:[],                                       //取消订单
    big_status:["待发货", "已发货", "确认收货", "已完成", "订单已关闭", "订单关闭", "删除订单", "待付款", ""],
    HOST:app.globalData.url,
    next_page_url:app.globalData.url+'api/orderList',
    upflag:true
  },
  searchSubmit (e) {
    let name = e.detail.value.name
    if (wx.showLoading) {
        wx.showLoading({title:"小奴正在努力加载"})
      }
    this.setData({
      next_page_url:app.globalData.url+'api/orderList',
      order_list:[]
    })
    if(this.data.type == 0){
      this._getData({'order_num':name})
    }else{
      this._getData({'big_status':this.data.type,'order_num':name})
    }
  },
  //跳回首页
    jumpback: function(event) {
        wx.switchTab({
            url: '../index/index'
        })
    },
  /**详情*/
    toOrder (e) {
      let oid = e.currentTarget.dataset.oiId
        wx.navigateTo({
   		    url: '../order-detail/order-detail?oiId='+oid
   	    })
    },
    /**支付*/
    toPay (e) {
      let params = e.currentTarget.dataset
      wx.navigateTo({
          url: '../paydan/paydan?num='+params.num+'&price='+params.price+'&status='+params.status+'&oid='+params.oid
        })
    },
    /**物流 */
    wuliu (e) {
      let params = e.currentTarget.dataset
      wx.navigateTo({
          url: '../logistic/logistic?id='+params.id+'&imgurl='+params.imgurl+'&count='+params.count
        })
    },
    /**上拉分页*/
    onReachBottom (){
      if (wx.showLoading) {
        wx.showLoading({title:"正在加载中..."})
      }
      let id = this.data.type
      if(id == 0){
          this._getData()
        }else{
          this._getData({'big_status':id})
        }
    },
    _getData(data){
      let that = this
      let token = wx.getStorageSync('token')  
      if(that.data.next_page_url == undefined){
        wx.showToast({  
          title: '已经到最后一页',
          icon: 'warn',
          duration: 2000
        }) 
        return 
      }
      wx.request({
        url:that.data.next_page_url,
        data : data,
        header:{"Authorization": "Bearer "+token},
        success (res) {
          if(res.statusCode === 401){
            wx.redirectTo({
                  url: '../login/login'
              })
          }
          let orderList = res.data.data.order_list
          /**获取 订单类型*/
          for(var i in orderList){
            let id = orderList[i].big_status
            orderList[i].order_name = that.data.big_status.slice(id-1, id)
          }
          /**分页*/
          let next_page_url = res.data.data.items.next_page_url
          if(next_page_url != undefined){
              next_page_url = next_page_url.replace(/http:/g,'https:')
          }
          that.setData({
            next_page_url:next_page_url,
            order_list:that.data.order_list.concat(orderList)
          })
          if (wx.hideLoading) {
            wx.hideLoading()
          }
        },
        fail (e) {
          if (wx.hideLoading) {
            wx.hideLoading()
          }
          that.setData({
            upflag:false
          })
        },
        complete () {
          if (wx.hideLoading) {
            wx.hideLoading()
          }
        }
      })
    },
    todetail (e) {
      wx.navigateTo({
        url:'../details/details?id='+e.currentTarget.dataset.id
      })
    },
    checkOrder (e) {
      if (wx.showLoading) {
        wx.showLoading({title:"小奴正在努力加载"})
      }
        let id = parseInt(e.currentTarget.id)
        this.setData({
          type:id,
          next_page_url:app.globalData.url+'api/orderList',
          order_list:[]
        })
        if(id == 0){
          this._getData()
        }else{
          this._getData({'big_status':id})
        }
   },
    onLoad (options) {
      let type = parseInt(options.type)
      this.setData({
        type:type
      })
    	if(type == 0){
          this._getData()
        }else{
          this._getData({'big_status':type})
        }
    },
    changeType (e) {
      let id = e.currentTarget.dataset.id
      let type = e.currentTarget.dataset.type
      let that = this
      let str = ''
      switch (type){
        case -2 : 
          str = '订单删除'  
          break;
        case 5 :  
          str = '取消订单' 
          break;
          case 3 :  
          str = '确认收货' 
          break;

      }
      wx.showModal({
        title: '确认'+str,
        success: function(res) {
          if (res.confirm) {
            that._changeStatus(id,type)
          } else if (res.cancel) {

          }
        }
      })
    },
    _changeStatus(orderId,type){
      let that = this
      let token = wx.getStorageSync('token')  
      wx.request({
        url:app.globalData.url+'api/changeStatus/oi_'+orderId+"/"+type,
        header:{"Authorization": "Bearer "+token},
        success (res) {
          if(res.statusCode === 401){
            wx.redirectTo({
                  url: '../login/login'
              })
          }
          that.setData({
            next_page_url:app.globalData.url+'api/orderList',
            order_list:[]
          })
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000,
            success :function(){
              if(that.data.type == 0){
                that._getData()
              }else{
                that._getData({'big_status':that.data.type})
              }
            }
          })
        },
        fail (e) {
        }
      })
    },
})