//app.js

App({
  onShow () {
    wx.switchTab({
      url: 'pages/index/index'
    })
  },
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var that = this
    //获取ID
    wx.login({
      success:function(res){
        let code = res.code
        if(res.code){
          wx.getUserInfo({
            withCredentials:true,
            fail (e) {
              wx.redirectTo({
                url:'../white/white'
              })
            return
            }, 
            success: function (res) {
              wx.request({
                url:that.globalData.url+'code2session',
                method:'POST',
                data : {
                  'iv':res.iv,
                  'encryptedData':res.encryptedData,
                  'code':code
                },
                success (e) {
                  let arr = e.data.split(',')
                  wx.setStorageSync('session',arr[0])
                  wx.setStorageSync('token',arr[1])
                  let flag = parseInt(arr[2]) //填写邀请码标志位
                  if(flag == 0){
                    setTimeout(function(){
                      wx.showModal({
                        title: '完善资料,专享线上优惠券',
                        confirmColor:'#222',
                        cancelColor:'#ff6698',
                        confirmText:'去填写',
                        cancelText:'暂不填写',
                        success: function(res) {
                          if (res.confirm) {
                            wx.navigateTo({
                              url:'../person-data/person-data'
                            })
                          } else if (res.cancel) {
                          }
                        }
                      })
                    },3000)
                  }
                },
                complete (e) {
                },
                fail (e){

                }

              })
            }
          })
        } else {
          
        }
      },
      fail () {
      }
    })
  },
  onError (e) {
    
  },
  getkf(cb){
    let that = this
    if(this.globalData.hotTel){
      typeof cb == "function" && cb(this.globalData.hotTel)
    }else{
      wx.request({
        url:that.globalData.url+'api/hot_tel',
          success:function(res) {
            that.globalData.hotTel = res.data.data
          typeof cb == "function" && cb(that.globalData.hotTel) 
        }
      })
    }
  },
  getMember (cb) {
    let token = wx.getStorageSync('token')  
    let that = this
    wx.request({
      url:that.globalData.url+'api/user',
      header:{"Authorization": "Bearer "+token},
      success (res) {
        if(res.statusCode === 401){
          wx.redirectTo({
            url: '../login/login'
          })
        }
      cb(res.data.data.id)
      },
      fail (e) {
        
      }
    })
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              let info = res.userInfo
              let token = wx.getStorageSync('token') 
              that.globalData.userInfo = info
              that.globalData.member
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData:{
    userInfo:null,
    member:null,
    hotTel:null,
    url : 'https://www.jyhbaby.com/' 
  }
  
})