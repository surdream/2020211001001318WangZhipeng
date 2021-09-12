var app = getApp();
Page({
  data: {
    menuButtonTop: app.globalData.menuButtonTop,
    menuButtonHeight: app.globalData.menuButtonHeight,
    version: app.globalData.version,
  },
  onLoad: function (options) {

  },
  onShow: function () {

  },
  getNumber(){
    wx.setClipboardData({
      data: '892301328',
      success: function(res) {
        wx.showToast({
          title: 'QQ群号已复制',
        })
      }
    })
  },
  navTo(){
    wx.navigateTo({
      url: '/pages/guide/subscribe/subscribe',
    })
  },
  BackPage() {
    wx.navigateBack({
        delta: 1,
    }); 
  },
})