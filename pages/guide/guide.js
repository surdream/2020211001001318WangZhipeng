var app = getApp();
const { request } = require("../../utils/request/request");
Page({
  data: {
    menuButtonTop: app.globalData.menuButtonTop,
    menuButtonHeight: app.globalData.menuButtonHeight,
    windowHeight: app.globalData.windowHeight,
    school: '华东交通大学',
    connectStatus: '认证通道畅通',
    show: false,
    isLoading: false,
    haveResult: false,
    hasUserInfo: false,
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
    autoplay: true,
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
    request({
      url: "api/edu/isconnect",
      method: 'GET', 
    }).then(res => {
      console.log(res);
      if(res.statusCode === 200){
        this.setData({
          connectStatus: '认证通道畅通',
          status_color: '#3AC569',
        })
      } else if(res.statusCode === 202){
        this.setData({
          connectStatus: '认证通道异常',
          status_color: '#E3E36A',
        })
      } else if(res.statusCode === 307){
        this.setData({
          connectStatus: '认证系统升级',
          status_color: '#F1948A',
        })
      } else {
        this.setData({
          connectStatus: '系统正在维护',
          status_color: '#C9D6DE',
        })
      }
    })
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
    if(swiperCurrent == 0){
      let school = this.data.school
      wx.showToast({
        title: '已选择:' + school,
        icon: 'none'
      })
      this.setData({
        nextBtn: '开始验证',
        swiperCurrent: this.data.swiperCurrent + 1
      })
    }
    if(swiperCurrent == 1){
      if(account.length === 16){
        if(password.length != 0){
        let hasUserInfo = this.data.hasUserInfo;
          this.setData({
            isLoading: true
          })
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
            if(res.data.code == 200){
              wx.showToast({
                title: '认证成功！',
              })
              wx.setStorageSync('userInfo', userInfo);
              this.setData({
                isLoading: false,
              })
              if(!hasUserInfo){
                let from = this.data.from;
                wx.getUserProfile({
                desc: '获取用户昵称、头像',
                success: (res) => {
                  console.log(res)
                  let userInfo = res.userInfo;
                  this.setData({
                    userInfo: userInfo,
                    hasUserInfo: true
                  })
                  request({
                    url: "api/user/change?" + "avatar=" + userInfo.avatarUrl + "&openname=" + userInfo.nickName,method: 'GET',header: {'cookie':wx.getStorageSync('sessionid')}
                  }).then(res => {
                    console.log(res)
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
                      title: '已取消授权，设置为默认昵称和头像',
                      icon: 'none'
                    })
                  }
                },
                complete: () => {
                  if(from == 'import'){
                    this.setData({
                      nextBtn: '完成'
                    })
                    wx.showToast({
                      title: '导入成功，如信息显示不正常请重新进入小程序',
                      icon: 'none'
                    })
                    setTimeout(function() {
                      wx.setStorageSync('firstUse', 'not');
                      wx.redirectTo({
                        url: '../blank/blank',
                      });
                    }, 1250);
                  } else{
                    this.setData({
                      swiperCurrent: 2,
                    })
                  }
                }
              })
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
      } else{
        wx.showToast({
          title: '账号输入不规范',
          icon: 'error'
        })
      }
    }
    if(swiperCurrent == 2){
      let from = this.data.from;
      if(from == 'couple'){
        wx.switchTab({
          url: '/pages/mine/mine',
        })
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
      wx.redirectTo({
        url: '/pages/blank/blank',
      })
    }
  },
  // 返回键
  backStep() {
    let swiperCurrent = this.data.swiperCurrent;
    if(swiperCurrent = 1){
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
    if(account_link.length == 16){
      request({
        url: "api/user/searchAccount?" + "account=" + account_link, 
        method: 'GET', header: {'cookie':wx.getStorageSync('sessionid')}
      }).then(res =>{
        console.log(res);
        if(res.data.code == 200){
          wx.showToast({
            title: '匹配到一位用户',
          })
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
        title: '学号输入不规范',
        icon: 'error'
      })
    }
  },
  sentTap(){
    let account = this.data.account_link;
    request({
      url: "api/user/bindLover?" + "account=" + account, 
      method: 'GET',  header: {'cookie':wx.getStorageSync('sessionid')}
    }).then(res => {
      console.log(res.data)
      if(res.data.code == 200){
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
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
    wx.setStorageSync('isSkip', true)
    wx.switchTab({
      url: '/pages/home/home',
    })
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
  BackPage() {
    wx.navigateBack({
        delta: 1,
    }); 
  },
})