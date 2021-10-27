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
    let link = 'https://mp.weixin.qq.com/s/W7f7Y53jtKBu5TwRXUY4gw';
    wx.navigateTo({
      url: '../../publicPage/publicPage?link=' + encodeURIComponent(JSON.stringify(link)),
    })
  },
  BackPage() {
    wx.navigateBack({
      delta: 1,
    }); 
  },
})