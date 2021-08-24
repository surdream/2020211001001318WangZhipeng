var app = getApp();
const { request } = require("../../../utils/request/request");
Page({
  data: {
    menuButtonTop: app.globalData.menuButtonTop,
    menuButtonHeight: app.globalData.menuButtonHeight,
  },
  onLoad: function (options) {
    let accountInfo = wx.getStorageSync('accountInfo');
    console.log(accountInfo);
    this.setData({
      accountInfo: accountInfo
    })
    if(accountInfo.lover_status == 1){
      this.setData({
        
      })
    }
  },
  onShow: function () {

  },
  // 输入框
  detailInput: function(e){
    let {
    } = this.data;
    let name = e.currentTarget.dataset.name;
    let value = e.detail.value;
    this.setData({
      [name]: value,
      haveResult: false
    });
  },
  updateTap(){
    wx.getUserProfile({
      desc: '获取用户昵称、头像',
      success: (res) => {
        console.log(res)
        let userInfo = res.userInfo;
        request({
          url: "api/user/change?" + "avatar=" + userInfo.avatarUrl + "&openname=" + userInfo.nickName,method: 'GET',header: {'cookie':wx.getStorageSync('sessionid')}
        }).then(res => {
          console.log(res)
        })
      },
      fail: () => {
        wx.showToast({
          title: '用户取消授权',
          icon: 'none'
        })
      },
      complete: () => {
        request({
          url: "api/user/profile?", 
          method: 'GET', header: {'cookie':wx.getStorageSync('sessionid')}
        }).then(res =>{
          if(res.data.code == 200){
            console.log(res.data.data);
            let accountInfo = res.data.data;
            wx.setStorageSync('accountInfo', accountInfo);
            this.setData({
              accountInfo: accountInfo
            })
          } else if(res.data.code == 400){
            wx.showToast({
              title: '系统正在维护',
              icon: 'error'
            })
          }
        })
      }
    })
  },
  cancelTap(){
    request({
      url: "api/user/cancel?",method: 'GET',header: {'cookie':wx.getStorageSync('sessionid')}
    }).then(res => {
      console.log(res)
      wx.clearStorageSync();
      wx.redirectTo({
        url: '/pages/blank/blank',
      })
    })
  },
  BackPage() {
    wx.navigateBack({
        delta: 1,
    }); 
  },
})