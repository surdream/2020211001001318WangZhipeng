var app = getApp();
Page({
  data: {
    menuButtonTop: app.globalData.menuButtonTop,
    menuButtonHeight: app.globalData.menuButtonHeight,
    contentHeight: app.globalData.contentHeight,
  },
  onLoad: function (options) {

  },
  onShow: function () {

  },
  getLink(){
    wx.setClipboardData({
      data: 'ziv_zhou@foxmail.com',
      success: function(res) {
        wx.showToast({
          title: '邮箱地址已复制',
        })
      }
    })
  },
  BackPage() {
    wx.navigateBack({
        delta: 1,
    }); 
  },
})