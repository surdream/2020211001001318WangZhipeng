var app = getApp();
Page({
  data: {

  },
  onLoad: function (options) {
    console.log(options.url)
    let url = JSON.parse(decodeURIComponent(options.url));
    console.log(url)
    this.setData({ url: url})
  },
  onShow: function () {

  },
})