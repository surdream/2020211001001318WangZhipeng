import Notify from '@vant/weapp/notify/notify'; // 通知
import Toast from '@vant/weapp/toast/toast'; // Toast
var app = getApp();
var myBase64 = require("../../utils/mybase64.js");
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
    QA_all: [],
    event_list: [],
    lost_list: [],
    imgUrls: [],
    courseList: [ // 课表区域标题
      {default: '今日',after: '课表'},
      {default: '关联',after: '课表'}
    ],
    qaList: [ // 问答区域标题
      {
        default: '问答',
        pre: '校园',
        helplink: {
          title: '如何发布问题',
          link: 'https://mp.weixin.qq.com/s/9WBqK2bTlHFwd2-na1j6zw'
        }
      },
      {
        default: '活动',
        pre: '近期',
        helplink: {
          title: '如何参加活动',
          link: 'https://mp.weixin.qq.com/s/9WBqK2bTlHFwd2-na1j6zw'
        }
      },
      {
        default: '比赛',
        after: '组队',
        helplink: {
          title: '如何进行组队',
          link: 'https://mp.weixin.qq.com/s/9WBqK2bTlHFwd2-na1j6zw'
        }
      },
      {
        default: '失物',
        after: '招领',
        helplink: {
          title: '如何进行发布',
          link: 'https://mp.weixin.qq.com/s/9WBqK2bTlHFwd2-na1j6zw'
        }
      }
    ],
    course_bg: [ // 状态背景
      {color: 'rgba(110,119,131,0.2)'},
      {color: 'rgba(66,211,173,0.2)'},
      {color: 'rgba(1,190,255,0.2)'},
      {color: 'rgba(1,190,255,0.2)'}
    ],
    QA_bg: [ // 问答背景
      {color: '#666699',type: '闲聊'},
      {color: '#FF6666',type: '情感'},
      {color: '#003399',type: '学习'},
      {color: '#FFCC99',type: '生活'},
      {color: '#339999',type: '求购'},
      {color: '#E76A8D',type: '表白'},
      {color: '#66CC99',type: '求助'},
    ],
    msgValue: '', // 文本输入值
    pwdValue: '', // 更新输入值
    QAPage: 1, // 问答分页数
    QAEnd: false, // 问答列表状态
    QA_show: false, // 问答显示状态
    hasMsg: false, // 新留言状态
    isUpdate: false, // 密码更新
    popShow: false, // 绑定申请状态
    pwdPopShow: false, // 密码异常
    hasImport: false, // 导入状态
    QALoading: true, // 问答加载状态
    actionShow: false, // 留言弹出状态
    indicatorDots: false, // 轮播图点状态
    pillNoticeShow: false, // 胶囊提示状态
    autoplay: true, // 轮播图显示状态
    interval: 3000, // 轮播图切换间隔
    duration: 1000, // 轮播图动画时长
    QATarget: 0, // 当前问答选项卡
    titleTarget: 0, // 当前选项卡
    swiperCurrent: 0, // 当前轮播图
  },
  onLoad(options){
    let firstUse = wx.getStorageSync('firstUse');
    if(firstUse == 'not'){
      this.setData({ hasImport: true });
      // 用户登录
      let userInfo = wx.getStorageSync('userInfo');
      if (userInfo == undefined || userInfo == ''){
        console.log('未登录');
      } else{
        request({
          url: "api/user/login?" + "account=" + userInfo.account + "&password=" + userInfo.password, method: 'GET', 
        }).then(res => {
          console.log(res);
          if (res.data.code == 401) {
            wx.clearStorageSync();
            wx.redirectTo({ url: '/pages/guide/guide' });
          } else {
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
                let openname = myBase64.decode(accountInfo.openname);
                    accountInfo.openname = openname;
                let edu_status = accountInfo.edu_status;
                let lover_status = accountInfo.lover_status;
                wx.setStorageSync('accountInfo', accountInfo);
                this.setData({
                  accountInfo: accountInfo,
                  lover_status: lover_status
                })
                if (lover_status != 1) {
                  let courseList = [
                    {default: '今日',after: '课表'},
                    {default: '关联',after: '课表'},
                    {default: '留言',pre: '我的'}
                  ]
                  this.setData({ courseList: courseList});
                } else {
                  let courseList = [
                    {default: '今日',after: '课表'},
                    {default: '关联',after: '课表'},
                    {default: '留言',pre: '我的'},
                    {default: '关心',after: '的人',style: 'msgText'}
                  ]
                  this.setData({ courseList: courseList});
                }
                // 判断留言状态
                if (accountInfo.lover) {
                  if (accountInfo.lover.msg.length != 0) {
                    this.setData({ hasMsg: true });
                  }
                }                
                // 判断情侣状态
                if (lover_status == 2) {
                  this.setData({ popShow: true });
                  Toast('有一条绑定申请');
                  // this.onLoad();
                }
                // 判断密码状态
                if (edu_status == 2) {
                  this.setData({ pwdPopShow: true });
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
                    let QA_all = res.data;
                    for(let i=0;i<QA_all.length;i++){
                      let QA_bg = this.data.QA_bg;
                      for(let j=0;j<QA_bg.length;j++){
                        if (QA_all[i].type == QA_bg[j].type) {
                          QA_all[i].color = QA_bg[j].color;
                        }
                      }
                      if(QA_all[i].reply_content != null){
                        let reply_content = myBase64.decode(QA_all[i].reply_content);
                        QA_all[i].reply_content = reply_content;
                      }
                      if(QA_all[i].openname != null){
                        let openname = myBase64.decode(QA_all[i].openname);
                        QA_all[i].openname = openname;
                      }
                      let picture1 = QA_all[i].picture1;
                      let picture2 = QA_all[i].picture2;
                      if (picture1 != null) {
                        QA_all[i].picture1 = "https://static.powerv.top/static/img/QAImg/" + picture1;
                      }
                      if (picture2 != null) {
                        QA_all[i].picture2 = "https://static.powerv.top/static/img/QAImg/" + picture2;
                      }
                    }
                    this.setData({
                      QA_all: QA_all,
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
                // cookie失效
              } else if(res.data.code == 400){
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
                      this.setData({ hasMsg: true });
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
                        let QA_all = res.data;
                        for(let i=0;i<QA_all.length;i++){
                          let QA_bg = this.data.QA_bg;
                          for(let j=0;j<QA_bg.length;j++){
                            if (QA_all[i].type == QA_bg[j].type) {
                              QA_all[i].color = QA_bg[j].color;
                            }
                          }
                          if(QA_all[i].reply_content != null){
                            let reply_content = myBase64.decode(QA_all[i].reply_content);
                            QA_all[i].reply_content = reply_content;
                          }
                          if(QA_all[i].openname != null){
                            let openname = myBase64.decode(QA_all[i].openname);
                            QA_all[i].openname = openname;
                          }
                          let picture1 = QA_all[i].picture1;
                          let picture2 = QA_all[i].picture2;
                          if (picture1 != null) {
                            QA_all[i].picture1 = "https://static.powerv.top/static/img/QAImg/" + picture1;
                          }
                          if (picture2 != null) {
                            QA_all[i].picture2 = "https://static.powerv.top/static/img/QAImg/" + picture2;
                          }
                        }
                        this.setData({
                          QA_all: QA_all,
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
          }
        })
      }
    } else {
      this.setData({ QA_show: true });
      // 获取问答列表
      request({
        url: "api/qa/list?page=1" , 
        method: 'GET'
      }).then(res =>{
        console.log(res.data);
        let QA_all = res.data;
        for(let i=0;i<QA_all.length;i++){
          let QA_bg = this.data.QA_bg;
          for(let j=0;j<QA_bg.length;j++){
            if (QA_all[i].type == QA_bg[j].type) {
              QA_all[i].color = QA_bg[j].color;
            }
          }
          if(QA_all[i].reply_content != null){
            let reply_content = myBase64.decode(QA_all[i].reply_content);
            QA_all[i].reply_content = reply_content;
          }
          if(QA_all[i].openname != null){
            let openname = myBase64.decode(QA_all[i].openname);
            QA_all[i].openname = openname;
          }
          let picture1 = QA_all[i].picture1;
          let picture2 = QA_all[i].picture2;
          if (picture1 != null) {
            QA_all[i].picture1 = "https://static.powerv.top/static/img/QAImg/" + picture1;
          }
          if (picture2 != null) {
            QA_all[i].picture2 = "https://static.powerv.top/static/img/QAImg/" + picture2;
          }
        }
        this.setData({
          QA_all: QA_all,
          QALoading: false
        })
        Notify({
          message: '获取到 ' + res.data.length + ' 条问答',
          type: 'success ',
          safeAreaInsetTop: true,
          duration: '600'
        });
      })
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
  onShow(){
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
      wx.navigateTo({url: '/pages/' + url + '/' + url});
    } else{
      wx.navigateTo({url: '../guide/guide?from=import'});
    }
  },
  // 胶囊提示相关
  pillNoticeTap(){
    this.setData({ pillNoticeShow: false });
  },
  // 情侣弹出相关
  popBtnTap(e){
    let type = e.currentTarget.dataset;
    request({
      url: "api/lover/" + type, 
      method: 'GET', header: {'cookie':wx.getStorageSync('sessionid')}
    }).then(res =>{
      console.log(res);
      if(type == 'acceptLover'){
        let courseList = [
          {default: '今日',after: '课表'},
          {default: '关联',after: '课表'},
          {default: '留言',pre: '我的'},
          {default: '关心',after: '的人',style: 'msgText'}
        ]
        this.setData({ courseList: courseList });
      }
      this.setData({ popShow: false });
    })
  },
  // 情侣相关
  popLinkTap(){
    Toast('抱歉，个人主页暂未开放');
  },
  // 留言相关
  writeTap(){
    let lover_status = this.data.lover_status;
    if(lover_status == 1){
      this.setData({ actionShow: true });
    } else{
      wx.navigateTo({url: '../guide/guide?from=home'});
      Toast('绑定一位用户之后才能给对方留言哦');
    }
  },
  // 抱歉提示
  sorryTap(){
    Toast('更多功能正在秃头开发中');
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
    let {
      link,
      id
    } = e.currentTarget.dataset;
    request({
      url: "api/article/click?id=" + id, 
      method: 'GET'
    })
    wx.navigateTo({url: '../publicPage/publicPage?link=' + encodeURIComponent(JSON.stringify(link))});
  },
  // 跳转问答详情
  navQAPost(e){
    let {
      content,
      from,
      id
    } = e.currentTarget.dataset;
    if (from == 'checkImg') {
      wx.navigateTo({url: '/pages/QAPost/QAPost?from=checkImg&content=' + encodeURIComponent(JSON.stringify(content)) + '&id=' + id});
    } else {
      wx.navigateTo({url: '/pages/QAPost/QAPost?content=' + encodeURIComponent(JSON.stringify(content))});
    }
  },
  // 轮播图切换
  swiperChange(e) {
    let that = this;
    let current = e.detail.current;
    that.setData({ swiperCurrent: current });
  },
  // 选项卡切换
  infoListTap(e){
    let titleTarget = e.currentTarget.dataset.id;
    this.setData({ titleTarget: titleTarget });
    if(titleTarget == 2){
      this.setData({ hasMsg: false })
    }
  },
  // 问答选项卡
  QAListTap(e){
    let QATarget = e.currentTarget.dataset.id;
    this.setData({ QATarget: QATarget });
  },
  // 密码更新相关
  pwdSetTap(){
    let password = this.data.pwdValue;
    this.setData({ isUpdate: true });
    request({
      url: "api/user/changePassword?password=" + password, method: 'GET',
      header: {'cookie':wx.getStorageSync('sessionid')} 
    }).then(res => {
      let code = res.data.code;
      if (code == 200) {
        let userInfo = {account: wx.getStorageSync('userInfo').account,password: password};
        wx.setStorageSync('userInfo', userInfo);
        Toast('密码更新成功！');
        this.setData({ 
          isUpdate: false,
          pwdPopShow: false,
          pwdValue: ''
        })
        this.onLoad();
      } else if (code == 205) {
        Toast('密码错误，请重新输入');
        this.setData({ 
          isUpdate: false,
          pwdValue: ''
        })
      } else if (code == 206) {
        Toast('密码重复，请输入新密码');
        this.setData({ 
          isUpdate: false,
          pwdValue: ''
        })
      } else {
        Toast('教务正在维护，请稍后重试');
        this.setData({ 
          isUpdate: false,
          pwdPopShow: false,
          pwdValue: ''
        })
      }
    })
  },
  // 跳转个人主页
  navHomepage(e){
    let {
      id,
      content
    } = e.currentTarget.dataset;
    console.log(content)
    if(id == this.data.accountInfo.userid_show){
      wx.navigateTo({url: '../homepage/homepage?from=self'});
    } else {
      wx.navigateTo({url: '../homepage/homepage?from=other&content=' + encodeURIComponent(JSON.stringify(content))});
    }
  },
  // 点赞
  agreeTap(e){
    let {
      id,
      index
    } = e.currentTarget.dataset;
    let QA_all = this.data.QA_all;
    let likes = QA_all[index].likes;
    request({
      url: "api/qa/likes?id=" + id, 
      method: 'GET', header: {'cookie':wx.getStorageSync('sessionid')}
    }).then(res =>{
      if (res.data.code == 200) {
        let str1 = "QA_all[" + index + "].islike";
        let str2 = "QA_all[" + index + "].likes";
        this.setData({ 
          [str1]: 1,
          [str2]: likes + 1
        })
      } else if (res.data.code == 300) {
        let str1 = "QA_all[" + index + "].islike";
        let str2 = "QA_all[" + index + "].likes";
        this.setData({ 
          [str1]: 0,
          [str2]: likes - 1
        })
      }
      Toast(res.data.msg);
    })
  },
  // 拍一拍
  flipTap(e){
    let {
      id,
      name,
      index
    } = e.currentTarget.dataset;
    let QA_all = this.data.QA_all;
    let applaud = QA_all[index].applaud;
    request({
      url: "api/qa/applaud?id=" + id, 
      method: 'GET', header: {'cookie':wx.getStorageSync('sessionid')}
    }).then(res =>{
      if (res.data.code == 200) {
        let str1 = "QA_all[" + index + "].isapplaud";
        let str2 = "QA_all[" + index + "].applaud";
        this.setData({ 
          [str1]: 1,
          [str2]: applaud + 1
        })
        Toast('你拍了拍@' + name);
      } else if (res.data.code == 300) {
        let str1 = "QA_all[" + index + "].isapplaud";
        let str2 = "QA_all[" + index + "].applaud";
        this.setData({ 
          [str1]: 0,
          [str2]: applaud - 1
        })
        Toast('撤回了拍一拍@' + name);
      }
    })
  },
  // 来源相关
  sourceTap(e){
    let name = e.currentTarget.dataset.name;
    Toast('投稿自 @' + name + ' 公众号');
  },
  // 打开留言面板
  showPopup() {
    this.setData({ popShow: true });
  },
  // 留言输入
  onChange(e){
    let value = e.detail;
    this.setData({ msgValue: value });
  },
  // 密码更新
  pwdOnChange(e){
    let value = e.detail;
    this.setData({ pwdValue: value });
  },
  // 留言面板关闭
  onClose() {
    this.setData({ popShow: false });
  },
  // 更新面板关闭
  pwdOnClose() {
    this.setData({ pwdPopShow: false });
  },
  // 情侣面板关闭
  actionClose() {
    this.setData({ actionShow: false });
  },
  // 留言相关
  sentMsg(){
    let msgValue = this.data.msgValue;
    if(msgValue.length == 0){
      Toast('请输入想说的话');
    } else{
      request({
        url: "api/lover/sendmsg?content=" + msgValue, 
        method: 'GET', header: {'cookie':wx.getStorageSync('sessionid')}
      }).then(res =>{
        if(res.data.code == 200){
          Toast('留言发送成功！对方将在留言板看到你的留言');
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
    let type = e.currentTarget.dataset.type;
    if (type == 'course') {
      var length = this.data.courseList.length;
      var target = this.data.titleTarget;
      var targetStr = 'titleTarget';
    } else if (type == 'QA') {
      var length = this.data.qaList.length;
      var target = this.data.QATarget;
      var targetStr = 'QATarget';
    }
    if (time < 20) {
      let absX = Math.abs(tmX);
      let absY = Math.abs(tmY);
      if (absX > 1 * absY) {
        if (tmX < 0 && target != length - 1) {
          this.setData({[targetStr]: target + 1});
        } else if (tmX >= 0 && target != 0) {
          this.setData({[targetStr]: target - 1});
        } else {
          if (tmX < 0 && target == length - 1) {
            this.setData({[targetStr]: 0 });
          } else if (tmX >= 0 && target == 0) {
            this.setData({[targetStr]: length - 1});
          }
          return;
        }
      }
    }
    clearInterval(interval);
    time = 0;
  },
  // 列表下拉
  pullUpLoad(){
    let that = this;
    let QAEnd = that.data.QAEnd;
    let QA_bg = that.data.QA_bg;
      if (!QAEnd) {
      let QA_all = that.data.QA_all;
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
          for(let j=0;j<QA_bg.length;j++){
            if (arr[i].type == QA_bg[j].type) {
              arr[i].color = QA_bg[j].color;
            }
          }
          if(arr[i].reply_content != null){
            let reply_content = myBase64.decode(arr[i].reply_content);
            arr[i].reply_content = reply_content;
          }
          if(arr[i].openname != null){
            let openname = myBase64.decode(arr[i].openname);
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
        let newArr = QA_all.concat(arr);
        that.setData({
          QA_all: newArr,
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
  onShareAppMessage(){
    return {
      title: '大学查课表成绩选课，还有更多功能等你探索',
      path: '/pages/blank/blank'
    }
  }
})
