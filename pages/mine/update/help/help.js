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
  BackPage() {
    wx.navigateBack({
        delta: 1,
    }); 
  },
})