var app = getApp();
Page({
  data: {
    loading: true,
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
  navToManagement(){
    wx.navigateTo({
      url: '/pages/office-testify-management/office-testify-management',
    })
  }
})