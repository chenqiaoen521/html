Page({
    data: {
        oid:Object
    },
    //跳回首页
    jumpback: function(event) {
        wx.switchTab({
            url: '../index/index'
        })
    },
    onLoad(option){
    	this.setData({
    		oid:option.oid
    	})
    }
})