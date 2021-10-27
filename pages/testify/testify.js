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
  sorryTap(){
    wx.showToast({
      title: '管理证明功能正在协调上线中,敬请期待',
      icon: 'none'
    })
  },
  BackPage() {
    wx.navigateBack({
        delta: 1,
    });
  },
  navToAddImages(){
    wx.navigateTo({
      url: './addImages/addImages',
    })
  }
})