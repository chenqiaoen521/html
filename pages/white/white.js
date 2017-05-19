//logs.js

Page({
  onLoad () {
    wx.showModal({
      title: '提示',
      content: '您已拒绝微信授权,请删除小程序重新进入授权。',
      showCancel:false,
      confirmText:'确定',
      success: function(res) {
      }
    })
  }
})
