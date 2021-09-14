var app = getApp();
Page({
  data: {
    menuButtonTop: app.globalData.menuButtonTop,
    menuButtonHeight: app.globalData.menuButtonHeight,
    loginStatus: '我的',
  },
  onLoad: function (options) {
    let firstUse = wx.getStorageSync('firstUse');
    if(firstUse != 'not'){
      this.setData({ firstUse: true})
    } else{
      this.setData({ firstUse: false})
    }
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
    let firstUse = wx.getStorageSync('firstUse');
    let url = e.currentTarget.dataset.url;
    if(firstUse == 'not'){
      let status = this.data.accountInfo.lover_status;
      console.log(status)
      if(url == 'guide'){
        wx.navigateTo({
          url: '../guide/guide?from=import',
        })
      } else if(status == 0 && url== 'couple'){
        wx.navigateTo({
          url: '../guide/guide?from=couple',
        })
      } else if(status == 2 && url== 'couple'){
        wx.showToast({
          title: '你还有一条绑定申请未处理',
          icon: 'none'
        })
      } else if(status == 3 && url== 'couple'){
        wx.showToast({
          title: '你发出的申请对方还没有回应',
          icon: 'none'
        })
      } else if(url == 'alterInfo'){
        wx.navigateTo({
          url: './alterInfo/alterInfo',
        })
      } else if(url == 'official'){
      }else{
        wx.navigateTo({
          url: '/pages/' + url + '/' + url,
        })
      }
    } else{
      wx.navigateTo({
        url: '../guide/guide?from=import',
      })
    }
  },
  aboutTo(e){
    let url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: './' + url + '/' + url,
    })
  },
  navApp(){
    wx.showToast({
      title: '一问Event论坛将在近期上线，敬请期待~',
      icon: 'none'
    })
  },
  navTreehole(){
    wx.showToast({
      title: '花椒树洞将在近期上线，敬请期待~',
      icon: 'none'
    })
  },
  onShareAppMessage: function (res) {
    return {
      title: '大学查课表成绩选课，还有更多功能等你探索',
      path: '/pages/blank/blank',
    }
  }
})