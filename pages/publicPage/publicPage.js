var app = getApp();
Page({
  data: {

  },
  onLoad: function (options) {
    let link = JSON.parse(decodeURIComponent(options.link));
    this.setData({ link: link})
  },
  onShow: function () {

  },
})