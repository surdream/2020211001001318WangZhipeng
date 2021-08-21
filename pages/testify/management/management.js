var app = getApp();
Page({
  data: {
    menuButtonTop: app.globalData.menuButtonTop,
    menuButtonHeight: app.globalData.menuButtonHeight,
    contentHeight: app.globalData.contentHeight,
    fileList: [],
  },
  onLoad: function (options) {

  },
  onShow: function () {

  },
  afterRead(event) {
    const { file } = event.detail;
    console.log(event.detail)
  },
  BackPage() {
    wx.navigateBack({
        delta: 1,
    }); 
  },
})