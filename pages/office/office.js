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
    popShow: false,
    showGrade: false,
    selectIndex: null,
    diff: 0, //日期差值
    titleTarget: 0, //列表标签
    grade_term: '2021.1', //默认学期
    pickerImg:'/images/conmon/down-tri.png',
    chart_list: [],
    grade_list: [],
    arrange_list: [],
    repair_list: [],
    grade_actions: [],
    weekDayLits: ['一','二','三','四','五','六','七',],
    officeColorList: ['#67D5B5','#EE7785','#C89EC4','#84B1ED'],
    userInfo: {schUrl: '/images/conmon/ecjtu.jpg'},
    infoListTitle: [{name: '我的课表'},{name: '查询成绩'},{name: '考试安排'}],
  },
  onLoad(options) {
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    this.setData({
      courentTime: timestamp,
      courentDay: time.formatTimeRev(timestamp,'M/D')
    })
    let firstUse = wx.getStorageSync('firstUse');
    if(firstUse == 'not'){
      let accountInfo = wx.getStorageSync('accountInfo');
      let credit = (parseFloat(accountInfo.credit_art)+parseFloat(accountInfo.credit_vo)+parseFloat(accountInfo.credit_work)).toFixed(1);
      this.setData({
        accountInfo: accountInfo,
        credit: credit,
        grade_term: accountInfo.oldterm[accountInfo.oldterm.length-1]
      })
      for(let i=0;i<accountInfo.oldterm.length;i++){
        let term_list_str = 'grade_actions[' + i + '].name';
        this.setData({[term_list_str]: accountInfo.oldterm[i]})
      }
      // 查询课表
      request({
        url: "api/edu/today?", 
        method: 'GET', header: {'cookie':wx.getStorageSync('sessionid')}
      }).then(res =>{
        console.log(res)
        if(res.data.code == 200){
          let chart_list = res.data.data
          this.setData({ chart_list: chart_list })
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
            for(let i=0;i<courseList.length;i++){ //规范化名称
              var classStr = courseList[i].class_name_fix;
              var nameStr = courseList[i].course_name;
              var result1 = classStr.replace(/【/g,'[');
              var result2 = result1.replace(/】/g,']');
              var result3 = nameStr.replace(/（/g,'(');
              var result4 = result3.replace(/）/g,')');
              courseList[i].class_name_fix = result2;
              courseList[i].course_name = result4;
            }
            this.setData({ courseList: courseList })
          } else if(res.data.code == 400){
          }
        })
      })
      // 查询成绩
      request({
        url: "api/edu/grade?term=" + this.data.grade_term, 
        method: 'GET', header: {'cookie':wx.getStorageSync('sessionid')}
      }).then(res =>{
        console.log(res.data)
        let grade_list = res.data.data;
        this.setData({ grade_list: grade_list })
        // 考试安排
        request({
          url: "api/edu/exam", 
          method: 'GET', header: {'cookie':wx.getStorageSync('sessionid')}
        }).then(res =>{
          console.log(res.data)
          let normal_list = res.data.data.normal;
          let repair_list = res.data.data.re;
          this.setData({ arrange_list: normal_list.concat(repair_list) })
          this.setData({ loading: false })
        })
      })
    } else{
      this.setData({
        loading: false,
        courseList: [
          {
            course_name: '高等数学Ⅰ(示例)',
            class_name_fix: '2021-10班',
            class_number: '1',
            method: '考试',
            credit: '6'
          },
          {
            course_name: '大学军事(示例)',
            class_name_fix: '2021-12班',
            class_number: '3',
            method: '考察',
            credit: '3'
          },
          {
            course_name: '大学英语Ⅰ(示例)',
            class_name_fix: '2021-11班',
            class_number: '2',
            method: '考试',
            credit: '2'
          },
          {
            course_name: '大学体育Ⅰ(示例)',
            class_name_fix: '2021-13班',
            class_number: '4',
            method: '考察',
            credit: '1'
          },
        ]
      })
      wx.showToast({
        title: '请先导入课表',
        icon: 'error'
      })
    }
  },
  onShow(){
  },
  BackPage(){
    wx.navigateBack({ delta: 1 });
  },
  infoListTap(e){
    let titleTarget = e.currentTarget.dataset.id;
    this.setData({
      titleTarget: titleTarget,
      fromTarget: null,
    })
  },
  pickerTap(){
    this.setData({
      showGrade: true,
      pickerImg:'/images/conmon/up-tri.png'
    })
  },
  selectCourseTap(e){
    let id = e.currentTarget.dataset.id;
    this.setData({ 
      selectIndex: id,
      popShow: true
    });
    wx.showToast({
      title: '左右滑动可以切换课程😜',
      icon: 'none'
    })
  },
  onGradeClose() {
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
      this.setData({ grade_list: grade_list })
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
      wx.navigateTo({ url: '/pages/' + url + '/' + url })
    } else{
      wx.navigateTo({ url: '../guide/guide?from=import' })
    }
  },
  sorryTap(){
    wx.showToast({
      title: '该功能正在全力开发中，敬请期待',
      icon: 'none'
    })
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
        icon: 'error'
      })
    }
  },
  touchStart(e){
    touchDotX = e.touches[0].pageX;
    touchDotY = e.touches[0].pageY;
    interval = setInterval(function () {
      touchTime++;
    }, 100);
    this.setData({
      touchX: e.changedTouches[0].clientX,
      touchY: e.changedTouches[0].clientY,
    });
  },
  touchEnd(e){
    let {
      selectIndex,
      courseList
    } = this.data;
    let touchMoveX = e.changedTouches[0].pageX;
    let touchMoveY = e.changedTouches[0].pageY;
    let tmX = touchMoveX - touchDotX;
    let tmY = touchMoveY - touchDotY;
    if (touchTime < 20) {
      let absX = Math.abs(tmX);
      let absY = Math.abs(tmY);
      if (absX > 2 * absY) {
        if (tmX < 0 && selectIndex != courseList.length - 1) {
          this.setData({ selectIndex: selectIndex + 1});
        } else if (tmX >= 0 && selectIndex != 0) {
          this.setData({ selectIndex: selectIndex - 1});
        } else {
          if(selectIndex == 0){
            this.setData({ selectIndex: courseList.length - 1});
          } else if(selectIndex == courseList.length - 1){
            this.setData({ selectIndex: 0});
          } else {
            return;
          }
        }
      }
    }
    clearInterval(interval);
    touchTime = 0;
  },
  onClose() {
    this.setData({ popShow: false });
  },
  onShareAppMessage: function (res) {
    return {
      title: '大学查课表成绩选课，还有更多功能等你探索',
      path: '/pages/blank/blank',
    }
  }
})