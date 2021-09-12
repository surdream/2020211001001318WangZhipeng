var app = getApp();
const { request } = require("./utils/request/request");
App({
  onLaunch() {
    // 用户登录
    let userInfo = wx.getStorageSync('userInfo');
    if (userInfo == undefined || userInfo == ''){
      console.log('未登录')
    } else{
      request({
        url: "api/user/login?" + "account=" + userInfo.account + "&password=" + userInfo.password, method: 'GET', 
      }).then(res => {
        wx.removeStorageSync('sessionid');
        wx.setStorageSync("sessionid", res.cookies[0]);
      })
    }
    wx.getSystemInfo({
      success: (e) => {
        // 定位状态栏、胶囊等显示区域
        let menuButtonObject = wx.getMenuButtonBoundingClientRect();// 获取胶囊实例
        let menuButtonHeight = menuButtonObject.height;// 胶囊高度
        let menuButtonTop = menuButtonObject.top;// 胶囊顶距
        // 兼容不同设备显示区域
        let windowHeight = e.windowHeight;// 窗口高度
        let displayScale = (750 / windowHeight)// 转换高度
        let statusBarHeight = e.statusBarHeight;// 状态栏高度
        let screenHeight = e.screenHeight;//屏幕高度
        let contentHeight = windowHeight - menuButtonTop - menuButtonHeight - 2;// 显示区域
        
        this.globalData.menuButtonTop = menuButtonTop + 2;
        this.globalData.menuButtonHeight = menuButtonHeight;
        this.globalData.windowHeight = windowHeight;
        this.globalData.contentHeight = contentHeight;
        // console.log(e);
        // console.log(displayScale)
        // console.log(menuButtonObject);
      },
    })
  },
  globalData: {
    version: '内测 1.0.0（210911）'
  }
})
