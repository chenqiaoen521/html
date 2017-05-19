Page({
    data: {
    
    },
    bindPickerChange: function(e) {
        this.setData({
            index: e.detail.value
        })
    },
    bindDateChange: function(e) {
        this.setData({
          date: e.detail.value
        })
    },
    queren:function(){
        wx.showToast({
            title: '程序员正在开发此功能',
            icon: 'success',
            duration: 1500
        })
    }
})