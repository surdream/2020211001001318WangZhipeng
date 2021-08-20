var app = getApp();
Page({
  data: {
    menuButtonTop: app.globalData.menuButtonTop,
    menuButtonHeight: app.globalData.menuButtonHeight,
    loginStatus: '我的'
  },
  onLoad: function (options) {

  },
  onShow: function () {
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
  navTo(e){
    let status = this.data.accountInfo.lover_status;
    console.log(status)
    let url = e.currentTarget.dataset.url;
    if(url == 'guide'){
      wx.navigateTo({
        url: '../guide/guide?from=import',
      })
    } else if(status == 0){
      wx.navigateTo({
        url: '../guide/guide?from=couple',
      })
    } else if(status == 2){
      wx.showToast({
        title: '你还有一条绑定申请未处理',
        icon: 'none'
      })
    } else if(status == 3){
      wx.showToast({
        title: '你发出的申请对方还没有回应',
        icon: 'none'
      })
    } else{
      wx.navigateTo({
        url: '/pages/' + url + '/' + url,
      })
    }
  },
})