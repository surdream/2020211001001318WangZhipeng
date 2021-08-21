var app = getApp();
Page({
  data: {
    loading: true,
    menuButtonTop: app.globalData.menuButtonTop,
    menuButtonHeight: app.globalData.menuButtonHeight,
    startDate: '2021/3/1',
    endDate: '2022/2/27',
    formatter(day) {
      const month = day.date.getMonth() + 1;
      const date = day.date.getDate();
      let week = day.date.getDay()
      if (week === 0) week = 7
      if (week === 6||week === 7){
        day.topInfo = '周末';
        day.type = 'disabled'
      }
      if (day.type === 'start'){
        day.bottomInfo = ''
      } else if(day.type === 'end'){
        day.bottomInfo = ''
      }
      if (month === 9) {
        if (date === 5) {
          day.topInfo = '开学';
          day.type = 'start'
          day.bottomInfo = ''
        } else if (date === 10) {
          day.topInfo = '教师节';
          day.type = 'middle'
        }
      }
      if (month === 10) {
        if (date<=7) {
          day.topInfo = '国庆节';
          day.type = 'middle'
        } 
      }
      return day;
    },
  },
  onLoad: function (options) {

  },
  onShow: function () {

  },
  BackPage() {
    wx.navigateBack({
        delta: 1,
    });
  },
  onDisplay() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },
  formatDate(date) {
    date = new Date(date);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  },
  onConfirm(event) {
    this.setData({
      show: false,
      date: this.formatDate(event.detail),
    });
  },
})