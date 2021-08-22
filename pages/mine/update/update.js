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
  navTo(e){
    let url = e.currentTarget.dataset.url;
    if(url == 'help'){
      wx.navigateTo({
        url: './help/help',
      })
    }
    // wx.navigateTo({
    //   url: '/pages/update' + url + '/' + url,
    // })
  }
})