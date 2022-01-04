import Toast from '@vant/weapp/toast/toast'; // Toast
var app = getApp();
Page({
    data: {
        menuButtonTop: app.globalData.menuButtonTop,
        menuButtonHeight: app.globalData.menuButtonHeight,
        contentHeight: app.globalData.contentHeight,
    },
    onLoad(options){
        let firstUse = wx.getStorageSync('firstUse');
        if(firstUse != 'not'){
            this.setData({ firstUse: true})
        } else{
            this.setData({ firstUse: false})
        }
    },
    onShow() {
        let accountInfo = wx.getStorageSync('accountInfo');
        if(accountInfo == undefined || accountInfo == ''){
            this.setData({ loginStatus: '未登录' })
        } else{
            this.setData({
                loginStatus: '个人信息',
                accountInfo: accountInfo
            })
        }
    },
    navImport(){
      wx.navigateTo({ url: '../guide/guide?from=import' });
    },
    navHomepage(){
      wx.navigateTo({ url: '../homepage/homepage?from=self' });
    },
    navAbout(e){
        let url = e.currentTarget.dataset.url;
        wx.navigateTo({ url: './' + url + '/' + url });
    },
    navCouple(){
        let firstUse = wx.getStorageSync('firstUse');
        if (firstUse == 'not'){
          let status = this.data.accountInfo.lover_status;
          if (status == 0){
              wx.navigateTo({ url: '../guide/guide?from=couple' });
          } else if (status == 2){
              Toast('你还有一条绑定申请未处理');
          } else if (status == 3){
              Toast('你发出的申请对方还没有回应');
          } else {
              wx.navigateTo({ url: '../couple/couple' });
          }
        } else {
          wx.navigateTo({ url: '../guide/guide?from=import' });
        }
    },
    navTo(e){
        let firstUse = wx.getStorageSync('firstUse');
        if(firstUse == 'not'){
          let status = this.data.accountInfo.lover_status;
          console.log(status)
          if(url == 'guide'){
            wx.navigateTo({ url: '../guide/guide?from=import' })
          } else if(status == 0 && url== 'couple'){
            wx.navigateTo({ url: '../guide/guide?from=couple' })
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
            wx.navigateTo({ url: './alterInfo/alterInfo' })
          } else{
            wx.navigateTo({ url: '/pages/' + url + '/' + url });
          }
        } else{
          wx.navigateTo({ url: '../guide/guide?from=import' });
        }
      },
    onShareAppMessage(){
        return {
            title: '大学查课表成绩选课，还有更多功能等你探索',
            path: '/pages/blank/blank',
        }
    }
})