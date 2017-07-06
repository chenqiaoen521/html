var app = getApp()
Page({
	data: {
		flag:true,
		date: '2016-09-01',
	    province:[],
	    city: [],
	    area: [],
	    value: [0, 0, 0],
	    provinces: {REGION_NAME:'请'},
	    citys:  {REGION_NAME:'选择'},
	    areas:{REGION_NAME:'区域'},
      id:Object,
      name:"",
      phone:"",
      address:"",
      street:"",
      status:0,
      postcode:"",
      data:Object,
      addr_id:Object,
      coupon_id:Object
  },
  onLoad (option) {
    if(option.data!= undefined){
      this.setData({
        data:option.data,
        addr_id:option.addr_id,
        coupon_id:option.coupon_id
      })
    }
    if(option.id){
      let that = this
      let token = wx.getStorageSync('token')  
      wx.request({
        url:app.globalData.url+'api/address/'+option.id,
        header:{"Authorization": "Bearer "+token},
        success (res) {
          if(res.statusCode === 401){
            wx.redirectTo({
                  url: '../login/login'
              })
          }
          let data = res.data.data
          //省市区
          that.setData({
              provinces:{REGION_NAME:data.province_name,REGION_ID:data.province},
              citys:{REGION_NAME:data.city_name,REGION_ID:data.city},
              areas :{REGION_NAME:data.area_name,REGION_ID:data.area},
              id:data.id,
              name:data.name,
              phone:data.phone,
              address:data.address,
              street:data.street,
              status:data.status,
              postcode:data.postcode
          })
        },
        fail (e) {
        }
      })  
    }else{
      let that = this
      let token = wx.getStorageSync('token')
      wx.request({
        url:app.globalData.url+'api/region',
        method:'GET',
        header:{"Authorization": "Bearer "+token},
        success: function(res) {
          that.setData({
            province:res.data.data
          })
         }
      })
    }
  },
  //添加 修改
  formSubmit (e) {
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/
    let forms = e.detail.value
    let id = ''
    let method = ''
    if(this.data.id === undefined){
      method = 'POST'
    }else{
      id = '/'+this.data.id
      method = 'PUT'
    }
    if(forms.status){
      forms.status = 1
    }else{
      forms.status = 0
    }
    let area = this.data.provinces.REGION_ID + ',' + this.data.citys.REGION_ID +','+ this.data.areas.REGION_ID
    forms.area = area
    let that = this
    let token = wx.getStorageSync('token')
        if(this.data.provinces.REGION_ID == undefined || this.data.citys.REGION_ID == undefined || this.data.areas.REGION_ID == undefined){
            wx.showToast({
                title: '请选择正确的地区',
                icon: 'success',
                duration: 1500
            })
            return
        }
        /*if(forms.street==''){
            wx.showToast({
                title: '街道不能为空',
                icon: 'success',
                duration: 1500
            })
            return
        }*/
        if(forms.address==''){
            wx.showToast({
                title: '详细地址不能为空',
                icon: 'success',
                duration: 1500
            })
            return
        }
        if(forms.name==''){
            wx.showToast({
                title: '收货人姓名不能为空',
                icon: 'success',
                duration: 1500
            })
            return
        }
        if(forms.phone==''){
            wx.showToast({
                title: '收货人电话不能为空',
                icon: 'success',
                duration: 1500
            })
            return
        }
        if(!myreg.test(forms.phone)) {
            wx.showToast({
                title: '手机号输入不正确',
                icon: 'success',
                duration: 1500
            })
            return
        }
      wx.request({
        url:app.globalData.url+'api/address'+id,
        method:method,
        data:forms,
        header:{"Authorization": "Bearer "+token},
        success: function(res) {
          if(!res.data.success){
              wx.showToast({
                title: '保存失败',
                icon: 'warn',
                duration: 2000
              })
          }else{
             wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000,
              success (e) {
                if(that.data.data != undefined){
                  wx.redirectTo({url:'../makedan/makedan?data='+that.data.data+'&addr_id='+res.data.data.id+'&coupon_id='+that.data.coupon_id})  
                }else{
                  wx.redirectTo({url:'../address/address'})  
                }
                
              }
            })     
          }
         }
      })
  },
  showFlag () {
  	this.setData({
  		flag:!this.data.flag
  	})
  },
  bindChange: function(e) {
    let val = e.detail.value
    let x = val[0]
    let y = val[1]
    let z = val[2]
    let province = this.data.province[x]
    let city = this.data.city[y]
    if(province){
      this.setData({provinces:this.data.province[x]})
      province = this.data.province[x].REGION_ID
      let that = this
      let token = wx.getStorageSync('token')
      wx.request({
        url:app.globalData.url+'api/region',
        method:'GET',
        data:{'pid':province},
        header:{"Authorization": "Bearer "+token},
        success: function(res) {
          let arr= [
            {REGION_ID: -1, REGION_CODE: "  ", REGION_NAME: "   ", PARENT_ID: 17, REGION_LEVEL: 0}
          ]
          let dataArr = res.data.data
          arr.concat(dataArr)
          console.log(dataArr.unshift(arr))
          that.setData({
            city:arr,
            citys:res.data.data[y]
            })
         }
      })
    }
    if(city){
      city = this.data.city[y].REGION_ID
      let that = this
      let token = wx.getStorageSync('token')
      wx.request({
        url:app.globalData.url+'api/region',
        method:'GET',
        data:{'pid':city},
        header:{"Authorization": "Bearer "+token},
        success: function(res) {
          that.setData({
            area:res.data.data,
            areas:res.data.data[z]
            })
         }
      })
    } 
  }
})

