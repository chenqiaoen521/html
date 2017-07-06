
var app = getApp()
var util = require('../../utils/util.js')
const GOODS = 1
const SWIM = 2
const DELIVERY = 3
const REGISTER = 0
Page({
    data :{
    	coupon:Object,
    	toggle:'积分兑换',
    	listView:[],
    	type:1,
    	HOST:app.globalData.url,
    	next_page_url:app.globalData.url+'api/goods',
    	score:0
    },
    //跳转页面
    goxq:function(event){
        wx.navigateTo({
          url: '../details/details?id='+event.currentTarget.dataset.id,
        })
    },
    togglejf (e) {//积分
    	this.setData({
    		toggle:'积分兑换',
    		listView:[],
    		type:1,
    		next_page_url:app.globalData.url+'api/goods'
    	})
    	if (wx.showLoading) {
        	wx.showLoading({title:"正在加载中..."})
      	}
		this.__getData ()
    },
    toggleyhj (e) {//优惠券
    	this.setData({
    		toggle:'优惠券兑换',
    		listView:[],
    		type:2,
    		next_page_url:app.globalData.url+'api/integralVoucher'
    	})
    	if (wx.showLoading) {
        	wx.showLoading({title:"正在加载中..."})
      	}
    	this.__getCouponData()
    },
    onLoad (e) {
	},
	onReady () {
		this.__getData()
		this.getMember()
	},
	onShow(){
		this.getMember()
	},
	/**上拉分页*/
    onReachBottom (){
      if (wx.showLoading) {
        wx.showLoading({title:"正在加载中..."})
      }
      let flag = this.data.toggle
      if(flag){
      	this.__getData() 
      }
      if(!flag){
      	this.__getCouponData() 
      }	 	
    },
    getMember () {
    let token = wx.getStorageSync('token')  
    let that = this
    wx.request({
      url:app.globalData.url+'api/user',
      header:{"Authorization": "Bearer "+token},
      success (res) {
        if(res.statusCode === 401){
          wx.redirectTo({
            url: '../login/login'
          })
        }
      	that.setData({
      		score:res.data.data.integral
      	})
      },
      fail (e) {
        
      }
    })
  },
	__getData () {
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
		    header:{"Authorization": "Bearer "+token},
		    data:{flag:2,status:1,category_id:0},
	    	success: function(res) {
			    if(res.statusCode === 401){
			    	wx.redirectTo({
						url: '../login/login'
					})
			    }else{
			    	let listView = res.data.data.data
			    	/**分页*/
		          	let next_page_url = res.data.data.next_page_url
		          	if(next_page_url != undefined){
		              next_page_url = next_page_url.replace(/http:/g,'https:')
		          	}
		          	that.setData({
		           	 next_page_url:next_page_url,
		            	listView:that.data.listView.concat(listView)
		          })
		          if (wx.hideLoading) {
		            wx.hideLoading()
		          }
		    	}
	     }.bind(this)
	  	})
	},

	__getCouponData () {
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
		    header:{"Authorization": "Bearer "+token},
	    	success: function(res) {
			    if(res.statusCode === 401){
			    	wx.redirectTo({
						url: '../login/login'
					})
			    }else{
			    	let listView = res.data.data
			    	for(var i in listView){
				    	listView[i].percent = util.num2percent(listView[i].surplus,listView[i].num)
			    	}
			    	/**分页*/
		          	let next_page_url = res.data.data.next_page_url
		          	if(next_page_url != undefined){
		              next_page_url = next_page_url.replace(/http:/g,'https:')
		          	}
		          	that.setData({
		           	 next_page_url:next_page_url,
		            	listView:that.data.listView.concat(listView)
		          	})
		          if (wx.hideLoading) {
		            wx.hideLoading()
		          }
		    	}
	     }.bind(this)
	  	})
	},
	fetchCoupon (e) {
		let id = e.currentTarget.dataset.id
		let that = this
		let token = wx.getStorageSync('token')
		wx.request({
		    url:app.globalData.url+'api/getIntegralVoucher/'+id,
		    header:{"Authorization": "Bearer "+token},
	    	success: function(res) {
			    if(res.statusCode === 401){
			    	wx.redirectTo({
						url: '../login/login'
					})
			    }
			    if(!res.data.success) {
			    	wx.showToast({
			    		title:res.data.msg,
			    		image:'../img/warn.png'
			    	})
			    	return
			    }else if (res.data.success) {
			    	wx.showToast({title:'领取成功',icon:'success',
			    	success : () => {
			    		setTimeout(function () {
			    			wx.redirectTo({url:'../coupon/coupon'})
			    			},1000)
			    		}
			    	})
			    }else {
			    	wx.showToast({
			    		title:'领取失败',
			    		image:'../img/warn.png'
			    	})
			    }

	     	}
	  	})
	},
})