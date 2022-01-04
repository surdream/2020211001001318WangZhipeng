var app = getApp();
const { request } = require("../../../utils/request/request");
Page({
    data: {
        menuButtonTop: app.globalData.menuButtonTop,
        menuButtonHeight: app.globalData.menuButtonHeight,
        contentHeight: app.globalData.contentHeight,
    },
    onLoad(options){
        let content = JSON.parse(decodeURIComponent(options.content));
        this.setData({ content: content });
    },
    getNumber(){
        wx.setClipboardData({
            data: '892301328',
            success(res){wx.showToast({ title: 'QQ群号已复制' })}
        })
    },
    BackPage() {
        wx.navigateBack({ delta: 1 }); 
    },
    navTo(){
        let link = 'https://mp.weixin.qq.com/s/W7f7Y53jtKBu5TwRXUY4gw';
        wx.navigateTo({
          url: '../../publicPage/publicPage?link=' + encodeURIComponent(JSON.stringify(link)),
        })
    },
    onShareAppMessage(){

    }
})