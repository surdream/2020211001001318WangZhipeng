var app = getApp();
var base = require("../../../utils/base64.js") 
var base64 = new base.Base64();
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
        let openname = base64.encode(userInfo.nickName).replace(/\+/g, "%2B");
        request({
          url: "api/user/change?" + "avatar=" + userInfo.avatarUrl + "&openname=" + openname,method: 'GET',header: {'cookie':wx.getStorageSync('sessionid')}
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
            let openname = base64.decode(accountInfo.openname);
                accountInfo.openname = openname;
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
    wx.showModal({
      title: '提示',
      content: '你要进行账号注销吗？',
      success (res) {
        if (res.confirm) {
          wx.showModal({
            title: '再次确认',
            content: '注销后，你关联的一目校园及一问Event论坛账户信息将会全部抹除',
            success (res) {
              if (res.confirm) {
                request({
                  url: "api/user/cancel?",method: 'GET',header: {'cookie':wx.getStorageSync('sessionid')}
                }).then(res => {
                  console.log(res)
                  wx.clearStorageSync();
                  wx.redirectTo({
                    url: '/pages/blank/blank',
                  })
                })
              } else if (res.cancel) {
              }
            }
          })
        } else if (res.cancel) {
        }
      }
    })
  },
  BackPage() {
    wx.navigateBack({
        delta: 1,
    }); 
  },
})