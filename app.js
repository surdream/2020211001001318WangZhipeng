var app = getApp();// 获取app实例
App({
  onLaunch() {
    wx.setStorageSync('QAMsgValue', '')
    wx.getSystemInfo({
      success: (e) => {
        // 定位状态栏、胶囊等显示区域
        let menuButtonObject = wx.getMenuButtonBoundingClientRect();// 获取胶囊实例
        let menuButtonHeight = menuButtonObject.height;// 胶囊高度
        let menuButtonTop = menuButtonObject.top;// 胶囊顶距
        let menuButtonLeft = menuButtonObject.left;// 胶囊左边距
        let menuButtonWidth = menuButtonObject.width;// 胶囊左边距
        // 兼容不同设备显示区域
        let windowHeight = e.windowHeight;// 窗口高度
        let displayScale = (750 / windowHeight)// 转换高度
        let statusBarHeight = e.statusBarHeight;// 状态栏高度
        let screenHeight = e.screenHeight;// 屏幕高度
        let contentHeight = windowHeight - menuButtonTop - menuButtonHeight - 2;// 显示区域
        
        this.globalData.menuButtonTop = menuButtonTop;
        this.globalData.menuButtonMore = menuButtonLeft + (menuButtonWidth / 4) - 7;
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
    version: '公测 1.2.6（211026）',// 小程序版本号
  },
})