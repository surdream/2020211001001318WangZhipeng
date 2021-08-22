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
  BackPage() {
    wx.navigateBack({
        delta: 1,
    }); 
  },
})