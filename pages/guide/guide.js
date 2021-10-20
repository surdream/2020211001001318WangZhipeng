var app = getApp();
var base = require("../../utils/base64.js") 
var base64 = new base.Base64();
const { request } = require("../../utils/request/request");
Page({
  data: {
    menuButtonTop: app.globalData.menuButtonTop,
    menuButtonHeight: app.globalData.menuButtonHeight,
    windowHeight: app.globalData.windowHeight,
    school: '华东交通大学',
    connectStatus: '认证通道畅通',
    checkStatus: 'checked',
    popShow: false,
    show: false,
    isLoading: false,
    haveResult: false,
    hasUserInfo: false,
    canConnect: false,
    checked: false,
    from: '',
    account: '',
    password: '',
    account_link: '',
    searchResult: '',
    nextBtn: '下一步',
    inputType: 'password',
    passwordType: 'open',
    status_color: '#C9D6DE',
    pickerImg: '/images/conmon/down-tri.png',
    colorList: [
      {background: '#FF9542'},
      {background: '#6D91F7'},
      {background: '#F1948A'},
      {background: '#AF58BA'},
    ],
    actions: [
      {
        name: '华东交通大学',
      },
      {
        name: '江西财经大学',
        disabled: true
      },
      {
        name: '南昌大学',
        disabled: true
      },
      {
        name: '江西理工大学',
        disabled: true
      },
      {
        name: '南昌航空大学',
        disabled: true
      },
      {
        name: '江西农业大学',
        disabled: true
      },
      {
        name: '江西科技师范大学',
        disabled: true
      },
    ],
    imgUrls: [
      '/images/guide/study.png',
      '/images/guide/office.png',
      '/images/guide/couple.png',
      '/images/guide/run.png'
    ],
    indicatorDots: false,
    interval: 2400,
    duration: 800,
    swiperCurrent: 0,
  },
  onLoad: function (options) {
    let from = options.from
    if(from == 'couple'){
      this.setData({
        swiperCurrent: 2,
        nextBtn: '完成'
      })
    }
    this.setData({
      from: from
    })
    let isSkip = wx.getStorageSync('isSkip');
    if(isSkip){
      wx.showToast({
        title: '使用便捷校园服务,请先进行认证',
        icon: 'none'
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
  // 下一步
  nextStep(){
    let swiperCurrent = this.data.swiperCurrent;
    let account = this.data.account;
    let password = this.data.password;
    // 监测接口状态
    if(swiperCurrent == 0){
      let school = this.data.school
      wx.showToast({
        title: '已选择:' + school,
        icon: 'none'
      })
      this.setData({
        nextBtn: '开始验证',
        swiperCurrent: this.data.swiperCurrent + 1,
        popShow: true
      })
      request({
        url: "api/edu/isconnect",
        method: 'GET', 
      }).then(res => {
        console.log(res);
        if(res.data.code === 200){
          this.setData({
            connectStatus: '认证通道畅通',
            status_color: '#3AC569',
            canConnect: true
          })
        } else if(res.data.code === 202){
          this.setData({
            connectStatus: '认证通道异常',
            status_color: '#f1c40f',
            canConnect: false
          })
        } else if(res.data.code === 307){
          this.setData({
            connectStatus: '认证系统升级',
            status_color: '#F1948A',
            canConnect: false
          })
        } else {
          this.setData({
            connectStatus: '系统正在维护',
            status_color: '#C9D6DE',
            canConnect: false
          })
        }
      })
    }
    if(swiperCurrent == 1){
      if(password.length != 0){
      let hasUserInfo = this.data.hasUserInfo;
        this.setData({ isLoading: true });
        let account = this.data.account;
        let password = this.data.password;
        request({
          url: "api/user/login?" + "account=" + account + "&password=" + password, 
          method: 'GET', 
        }).then(res => {
          console.log(res);
          let userInfo = {account: account,password: password};
          wx.removeStorageSync('sessionid');
          wx.setStorageSync("sessionid", res.cookies[0]);
          wx.removeStorageSync('isSkip');
          wx.setStorageSync('firstUse', 'not');
          if(res.data.code == 210){ //用户注册
            wx.showToast({ title: '认证成功！' });
            wx.setStorageSync('userInfo', userInfo);
            this.setData({ isLoading: false });
            if(!hasUserInfo){
              let from = this.data.from;
              wx.getUserProfile({
              desc: '获取用户昵称、头像',
              success: (res) => {
                console.log(res)
                let userInfo = res.userInfo;
                let openname = base64.encode(userInfo.nickName).replace(/\+/g, "%2B");
                this.setData({
                  userInfo: userInfo,
                  hasUserInfo: true
                })
                request({
                  url: "api/user/change?" + "avatar=" + userInfo.avatarUrl + "&openname=" + openname,method: 'GET',header: {'cookie':wx.getStorageSync('sessionid')}
                }).then(res => {
                  console.log(res);
                  wx.login({
                    success: function(res) {
                      wx.setStorageSync('firstGetInfo', 'not');
                      if (res.code) {
                        console.log(res)
                        //发起网络请求
                        wx.request({
                          url: 'https://test.com/onLogin',
                          data: { code: res.code }
                        })
                      } else {
                        console.log('获取用户登录态失败！' + res.errMsg);
                      }
                    }
                  });     
                })
              },
              fail: () => {
                if(from == 'import'){
                  wx.showToast({
                    title: '已取消授权，昵称和头像维持不变',
                    icon: 'none'
                  })
                } else{
                  wx.showToast({
                    title: '已取消授权，昵称和头像维持不变',
                    icon: 'none'
                  })
                }
              },
              complete: () => {
                if(from == 'import'){
                  this.setData({ nextBtn: '完成' })
                  // 用户登录
                  let userInfo = wx.getStorageSync('userInfo');
                  request({
                    url: "api/user/login?" + "account=" + userInfo.account + "&password=" + userInfo.password, method: 'GET', 
                  }).then(res => {
                      wx.removeStorageSync('sessionid');
                      wx.setStorageSync("sessionid", res.cookies[0]);
                      request({
                        url: "api/user/profile?", 
                        method: 'GET', header: {'cookie':wx.getStorageSync('sessionid')}
                      }).then(res =>{
                        let accountInfo = res.data.data;
                        wx.setStorageSync('accountInfo', accountInfo);
                        //根据code获取openid等信息
                        wx.login({
                          success: function(res) {
                            if (res.code) {
                              //发起网络请求
                              wx.request({
                                url: 'https://test.com/onLogin',
                                data: { code: res.code }
                              })
                            } else {
                              console.log('获取用户登录态失败！' + res.errMsg);
                            }
                          }
                        });
                      })
                  })
                  wx.showToast({
                    title: '导入成功，如信息显示不正常请尝试重新进入小程序',
                    icon: 'none'
                  })
                  setTimeout(function() {
                    wx.setStorageSync('firstUse', 'not');
                    wx.redirectTo({ url: '../blank/blank' });
                  }, 1250);
                } else{
                  this.setData({
                    swiperCurrent: 2,
                    nextBtn: '下一步'
                  })
                }
              }
            })
            }
          } else if(res.data.code == 200){ //用户登录
            //根据code获取openid等信息
            wx.login({
              success: function(res) {
                if (res.code) {
                  console.log(res);
                  //发起网络请求
                  request({
                    url: "api/user/wxbind?code=" + res.code, 
                    method: 'GET',header: {'cookie':wx.getStorageSync('sessionid')}
                  }).then(res =>{
                    console.log(res);
                  })
                } else {
                  console.log('获取用户登录态失败！' + res.errMsg);
                }
              }
            });
            wx.showToast({ title: '登录成功！' })
            wx.setStorageSync('userInfo', userInfo);
            this.setData({ isLoading: false })
            if(!hasUserInfo){
              let from = this.data.from;
              if(from == 'import'){
                this.setData({ nextBtn: '完成' });
                // 用户登录
                let userInfo = wx.getStorageSync('userInfo');
                request({
                  url: "api/user/login?" + "account=" + userInfo.account + "&password=" + userInfo.password, method: 'GET', 
                }).then(res => {
                    wx.removeStorageSync('sessionid');
                    wx.setStorageSync("sessionid", res.cookies[0]);
                    request({
                      url: "api/user/profile?", 
                      method: 'GET', header: {'cookie':wx.getStorageSync('sessionid')}
                    }).then(res =>{
                      let accountInfo = res.data.data;
                      wx.setStorageSync('accountInfo', accountInfo);  
                    })
                })
                wx.showToast({
                  title: '导入成功，如信息显示不正常请重新进入小程序',
                  icon: 'none'
                })
                setTimeout(function() {
                  wx.setStorageSync('firstUse', 'not');
                  wx.redirectTo({ url: '../blank/blank' });
                }, 1250);
              } else{
                this.setData({
                  swiperCurrent: 2,
                  nextBtn: '下一步'
                })
              }
            }
          } else if(res.data.code == 401){
            wx.showToast({
              title: '账号或密码有误,请重新检查后输入',
              icon: 'none'
            })
            this.setData({
              isLoading: false
            })
          } else if(res.data.code == 205){
            wx.showToast({
              title: '账号或密码有误,请重新检查后输入',
              icon: 'none'
            })
            this.setData({
              isLoading: false
            })
          }
        })
      } else{
        wx.showToast({
          title: '请输入你的密码',
          icon: 'error'
        })
      }
    }
    if(swiperCurrent == 2){
      let from = this.data.from;
      if(from == 'couple'){
        wx.switchTab({ url: '/pages/mine/mine' })
      } else{
        this.setData({
          swiperCurrent: 3,
          nextBtn: '开始使用'
        })
      }
    }
    if(swiperCurrent == 3){
      wx.removeStorageSync('isSkip');
      wx.setStorageSync('firstUse', 'not');
      wx.redirectTo({ url: '/pages/blank/blank' })
    }
  },
  // 同意协议
  acceptTap(){
    this.setData({ popShow: false })
  },
  // 拒绝协议
  cancelTap(){
    this.setData({ popShow: false});
    wx.setStorageSync('isSkip', false);
    wx.switchTab({ url: '/pages/home/home' })
  },
  // 返回键
  backStep() {
    let swiperCurrent = this.data.swiperCurrent;
    if(swiperCurrent == 1){
      this.setData({
        nextBtn: '下一步',
        swiperCurrent: 0,
        isLoading: false,
        account: '',
        password: ''
      })
    }
  },
  // 密码可视
  passwordTap(){
    let passwordType = this.data.passwordType;
    if(passwordType == 'open'){
      this.setData({
        passwordType: 'close',
        inputType: 'text'
      })
    } else{
      this.setData({
        passwordType: 'open',
        inputType: 'password'
      })
    }
  },
  inputTap(){
    let canConnect = this.data.canConnect;
    if (!canConnect) {
      wx.showToast({
        title: '智慧交大登录通道或服务器升级中,请稍后重试',
        icon: 'none'
      })
    }
  },
  // 选择按钮
  selectTap(){
    this.setData({
      show: true,
      pickerImg:'/images/conmon/up-tri.png'
    })
  },
  // 搜索按钮
  searchTap(){
    let account_link = this.data.account_link;
    if(account_link.length == 5){
      request({
        url: "api/lover/searchAccount?" + "account=" + account_link, 
        method: 'GET', header: {'cookie':wx.getStorageSync('sessionid')}
      }).then(res =>{
        console.log(res);
        if(res.data.code == 200){
          wx.showToast({ title: '匹配到一位用户' })
          this.setData({
            searchResult: res.data,
            haveResult: true
          })
        } else if(res.data.code == 403){
          wx.showToast({
            title: '账号不存在',
            icon: 'error'
          })
        }
      })
    } else{
      wx.showToast({
        title: 'id输入不规范',
        icon: 'error'
      })
    }
  },
  sentTap(){
    let account = this.data.account_link;
    request({
      url: "api/lover/bindLover?" + "account=" + account, 
      method: 'GET',  header: {'cookie':wx.getStorageSync('sessionid')}
    }).then(res => {
      console.log(res.data)
      if(res.data.code == 200){
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
        wx.showModal({
          title: '提示',
          content: '发送绑定申请后，需要对方重新打开小程序才能弹出申请'
        })
      } else if(res.data.code == 206){
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      } else if(res.data.code == 207){
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      } else if(res.data.code == 400){
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    })
  },
  skipTap(){
    let from = this.data.from;
    let swiperCurrent = this.data.swiperCurrent;
    if (swiperCurrent < 2 && from != 'import') {
      wx.setStorageSync('isSkip', true);
      wx.switchTab({ url: '/pages/home/home' });
    } else if (swiperCurrent >= 2 && from != 'import') {
      wx.removeStorageSync('isSkip');
      wx.setStorageSync('firstUse', 'not');
      wx.redirectTo({ url: '/pages/blank/blank' });
    } else { wx.navigateBack({ delta: 1 }); }
  },
  onClose() {
    this.setData({
      show: false,
      pickerImg:'/images/conmon/down-tri.png'
    });
  },
  onSelect(event) {
    console.log(event.detail);
    let name = event.detail.name;
    this.setData({ school: name})
  },
  checkChange(event){
    this.setData({ checked: event.detail });
  },
  checkBtn(){
    let checkStatus = this.data.checkStatus;
    if (checkStatus == 'checked') { this.setData({ checkStatus: 'uncheck' }); } 
    else { this.setData({ checkStatus: 'checked' }); }
  },
  navTo(){
    wx.navigateTo({ url: './subscribe/subscribe' });
  },
  navPrivacy(){
    wx.navigateTo({ url: '/pages/mine/privacy/privacy' })
    wx.showToast({
      title: '请务必仔细阅读,同时我们会严格保护您的信息',
      icon: 'none'
    })
  },
  BackPage() {
    wx.navigateBack({ delta: 1 }); 
  },
})