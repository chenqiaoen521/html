var app = getApp()
Page({
	data: {
		type:0,
	    order:Object,
	    big_status:["等待卖家发货", "卖家已发货", "确认收货", "交易成功", "取消订单", "订单关闭", "删除订单", "等待买家付款", ""],
	    HOST:app.globalData.url
  	},
	onLoad(options){
		this._getData({'oi_id':options.oiId})
	},
	_getData(data){
      let that = this
      let token = wx.getStorageSync('token')  
      wx.request({
        url:app.globalData.url+'api/orderList',
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
          that.setData({
            order:orderList[0]
          })
        },
        fail (e) {
        }
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
    }
})