var app = getApp()
Page({
   data: {
       userInfo:Object,
       no_pay:0,
       fahuo:0,
       shouhuo:0,
       member:0,
       tel:null
   },
   toSetting () {
        wx.navigateTo({
            //url: '../person-setting/person-setting'
            url: '../person-data/person-data'
        })
   },
   toMess () {
        wx.navigateTo({
            url: '../mess/mess'
        })
   },
   toAddress () {
       wx.navigateTo({
          url: '../address/address'
        })
   },
   checkOrder (e) {
    let id = e.currentTarget.dataset.id
        wx.navigateTo({
          url: '../order/order?type='+id
        })
   },
   toHelp () {
       wx.navigateTo({
          url: '../help/help'
        })
   },
   toFav () {
        wx.navigateTo({
          url: '../collection/collection'
        })
   },
   callPhone () {
        wx.makePhoneCall({
          phoneNumber: this.data.tel
        })
   },
   onShow () {
    this.__getData()
   },
   onLoad () {
      app.getkf((tel) => {
        this.setData({
          tel:tel
        })
      })
      app.getUserInfo((userInfo) => {
          this.setData({
            userInfo:userInfo
        })
      })
      app.getMember((id) => {
        this.setData({
            member:id
        })
      })
      this.__getData()
   },
   __getData() {
    let that = this
      let token = wx.getStorageSync('token')  
      wx.request({
        url:app.globalData.url+'api/getOrderCount',
        header:{"Authorization": "Bearer "+token},
        success (res) {
          if(res.statusCode === 401){
            wx.redirectTo({
              url: '../login/login'
            })
          }
          that.setData({
            no_pay:res.data.data.no_pay,
            fahuo:res.data.data.fahuo,
            shouhuo:res.data.data.shouhuo
          })
        },
        fail (e) {
          wx.redirectTo({
                url: '../login/login'
            })
          }
      })
   }
})