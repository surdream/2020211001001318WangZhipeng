Page({
  data: {

  },
  onLoad: function (options) {

  },
  onShow: function () {
    let firstUse = wx.getStorageSync('firstUse');
    console.log("是否首次使用程序==",firstUse);
    if(firstUse == 'not'){
      wx.switchTab({
        url: '/pages/home/home',
      })
    } else if(firstUse == undefined || firstUse == ''){
      wx.redirectTo({
        url: '/pages/guide/guide',
      })
    }
  }
})