import Notify from '@vant/weapp/notify/notify';// 通知
import Toast from '@vant/weapp/toast/toast';// Toast

var app = getApp();
var base = require("../../utils/base64.js") 
var base64 = new base.Base64();
const { request } = require("../../utils/request/request");
let touchDotX = 0;
let touchDotY = 0;
let interval;
let time = 0;
Page({
  data: {
    menuButtonTop: app.globalData.menuButtonTop,
    menuButtonHeight: app.globalData.menuButtonHeight,
    contentHeight: app.globalData.contentHeight,
    menuButtonMore: app.globalData.menuButtonMore,
    QA_list: [],
    imgUrls: [],
    bg_list: [ // 状态背景
      {color: 'rgba(110,119,131,0.2)'},
      {color: 'rgba(66,211,173,0.2)'},
      {color: 'rgba(1,190,255,0.2)'},
      {color: 'rgba(1,190,255,0.2)'}
    ],
    msgValue: '',// 文本输入值
    QAPage: 1,// 问答分页数
    QAEnd: false,// 问答列表状态
    hasMsg: false,// 新留言状态
    popShow: false,// 绑定申请状态
    hasImport: false,// 导入状态
    QALoading: true,// 问答加载状态
    actionShow: false,// 留言弹出状态
    indicatorDots: false,// 轮播图点状态
    pillNoticeShow: false,// 胶囊提示状态
    autoplay: true,// 轮播图显示状态
    interval: 2400,// 轮播图切换间隔
    duration: 800,// 轮播图动画时长
    titleTarget: 0,// 当前选项卡
    swiperCurrent: 0,// 当前轮播图
  },
  onLoad: function (options) {
    let firstUse = wx.getStorageSync('firstUse');
    console.log(wx.getStorageSync('sessionid'));
    if(firstUse == 'not'){
      this.setData({ hasImport: true })
      // 用户登录
      let userInfo = wx.getStorageSync('userInfo');
      if (userInfo == undefined || userInfo == ''){
        console.log('未登录');
      } else{
        request({
          url: "api/user/login?" + "account=" + userInfo.account + "&password=" + userInfo.password, method: 'GET', 
        }).then(res => {
          console.log(res)
          wx.removeStorageSync('sessionid');// 移除旧cookie
          wx.setStorageSync("sessionid", res.cookies[0]);// 存储cookie
          // 获取个人信息
          request({
            url: "api/user/profile?", 
            method: 'GET', header: {'cookie':wx.getStorageSync('sessionid')}
          }).then(res =>{
            console.log(res.data);
            console.log('code=' + res.data.code);
            if(res.data.code == 200){
              let accountInfo = res.data.data;
              let openname = base64.decode(accountInfo.openname);
                  accountInfo.openname = openname;
              let lover_status = accountInfo.lover_status;
              wx.setStorageSync('accountInfo', accountInfo);
              this.setData({
                accountInfo: accountInfo,
                lover_status: lover_status
              })
              // 判断留言状态
              if (accountInfo.lover) {
                console.log(111)
                if (accountInfo.lover.msg.length != 0) {
                  this.setData({ hasMsg: true });
                }
              }
              // 判断情侣状态
              if(lover_status == 2){
                this.setData({ popShow: true });
                Toast('有一条绑定申请');
                this.onLoad();
              }
              // 获取今日课表
              request({
                url: "api/edu/todayMain", 
                method: 'GET', header: {'cookie':wx.getStorageSync('sessionid')}
              }).then(res =>{
                console.log(res.data.data)
                if (res.data.code == 200) {
                  this.setData({
                    chart_list: res.data.data.me,
                    bind_list: res.data.data.lover
                  })
                }
                // 获取问答列表
                request({
                  url: "api/qa/list?page=1" , 
                  method: 'GET',header: {'cookie':wx.getStorageSync('sessionid')}
                }).then(res =>{
                  console.log(res.data);
                  let QA_list = res.data;
                  for(let i=0;i<QA_list.length;i++){
                    let type = QA_list[i].type;
                    switch(type){
                      case '闲聊': {QA_list[i].color = '#666699'} break;
                      case '情感': {QA_list[i].color = '#FF6666'} break;
                      case '学习': {QA_list[i].color = '#003399'} break;
                      case '生活': {QA_list[i].color = '#FFCC99'} break;
                      case '求购': {QA_list[i].color = '#339999'} break;
                    }
                    if(QA_list[i].reply_content != null){
                      let reply_content = base64.decode(QA_list[i].reply_content);
                      QA_list[i].reply_content = reply_content;
                    }
                    if(QA_list[i].openname != null){
                      let openname = base64.decode(QA_list[i].openname);
                      QA_list[i].openname = openname;
                    }
                    let picture1 = QA_list[i].picture1;
                    let picture2 = QA_list[i].picture2;
                    if (picture1 != null) {
                      QA_list[i].picture1 = "https://static.powerv.top/static/img/QAImg/" + picture1;
                    }
                    if (picture2 != null) {
                      QA_list[i].picture2 = "https://static.powerv.top/static/img/QAImg/" + picture2;
                    }
                  }
                  this.setData({
                    QA_list: QA_list,
                    QALoading: false
                  })
                  Notify({
                    message: '获取到 ' + res.data.length + ' 条问答',
                    type: 'success ',
                    safeAreaInsetTop: true,
                    duration: '600'
                  });
                })
              })
            } 
            else if(res.data.code == 400){
              request({
                url: "api/user/login?" + "account=" + userInfo.account + "&password=" + userInfo.password, method: 'GET', 
              }).then(res => {
                wx.removeStorageSync('sessionid');
                wx.setStorageSync("sessionid", res.cookies[0]);
                // 获取个人信息
                request({
                  url: "api/user/profile?", 
                  method: 'GET', header: {'cookie':wx.getStorageSync('sessionid')}
                }).then(res =>{
                  let accountInfo = res.data.data;
                  let lover_status = accountInfo.lover_status;
                  wx.setStorageSync('accountInfo', accountInfo);
                  this.setData({
                    accountInfo: accountInfo,
                    lover_status: lover_status
                  })
                  // 判断留言状态
                  if(accountInfo.lover.msg.length != 0){
                    this.setData({
                      hasMsg: true
                    })
                  }
                  // 判断情侣状态
                  if(lover_status == 2){
                    this.setData({
                      popShow: true
                    })
                    wx.showToast({
                      title: '有一条绑定申请',
                      icon: 'none'
                    })
                    this.onLoad();
                  }
                  // 获取今日课表
                  request({
                    url: "api/edu/todayMain", 
                    method: 'GET', header: {'cookie':wx.getStorageSync('sessionid')}
                  }).then(res =>{
                    console.log(res.data.data)
                    if (res.data.code == 200) {
                      this.setData({
                        chart_list: res.data.data.me,
                        bind_list: res.data.data.lover
                      })
                    }
                    // 获取问答列表
                    request({
                      url: "api/qa/list?page=1" , 
                      method: 'GET',header: {'cookie':wx.getStorageSync('sessionid')}
                    }).then(res =>{
                      console.log(res.data);
                      let QA_list = res.data;
                      for(let i=0;i<QA_list.length;i++){
                        let type = QA_list[i].type;
                        switch(type){
                          case '闲聊': {QA_list[i].color = '#747d8c'} break;
                          case '情感': {QA_list[i].color = '#ff6b81'} break;
                          case '学习': {QA_list[i].color = '#1e90ff'} break;
                          case '生活': {QA_list[i].color = '#eccc68'} break;
                        }
                        if(QA_list[i].reply_content != null){
                          let reply_content = base64.decode(QA_list[i].reply_content);
                          QA_list[i].reply_content = reply_content;
                        }
                        if(QA_list[i].openname != null){
                          let openname = base64.decode(QA_list[i].openname);
                          QA_list[i].openname = openname;
                        }
                        let picture1 = QA_list[i].picture1;
                        let picture2 = QA_list[i].picture2;
                        if (picture1 != null) {
                          QA_list[i].picture1 = "https://static.powerv.top/static/img/QAImg/" + picture1;
                        }
                        if (picture2 != null) {
                          QA_list[i].picture2 = "https://static.powerv.top/static/img/QAImg/" + picture2;
                        }
                      }
                      this.setData({
                        QA_list: QA_list,
                        QALoading: false
                      })
                      Notify({
                        message: '获取到 ' + res.data.length + ' 条问答',
                        type: 'success ',
                        safeAreaInsetTop: true,
                        duration: '600'
                      });
                    })
                  })
                })
              })
            }
          })
        })
      }
    }
    // 获取轮播图
    request({
      url: "api/Article/index", 
      method: 'GET'
    }).then(res =>{
      console.log(res.data);
      let noticeContent = res.data.notice.content;
      let imgUrls = res.data.picture;
      for(let i=0;i<imgUrls.length;i++){
        imgUrls[i].plink = "https://static.powerv.top/static/img/home/" + imgUrls[i].plink + ".png";
      }
      this.setData({
        noticeContent: noticeContent,
        imgUrls: imgUrls,
        helplink: res.data.temp.content
      })
    })
  },
  onShow: function () {
    let firstTip = wx.getStorageSync('firstTip');
    if(firstTip == 'not'){
      this.setData({ pillNoticeShow: false });
    } else if(firstTip == undefined || firstTip == ''){
      this.setData({ pillNoticeShow: true });
      wx.setStorageSync('firstTip', 'not');
    }
  },
  // 功能路由相关
  navTo(e){
    let firstUse = wx.getStorageSync('firstUse');
    if(firstUse == 'not'){
      let url = e.currentTarget.dataset.url;
      wx.navigateTo({
        url: '/pages/' + url + '/' + url,
      })
    } else{
      wx.navigateTo({
        url: '../guide/guide?from=import',
      })
    }
  },
  // 胶囊提示相关
  pillNoticeTap(){
    this.setData({ pillNoticeShow: false });
  },
  // 情侣弹出相关
  popBtnTap(e){
    let type = e.currentTarget.dataset.type;
    request({
      url: "api/lover/" + type, 
      method: 'GET', header: {'cookie':wx.getStorageSync('sessionid')}
    }).then(res =>{
      console.log(res)
      this.setData({ popShow: false });
    })
  },
  popLinkTap(){
    Toast('抱歉，个人主页暂未开放');
  },
  // 留言相关
  writeTap(){
    let lover_status = this.data.lover_status;
    if(lover_status == 1){
      this.setData({ actionShow: true })
    } else{
      wx.navigateTo({
        url: '../guide/guide?from=home',
      })
      wx.showToast({
        title: '绑定一位用户之后才能给对方留言哦',
        icon: 'none'
      })
    }
  },
  // 抱歉提示
  sorryTap(){
    wx.showToast({
      title: '更多功能正在秃头开发中',
      icon: 'none'
    })
  },
  // 跳转留言板
  navToMsg(){
    this.setData({ actionShow: false });
    wx.navigateTo({ url: '/pages/couple/msgboard/msgboard' })
  },
  // 跳转情侣空间
  navToCouple(){
    wx.navigateTo({ url: '/pages/couple/couple?from=home' })
  },
  // 跳转公众号
  navPublic(e){
    let link = e.currentTarget.dataset.link;
    let id = e.currentTarget.dataset.id;
    console.log(e)
    console.log(id)
    request({
      url: "api/article/click?id=" + id, 
      method: 'GET'
    }).then(res =>{
    })
    wx.navigateTo({
      url: '../publicPage/publicPage?link=' + encodeURIComponent(JSON.stringify(link)),
    })
  },
  // 跳转问答详情
  navQAPost(e){
    console.log(e);
    let content = e.currentTarget.dataset.content;
    let from = e.currentTarget.dataset.from;
    let id = e.currentTarget.dataset.id;
    if (from == 'checkImg') {
      wx.navigateTo({
        url: '/pages/QAPost/QAPost?from=checkImg&content=' + encodeURIComponent(JSON.stringify(content)) + '&id=' + id
      })
    } else {
      wx.navigateTo({
        url: '/pages/QAPost/QAPost?content=' + encodeURIComponent(JSON.stringify(content))
      })
    }
  },
  // 轮播图切换
  swiperChange(e) {
    let that = this;
    let current = e.detail.current;
    that.setData({ swiperCurrent: current })
  },
  // 新留言状态
  infoListTap(e){
    let titleTarget = e.currentTarget.dataset.id;
    this.setData({ titleTarget:titleTarget })
    if(titleTarget == 2){ this.setData({ hasMsg: false }) }
  },
  // 点赞
  agreeTap(e){
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let QA_list = this.data.QA_list;
    let likes = QA_list[index].likes;
    request({
      url: "api/qa/likes?id=" + id, 
      method: 'GET', header: {'cookie':wx.getStorageSync('sessionid')}
    }).then(res =>{
      console.log(res)
      if (res.data.code == 200) {
        let str1 = "QA_list[" + index + "].islike";
        let str2 = "QA_list[" + index + "].likes";
        this.setData({ 
          [str1]: 1,
          [str2]: likes + 1
        })
      } else if (res.data.code == 300) {
        let str1 = "QA_list[" + index + "].islike";
        let str2 = "QA_list[" + index + "].likes";
        this.setData({ 
          [str1]: 0,
          [str2]: likes - 1
        })
      }
      Toast(res.data.msg)
    })
  },
  // 拍一拍
  flipTap(e){
    let id = e.currentTarget.dataset.id;
    let name = e.currentTarget.dataset.name;
    let index = e.currentTarget.dataset.index;
    let QA_list = this.data.QA_list;
    let applaud = QA_list[index].applaud;
    request({
      url: "api/qa/applaud?id=" + id, 
      method: 'GET', header: {'cookie':wx.getStorageSync('sessionid')}
    }).then(res =>{
      console.log(res)
      if (res.data.code == 200) {
        let str1 = "QA_list[" + index + "].isapplaud";
        let str2 = "QA_list[" + index + "].applaud";
        this.setData({ 
          [str1]: 1,
          [str2]: applaud + 1
        })
        Toast('你拍了拍@' + name)
      } else if (res.data.code == 300) {
        let str1 = "QA_list[" + index + "].isapplaud";
        let str2 = "QA_list[" + index + "].applaud";
        this.setData({ 
          [str1]: 0,
          [str2]: applaud - 1
        })
        Toast('撤回了拍一拍@' + name)
      }
    })
  },
  showPopup() {
    this.setData({ popShow: true });
  },
  onClose() {
    this.setData({ popShow: false });
  },
  onChange(e){
    let value = e.detail;
    this.setData({ msgValue: value })
  },
  actionClose() {
    this.setData({ actionShow: false });
  },
  // 留言相关
  sentMsg(){
    let msgValue = this.data.msgValue;
    if(msgValue.length == 0){
      wx.showToast({
        title: '请输入想说的话',
        icon: 'error'
      })
    } else{
      request({
        url: "api/lover/sendmsg?content=" + msgValue, 
        method: 'GET', header: {'cookie':wx.getStorageSync('sessionid')}
      }).then(res =>{
        console.log(res);
        if(res.data.code == 200){
          wx.showToast({
            title: '留言发送成功！对方将在留言板看到你的留言',
            icon: 'none'
          })
          this.setData({
            actionShow: false,
            msgValue: ''
          })
        } else if(res.data.code == 400){
          wx.showToast({
            title: '发送失败请重试',
            icon: 'error'
          })
        }
      })
    }
  },
  // 滑动反馈
  touchStart(e){
    // console.log(e)
    touchDotX = e.touches[0].pageX; // 获取触摸时的原点
    touchDotY = e.touches[0].pageY;
    // 使用js计时器记录时间    
    interval = setInterval(function () {
      time++;
    }, 100);
    this.setData({
      touchX: e.changedTouches[0].clientX,
      touchY: e.changedTouches[0].clientY,
    });
  },
  touchEnd(e){
    let touchMoveX = e.changedTouches[0].pageX;
    let touchMoveY = e.changedTouches[0].pageY;
    let tmX = touchMoveX - touchDotX;
    let tmY = touchMoveY - touchDotY;
    let {
      titleTarget
    } = this.data;
    if (time < 20) {
      let absX = Math.abs(tmX);
      let absY = Math.abs(tmY);
      if (absX > 2 * absY) {
        if (tmX < 0 && titleTarget == 0) {
          this.setData({
            titleTarget: 1,
          });
        } else if (tmX >= 0 && titleTarget == 1) {
          this.setData({
            titleTarget: 0,
          });
        } else if (tmX < 0 && titleTarget == 1) {
          this.setData({
            titleTarget: 2,
          });
        } else if (tmX >= 0 && titleTarget == 2) {
          this.setData({
            titleTarget: 1,
          });
        } else if (tmX < 0 && titleTarget == 2) {
          this.setData({
            titleTarget: 0,
          });
        } else if (tmX >= 0 && titleTarget == 0) {
          this.setData({
            titleTarget: 2,
          });
        } else {
          return;
        }
      }
    }
    clearInterval(interval);
    time = 0;
  },
  // 列表下拉
  pullUpLoad(){
    console.log("====下拉====");
    let that = this;
    let QAEnd = that.data.QAEnd;
      if (!QAEnd) {
      let QA_list = that.data.QA_list;
      let QAPage = that.data.QAPage + 1;
      console.log(QAPage)
      that.setData({
        QALoading: true,
        QAPage: QAPage
      })
      request({
        url: "api/qa/list?page=" + QAPage, 
        method: 'GET',header: {'cookie':wx.getStorageSync('sessionid')}
      }).then(res =>{
        console.log(res.data)
        let arr = res.data;
        for(let i=0;i<arr.length;i++){
          let type = arr[i].type;
          switch(type){
            case '闲聊': {arr[i].color = '#747d8c'} break;
            case '情感': {arr[i].color = '#ff6b81'} break;
            case '学习': {arr[i].color = '#1e90ff'} break;
            case '生活': {arr[i].color = '#eccc68'} break;
          }
          if(arr[i].reply_content != null){
            let reply_content = base64.decode(arr[i].reply_content);
            arr[i].reply_content = reply_content;
          }
          if(arr[i].openname != null){
            let openname = base64.decode(arr[i].openname);
            arr[i].openname = openname;
          }
          let picture1 = arr[i].picture1;
          let picture2 = arr[i].picture2;
          if (picture1 != null) {
            arr[i].picture1 = "https://static.powerv.top/static/img/QAImg/" + picture1;
          }
          if (picture2 != null) {
            arr[i].picture2 = "https://static.powerv.top/static/img/QAImg/" + picture2;
          }
        }
        let newArr = QA_list.concat(arr);
        that.setData({
          QA_list: newArr,
          QALoading: false
        })
        if (res.data.length > 0) {
          Notify({
            message: '获取到 ' + res.data.length + ' 条问答',
            type: 'success ',
            safeAreaInsetTop: true,
            duration: '600'
          });
        } else{
          Notify({
            message: '没有更多问答了哦',
            type: 'warning ',
            safeAreaInsetTop: true,
            duration: '600'
          });
          that.setData({
            QAEnd: true,
            QAPage: QAPage - 1
          })
        }
      })
    } else{
      Notify({
        message: '没有更多问答了哦',
        type: 'warning ',
        safeAreaInsetTop: true,
        duration: '600'
      });
    }
  },
  // 分享相关
  onShareAppMessage(res){
    return {
      title: '大学查课表成绩选课，还有更多功能等你探索',
      path: '/pages/blank/blank',
    }
  }
})
