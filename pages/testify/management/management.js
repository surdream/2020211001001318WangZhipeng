var app = getApp();
Page({
  data: {
    menuButtonTop: app.globalData.menuButtonTop,
    menuButtonHeight: app.globalData.menuButtonHeight,
    contentHeight: app.globalData.contentHeight,
    fileList: [],
  },
  onLoad: function (options) {
    wx.showToast({
      title: '上传功能正在调试，即将开放使用',
      icon: 'none'
    })
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