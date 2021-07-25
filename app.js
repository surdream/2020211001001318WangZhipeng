var app = getApp();
App({
  onLaunch() {
    // wx.setStorageSync('status', '')
    wx.getSystemInfo({
      success: (e) => {
        //定位状态栏、胶囊等显示区域
        let menuButtonObject = wx.getMenuButtonBoundingClientRect();
        let menuButtonHeight = menuButtonObject.height;//胶囊高度
        let menuButtonTop = menuButtonObject.top;//胶囊顶距
        
        let statusBarHeight = e.statusBarHeight;//状态栏高度
        let windowHeight = e.windowHeight;//窗口高度

        this.globalData.menuButtonTop = menuButtonTop + 2;
        this.globalData.menuButtonHeight = menuButtonHeight;
        this.globalData.contentHeight = windowHeight - menuButtonTop - menuButtonHeight - 2;

        console.log(e);
        console.log(menuButtonObject);
      },
    })
  },
  globalData: {
    glassColor:[
      {color:"rgba(255,106,156,0.6)"},
      {color:"rgba(24,130,253,0.6)"},
      {color:"rgba(252,172,106,0.6)"},
      {color:"rgba(187,81,236,0.6)"},
    ]
  }
})
