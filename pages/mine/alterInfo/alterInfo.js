var app = getApp();
var myBase64 = require("../../../utils/mybase64.js");
const { request } = require("../../../utils/request/request");
import Toast from '@vant/weapp/toast/toast'; // Toast
Page({
  data: {
    menuButtonTop: app.globalData.menuButtonTop,
    menuButtonHeight: app.globalData.menuButtonHeight,
    contentHeight: app.globalData.contentHeight,
    nameShow: false,
    isUpdate: false,
    pwdValue: null,
  },
  onLoad(options){
    let accountInfo = wx.getStorageSync('accountInfo');
    console.log(accountInfo);
    this.setData({ accountInfo: accountInfo });
    if(accountInfo.lover_status == 1){}
  },
  // 查看大图
  checkImg(){
    let imgUrl = [this.data.accountInfo.avatar];
    console.log(imgUrl)
    wx.previewImage({
      urls: imgUrl, //需要预览的图片http链接列表，注意是数组
      current: imgUrl[0], // 当前显示图片的http链接，默认是第一个
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  changeName(){
    this.setData({ nameShow: true });
  },
  updateTap(){
    wx.getUserProfile({
      desc: '获取用户昵称、头像',
      success: (res) => {
        console.log(res)
        let userInfo = res.userInfo;
        let openname = myBase64.encode(userInfo.nickName).replace(/\+/g, "%2B");
        request({
          url: "api/user/change?" + "avatar=" + userInfo.avatarUrl + "&openname=" + openname,method: 'GET',header: {'cookie':wx.getStorageSync('sessionid')}
        }).then(res => {
          console.log(res)
        })
      },
      fail: () => {
        Toast('用户取消授权');
      },
      complete: () => {
        request({
          url: "api/user/profile?", 
          method: 'GET', header: {'cookie':wx.getStorageSync('sessionid')}
        }).then(res =>{
          if(res.data.code == 200){
            console.log(res.data.data);
            let accountInfo = res.data.data;
            let openname = myBase64.decode(accountInfo.openname);
                accountInfo.openname = openname;
            wx.setStorageSync('accountInfo', accountInfo);
            this.setData({
              accountInfo: accountInfo
            })
          } else if(res.data.code == 400){
            Toast('系统正在维护Orz');
          }
        })
      }
    })
  },
  navGuide(){
    wx.navigateTo({ url: '../../guide/guide?from=import' });
  },
  clearStorage(){
    wx.showModal({
        title: '提示',
        content: '确定要清除全部缓存吗？',
        success (res) {
          if (res.confirm) {
            wx.clearStorageSync();
            wx.redirectTo({ url: '/pages/guide/guide' })
            wx.showToast({ title: '已成功清除缓存' })
          }
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
                  console.log(res);
                  wx.clearStorageSync();
                  wx.redirectTo({ url: '/pages/blank/blank' });
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
  navPrivacy(){
    wx.navigateTo({ url: '../privacy/privacy' });
  },
  // 更新面板关闭
  nameOnClose() {
    this.setData({ nameShow: false });
  },
  nameOnChange(e){
    let value = e.detail;
    this.setData({ nameValue: value });
  },
  BackPage() {
    wx.navigateBack({ delta: 1 }); 
  },
})