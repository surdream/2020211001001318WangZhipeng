import Notify from '@vant/weapp/notify/notify';
var time = require('../../utils/util.js');
const { request } = require("../../utils/request/request");
var app = getApp();
let touchDotX = 0;//X按下时坐标
let touchDotY = 0;//y按下时坐标
let interval;//计时器
let touchTime = 0;//从按下到松开共多少时间*100
Page({
  data: {
    colorList: app.globalData.glassColor,
    menuButtonTop: app.globalData.menuButtonTop,
    menuButtonHeight: app.globalData.menuButtonHeight,
    contentHeight: app.globalData.contentHeight,
    loading: true,
    showGrade: false,
    diff: 0, //日期差值
    titleTarget: 0, //列表标签
    grade_term: '2020.2', //默认学期
    pickerImg:'/images/conmon/down-tri.png',
    chart_list: [],
    grade_list: [],
    arrange_list: [],
    repair_list: [],
    grade_actions: [
      {name: '2021.2'},
      {name: '2021.1'},
      {name: '2020.2'},
      {name: '2020.1'},
      {name: '2019.2'},
      {name: '2019.1'},
      {name: '2018.2'},
      {name: '2018.1'},
    ],
    officeColorList: [
      '#7BDEE8','#EE7785','#E3C160','#C1E965'
    ],
    userInfo: {
      schUrl: '/images/conmon/ecjtu.jpg'
    },
    infoListTitle: [
      {name: '我的课表'},{name: '查询成绩'},{name: '考试安排'}
    ],
    courseList: [
      {title: '高等数学Ⅰ',teacher: '刘二根',address: '31栋218',class: '2020-2小二班',microNum: '23'},
      {title: '高等数学Ⅰ',teacher: '刘二根',address: '31栋218',class: '2020-2小二班',microNum: '23'},
      {title: '高等数学Ⅰ',teacher: '刘二根',address: '31栋218',class: '2020-2小二班',microNum: '23'},
      {title: '高等数学Ⅰ',teacher: '刘二根',address: '31栋218',class: '2020-2小二班',microNum: '23'},
    ],
  },
  onLoad: function (options) {
    let firstUse = wx.getStorageSync('firstUse');
    if(firstUse == 'not'){
      let accountInfo = wx.getStorageSync('accountInfo');
      this.setData({
        accountInfo: accountInfo
      })
      // 查询课表
      request({
        url: "api/edu/today?", 
        method: 'GET', header: {'cookie':wx.getStorageSync('sessionid')}
      }).then(res =>{
        console.log(res)
        if(res.data.code == 200){
          let chart_list = res.data.data
          this.setData({
            chart_list: chart_list
          })
          Notify({
            message: '查询到当天共有' + chart_list.length + '门课',
            type: 'primary',
            safeAreaInsetTop: true
          });
        } else if(res.data.code == 400){
          Notify({
            message: '查询失败',
            safeAreaInsetTop: true
          });
        }
        // 查询选课
        request({
          url: "api/edu/course?", 
          method: 'GET', header: {'cookie':wx.getStorageSync('sessionid')}
        }).then(res =>{
          console.log(res)
          if(res.data.code == 200){
            let courseList = res.data.data
            this.setData({
              courseList: courseList
            })
          } else if(res.data.code == 400){
          }
        })
      })
      // 查询成绩
      request({
        url: "api/edu/grade?term=2020.2", 
        method: 'GET', header: {'cookie':wx.getStorageSync('sessionid')}
      }).then(res =>{
        console.log(res.data)
        let grade_list = res.data.data;
        this.setData({
          grade_list: grade_list
        })
        // 考试安排
        request({
          url: "api/edu/exam", 
          method: 'GET', header: {'cookie':wx.getStorageSync('sessionid')}
        }).then(res =>{
          console.log(res.data)
          let arrange_list = res.data.data.normal;
          let repair_list = res.data.data.re;
          this.setData({
            arrange_list: arrange_list,
            repair_list: repair_list
          })
          this.setData({
            loading: false
          })
        })
      })
    } else{
      this.setData({
        loading: false
      })
      wx.showToast({
        title: '请先导入课表',
        icon: 'error'
      })
    }
  },
  onShow: function () {
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    this.setData({
      courentTime: timestamp,
      courentDay: time.formatTimeRev(timestamp,'M/D')
    })
  },
  BackPage() {
    wx.navigateBack({
        delta: 1,
    });
  },
  infoListTap: function(e){
    let titleTarget = e.currentTarget.dataset.id;
    this.setData({
      titleTarget:titleTarget,
      fromTarget: null,
    })
  },
  pickerTap(){
    this.setData({
      showGrade: true,
      pickerImg:'/images/conmon/up-tri.png'
    })
  },
  onClose() {
    this.setData({
      showGrade: false,
      pickerImg:'/images/conmon/down-tri.png'
    });
  },
  onSelect(event) {
    let name = event.detail.name;
    this.setData({ grade_term: name});
    request({
      url: "api/edu/grade?term=" + name, 
      method: 'GET', header: {'cookie':wx.getStorageSync('sessionid')}
    }).then(res =>{
      console.log(res.data)
      let grade_list = res.data.data;
      let grade_term = this.data.grade_term;
      this.setData({
        grade_list: grade_list
      })
      Notify({
        message: '查询到' + grade_term + '学期共有' + grade_list.length + '门成绩',
        type: 'warning',
        safeAreaInsetTop: true,
        duration: 800,
      });
    })
  },
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
  switchBtn(e){
    let firstUse = wx.getStorageSync('firstUse');
    if(firstUse == 'not'){
      let diff = this.data.diff;
      let courentTime = this.data.courentTime;    
      let type = e.currentTarget.dataset.type;
      if( type == 'after'){
        this.setData({
          diff:diff+1,
          courentTime: courentTime + 86400,
          courentDay: time.formatTimeRev((courentTime + 86400),'M/D')
        })
        diff++;
      } else if( type == 'before'){
        this.setData({
          diff:diff-1,
          courentTime: courentTime - 86400,
          courentDay: time.formatTimeRev((courentTime - 86400),'M/D')
        })
        diff--;
      }
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      request({
        url: "api/edu/today?" + 'oday=' + diff, 
        method: 'GET', header: {'cookie':wx.getStorageSync('sessionid')}
      }).then(res =>{
        console.log(res.data.data)
        if(res.data.code == 200){
          let chart_list = res.data.data
          this.setData({
            chart_list: chart_list
          })
          wx.hideLoading()
          Notify({
            message: '查询到当天共有' + chart_list.length + '门课',
            type: 'primary',
            safeAreaInsetTop: true,
            duration: 800,
          });
        } else if(res.data.code == 400){
          Notify({
            message: '查询失败',
            duration: 800,
          });
        }
      })
    } else{
      wx.showToast({
        title: '未导入课表，无法进行查询',
        icon: 'none'
      })
    }
  },
  touchStart: function (e) {
    // console.log(e)
    touchDotX = e.touches[0].pageX; // 获取触摸时的原点
    touchDotY = e.touches[0].pageY;
    // 使用js计时器记录时间    
    interval = setInterval(function () {
      touchTime++;
    }, 100);
    this.setData({
      touchX: e.changedTouches[0].clientX,
      touchY: e.changedTouches[0].clientY,
    });
  },
  touchEnd: function (e) {
    // console.log(e)
    let touchMoveX = e.changedTouches[0].pageX;
    let touchMoveY = e.changedTouches[0].pageY;
    let tmX = touchMoveX - touchDotX;
    let tmY = touchMoveY - touchDotY;
    let {
      titleTarget
    } = this.data;
    if (touchTime < 20) {
      let absX = Math.abs(tmX);
      let absY = Math.abs(tmY);
      if (absX > 2 * absY) {
        if (tmX < 0) {
          // console.log("左滑=====" + tmX)
        } else {
          // console.log("右滑=====" + tmX)
        }
        if (tmX < 0 && titleTarget == 0) {
          this.setData({
            titleTarget: 1,
            fromTarget: null
          });
        } else if (tmX >= 0 && titleTarget == 1) {
          this.setData({
            titleTarget: 0,
            fromTarget: null
          });
        } else if (tmX < 0 && titleTarget == 1) {
          this.setData({
            titleTarget: 2,
            fromTarget: null
          });
        } else if (tmX >= 0 && titleTarget == 2) {
          this.setData({
            titleTarget: 1,
            fromTarget: null
          });
        } else if (tmX < 0 && titleTarget == 2) {
          this.setData({
            titleTarget: 0,
            fromTarget: null
          });
        } else if (tmX >= 0 && titleTarget == 0) {
          this.setData({
            titleTarget: 2,
            fromTarget: null
          });
        }  else {
          return;
        }
      }
    }
    clearInterval(interval);
    touchTime = 0;
  },
})