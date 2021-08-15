var app = getApp();
Page({
  data: {
    menuButtonTop: app.globalData.menuButtonTop,
    menuButtonHeight: app.globalData.menuButtonHeight,
    loginStatus: '我的'
  },
  onLoad: function (options) {
    let accountInfo = wx.getStorageSync('accountInfo');
    console.log(accountInfo)
    if(accountInfo == undefined || accountInfo == ''){
      this.setData({
        loginStatus: '未登录'
      })
    } else{
      this.setData({
        loginStatus: '个人信息',
        accountInfo: accountInfo
      })
    }
  },
  onShow: function () {

  },
  navTo(e){
    let url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: '/pages/' + url + '/' + url,
    })
  },
})