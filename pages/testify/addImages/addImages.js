var app = getApp();
const {request} = require("./tools")
Page({
  data: {
    menuButtonTop: app.globalData.menuButtonTop,
    menuButtonHeight: app.globalData.menuButtonHeight,
    contentHeight: app.globalData.contentHeight,
    fileList: [],
    userInfo: {},
    array: ['暂未选择', '思政学习', '技能水平', '文体活动' , '双学位' , '文体竞赛' , '科创活动' , '体育竞赛' , '文体活动' , '社会实践' , '学团评比' , '优秀表彰'],
    actions: [
      {name:"思政学习"},
      {name:"技能水平"},
      {name:"文体活动"},
      {name:"双学位"},
      {name:"科创活动"},
      {name:"体育竞赛"},
      {name:"文体活动"},
      {name:"社会实践"},
      {name:"学团评比"},
      {name:"优秀表彰"},
    ],
    actions2: [
      {name:"思政学习"},
      {name:"技能水平"},
      {name:"文体活动"},
      {name:"双学位"},
      {name:"科创活动"},
      {name:"体育竞赛"},
      {name:"文体活动"},
      {name:"社会实践"},
      {name:"学团评比"},
      {name:"优秀表彰"},
    ],
    actions3: [
      {name:"全部证明"},
      {name:"思政学习"},
      {name:"技能水平"},
      {name:"文体活动"},
      {name:"双学位"},
      {name:"科创活动"},
      {name:"体育竞赛"},
      {name:"文体活动"},
      {name:"社会实践"},
      {name:"学团评比"},
      {name:"优秀表彰"},
    ],
    array2: ['全部证明', '思政学习', '技能水平', '文体活动' , '双学位' , '文体竞赛' , '科创活动' , '体育竞赛' , '文体活动' , '社会实践' , '学团评比' , '优秀表彰'],
    index: 0,
    index2: 0,
    addText: "添加",
    choosed: 0,
    maxChoose: 3,
    cancel: "",
    cancelText: "取消",
    ok: "确定",
    latelyText: "最近添加",
    choosedImgList: [],
    latelyImageList: [],
    alMaterialText: "所有证明",
    pullDownUrl: "https://nandu.xyz:9090/zxxzImages/pullDown.png",
    materials: [],
    valueNull1: "",
    valueNullContent1: "你最近还没有添加证明~",
    valueNull2: "",
    valueNullContent2: "你暂时还没有添加证明~",
    show: false,
    show2: false,
    addSelectName: "暂未选择",
    allName: "暂未选择"

  },
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo')
    console.log(userInfo);
    this.data.userInfo = userInfo;
    this.setData({
      userInfo: this.data.userInfo
    });

    // 获取最近添加的图片
    request({
      url: "photos/lately/" + this.data.userInfo.account , method: "GET",

    }).then( res=> {
      console.log(res)
      this.data.latelyImageList = []
      for(let i=0 ; i<res.data.data.length ; i++) {
        this.data.latelyImageList.unshift(res.data.data[i])
      }
      // let e = res
      for(let i=0 ; i<res.data.data.length ; i++) {
        this.data.latelyImageList[i].photoUrl = "https://nandu.xyz:9090" + this.data.latelyImageList[i].photoUrl
      }
      console.log(this.data.latelyImageList)
      this.setData({
        latelyImageList: this.data.latelyImageList
      })
      
      

    })
    // 获取所有证明
    request({
      url: "photos/all/" + this.data.userInfo.account, method: "POST",

    }).then( res => {
      console.log(res)
      this.data.materials = []
      for(let i=0 ; i<res.data.data.length ; i++) {
        this.data.materials.unshift(res.data.data[i])
      }
      for(let i=0 ; i<res.data.data.length ; i++) {
        this.data.materials[i].photoUrl = "https://nandu.xyz:9090" + this.data.materials[i].photoUrl
      }
      console.log(this.data.materials)
      this.setData({
        materials: this.data.materials
      })

    })

  },
  onShow: function () {

  },
  afterRead(event) {
    const { file } = event.detail;
    console.log(event.detail)
    this.data.imgList.push(event.detail.file.url);
    this.data.choosed = this.data.imgList.length
    this.setData({
      imgList: this.data.imgList,
      choosed: this.data.choosed
    })
    console.log( this.data.imgList , this.data.choosed)
  },
  BackPage() {
    wx.navigateBack({
        delta: 1,
    }); 
  },

  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },

  // 添加证书
  addMaterial: function(e) {
    let that = this
    if(this.data.addSelectName == "暂未选择") {
      this.data.show2 = true
      this.setData({
      show2: this.data.show2
    })
    } else {
      let that = this
      wx.chooseImage({
        count: 3,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          console.log(res)
          for(let i=0 ; i<res.tempFilePaths.length ; i++) {
            this.data.choosedImgList.push(res.tempFilePaths[i])
          }
          this.data.choosed = res.tempFilePaths.length
          console.log(this.data.choosedImgList)
          if(this.data.choosed == 0) {
            this.data.cancel = false
          } else {
            this.data.cancel = true
          }
          this.setData({
            choosedImgList: this.data.choosedImgList,
            choosed: this.data.choosed,
            cancel: this.data.cancel
          })
          // 上传图片
          // console.log(that.data.array[that.data.index])
          for(let i=0 ; i<that.data.choosedImgList.length ; i++) {
            wx.uploadFile({
              url: 'https://nandu.xyz:9090/photos/add/' + that.data.userInfo.account + "/" + that.data.addSelectName,
              filePath: that.data.choosedImgList[i],
              name: 'file',
              success (res) {
                console.log(res)
                that.data.choosedImgList = []
                that.data.index = 0
                that.setData({
                  choosedImgList: that.data.choosedImgList,
                  index: that.data.index
                })
                // 获取最近添加的图片
                request({
                  url: "photos/lately/" + that.data.userInfo.account , method: "GET",
                }).then( res=> {
                  console.log(res)
                  that.data.latelyImageList = []
                  for(let i=0 ; i<res.data.data.length ; i++) {
                    that.data.latelyImageList.unshift(res.data.data[i])
                  }
                  // let e = res
                  for(let i=0 ; i<res.data.data.length ; i++) {
                    that.data.latelyImageList[i].photoUrl = "https://nandu.xyz:9090" + that.data.latelyImageList[i].photoUrl
                  }
                  console.log(that.data.latelyImageList)
                  that.setData({
                    latelyImageList: that.data.latelyImageList
                  })
                })
                // 获取全部图片
                request({
                  url: "photos/all/" + that.data.userInfo.account, method: "POST",

                }).then( res => {
                  console.log(res)
                  that.data.materials = []
                  for(let i=0 ; i<res.data.data.length ; i++) {
                    that.data.materials.unshift(res.data.data[i])
                  }
                  for(let i=0 ; i<res.data.data.length ; i++) {
                    that.data.materials[i].photoUrl = "https://nandu.xyz:9090" + that.data.materials[i].photoUrl
                  }
                  console.log(that.data.materials)
                  that.setData({
                    materials: that.data.materials
                  })
                })

                wx.showToast({
                  title: '添加成功,长按图片可删除',
                  icon: 'none'
                })
              }
            })
          } 
        },
        fail: (res) => {
  
        },
      })
    }
  },
  // 删除图片
  deleteImg: function(e) {
    let that = this
    console.log(e.target);
    // 获取当前图片id
    let imgId = e.target.dataset.id;
    wx.showModal({
      title: '提示',
      content: '您确定要删除这张图片吗',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          request({
            url: "photos/del/" + imgId + "?uid=" + that.data.userInfo.account, method: "DELETE",
          }).then(res => {
            console.log(res);
            // 获取最近添加的图片
            request({
              url: "photos/lately/" + that.data.userInfo.account , method: "GET",
            }).then( res=> {
              console.log(res)
              that.data.latelyImageList = []
              for(let i=0 ; i<res.data.data.length ; i++) {
                that.data.latelyImageList.unshift(res.data.data[i])
              }
              // let e = res
              for(let i=0 ; i<res.data.data.length ; i++) {
                that.data.latelyImageList[i].photoUrl = "https://nandu.xyz:9090" + that.data.latelyImageList[i].photoUrl
              }
              console.log(that.data.latelyImageList)
              that.setData({
                latelyImageList: that.data.latelyImageList
              })
              wx.showToast({
                title: '删除成功',
                icon: 'none'
              })
            })
            // 获取全部图片
            request({
              url: "photos/all/" + that.data.userInfo.account, method: "POST",

            }).then( res => {
              console.log(res)
              that.data.materials = []
              for(let i=0 ; i<res.data.data.length ; i++) {
                that.data.materials.unshift(res.data.data[i])
              }
              for(let i=0 ; i<res.data.data.length ; i++) {
                that.data.materials[i].photoUrl = "https://nandu.xyz:9090" + that.data.materials[i].photoUrl
              }
              console.log(that.data.materials)
              that.setData({
                materials: that.data.materials
              })
            })

          })
          
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 预览图片（最近添加的图片）
  previewlatelyImage: function(e) {
    let array = []
    for(let i=0 ; i < this.data.latelyImageList.length ; i++) {
      array.push(this.data.latelyImageList[i].photoUrl)
    }
    console.log(array);
    wx.previewImage({
      current: e.target.dataset.src,
      urls: array
    })
  },
  // 预览图片（全部图片）
  previewAllImage: function(e) {
    let array = []
    for(let i=0 ; i < this.data.materials.length ; i++) {
      array.push(this.data.materials[i].photoUrl)
    }
    console.log(array);
    wx.previewImage({
      current: e.target.dataset.src,
      urls: array
    })
  },
  onClose: function(e) {
    this.setData({
      show: false
    })
  },
  onSelect: function(e) {
    console.log(e)
    this.data.addSelectName = e.detail.name
    this.setData({
      addSelectName: this.data.addSelectName
    })
  },
  onClose2: function(e) {
    this.setData({
      show2: false
    })
  },
  onSelect2: function(e) {
    console.log(e)
    this.data.addSelectName = e.detail.name
    this.setData({
      addSelectName: this.data.addSelectName
    })
    if(this.data.addSelectName !="暂未选择") {
      let that = this
      wx.chooseImage({
        count: 3,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          console.log(res)
          for(let i=0 ; i<res.tempFilePaths.length ; i++) {
            this.data.choosedImgList.push(res.tempFilePaths[i])
          }
          this.data.choosed = res.tempFilePaths.length
          console.log(this.data.choosedImgList)
          if(this.data.choosed == 0) {
            this.data.cancel = false
          } else {
            this.data.cancel = true
          }
          this.setData({
            choosedImgList: this.data.choosedImgList,
            choosed: this.data.choosed,
            cancel: this.data.cancel
          })
          // 上传图片
          // console.log(that.data.array[that.data.index])
          for(let i=0 ; i<that.data.choosedImgList.length ; i++) {
            wx.uploadFile({
              url: 'https://nandu.xyz:9090/photos/add/' + that.data.userInfo.account + "/" + that.data.addSelectName,
              filePath: that.data.choosedImgList[i],
              name: 'file',
              success (res) {
                console.log(res)
                that.data.choosedImgList = []
                that.data.addSelectName = "暂未选择"
                that.setData({
                  choosedImgList: that.data.choosedImgList,
                  addSelectName: that.data.addSelectName
                })
                // 获取最近添加的图片
                request({
                  url: "photos/lately/" + that.data.userInfo.account , method: "GET",
                }).then( res=> {
                  console.log(res)
                  that.data.latelyImageList = []
                  for(let i=0 ; i<res.data.data.length ; i++) {
                    that.data.latelyImageList.unshift(res.data.data[i])
                  }
                  // let e = res
                  for(let i=0 ; i<res.data.data.length ; i++) {
                    that.data.latelyImageList[i].photoUrl = "https://nandu.xyz:9090" + that.data.latelyImageList[i].photoUrl
                  }
                  console.log(that.data.latelyImageList)
                  that.setData({
                    latelyImageList: that.data.latelyImageList
                  })
                })
                // 获取全部图片
                request({
                  url: "photos/all/" + that.data.userInfo.account, method: "POST",

                }).then( res => {
                  console.log(res)
                  that.data.materials = []
                  for(let i=0 ; i<res.data.data.length ; i++) {
                    that.data.materials.unshift(res.data.data[i])
                  }
                  for(let i=0 ; i<res.data.data.length ; i++) {
                    that.data.materials[i].photoUrl = "https://nandu.xyz:9090" + that.data.materials[i].photoUrl
                  }
                  console.log(that.data.materials)
                  that.setData({
                    materials: that.data.materials
                  })
                })

                wx.showToast({
                  title: '添加成功,长按图片可删除',
                  icon: 'none'
                })
              }
            })
          } 
        },
        fail: (res) => {
  
        },
      })
    }
  },
  popup: function(e) {
    this.data.show = true
    this.setData({
      show: this.data.show
    })
  },
  popup3: function(e) {
    this.data.show3 = true
    this.setData({
      show3: this.data.show3
    })
  },
  onSelect3: function(e) {
    let that = this
    console.log(e)
    this.data.allName = e.detail.name
    this.setData({
      allName: this.data.allName
    })
    if(this.data.allName != "暂无数据") {
      switch(this.data.allName) {
        case "思政学习" : {
          // console.log("思政学习")
          request({
            url: "photos/all/" + that.data.allName + "/" + that.data.userInfo.account , method : "POST",
  
          }).then( res => {
            console.log(res)
            this.data.materials = []
            for(let i=0 ; i<res.data.data.length ; i++) {
              this.data.materials.unshift(res.data.data[i])
            }
            for(let i=0 ; i<res.data.data.length ; i++) {
              this.data.materials[i].photoUrl = "https://nandu.xyz:9090" + this.data.materials[i].photoUrl
            }
            console.log(this.data.materials)
            this.setData({
              materials: this.data.materials
            })
          })
        }
        break

        case "技能水平" : {
          // console.log("思政学习")
          request({
            url: "photos/all/" + that.data.allName + "/" + that.data.userInfo.account , method : "POST",
  
          }).then( res => {
            console.log(res)
            this.data.materials = []
            for(let i=0 ; i<res.data.data.length ; i++) {
              this.data.materials.unshift(res.data.data[i])
            }
            for(let i=0 ; i<res.data.data.length ; i++) {
              this.data.materials[i].photoUrl = "https://nandu.xyz:9090" + this.data.materials[i].photoUrl
            }
            console.log(this.data.materials)
            this.setData({
              materials: this.data.materials
            })
          })
        }
        break

        case "文体活动" : {
          // console.log("思政学习")
          request({
            url: "photos/all/" + that.data.allName + "/" + that.data.userInfo.account , method : "POST",
  
          }).then( res => {
            console.log(res)
            this.data.materials = []
            for(let i=0 ; i<res.data.data.length ; i++) {
              this.data.materials.unshift(res.data.data[i])
            }
            for(let i=0 ; i<res.data.data.length ; i++) {
              this.data.materials[i].photoUrl = "https://nandu.xyz:9090" + this.data.materials[i].photoUrl
            }
            console.log(this.data.materials)
            this.setData({
              materials: this.data.materials
            })
          })
        }
        break

        case "双学位" : {
          // console.log("思政学习")
          request({
            url: "photos/all/" + that.data.allName + "/" + that.data.userInfo.account , method : "POST",
  
          }).then( res => {
            console.log(res)
            this.data.materials = []
            for(let i=0 ; i<res.data.data.length ; i++) {
              this.data.materials.unshift(res.data.data[i])
            }
            for(let i=0 ; i<res.data.data.length ; i++) {
              this.data.materials[i].photoUrl = "https://nandu.xyz:9090" + this.data.materials[i].photoUrl
            }
            console.log(this.data.materials)
            this.setData({
              materials: this.data.materials
            })
          })
        }
        break

        case "科创活动" : {
          // console.log("思政学习")
          request({
            url: "photos/all/" + that.data.allName + "/" + that.data.userInfo.account , method : "POST",
  
          }).then( res => {
            console.log(res)
            this.data.materials = []
            for(let i=0 ; i<res.data.data.length ; i++) {
              this.data.materials.unshift(res.data.data[i])
            }
            for(let i=0 ; i<res.data.data.length ; i++) {
              this.data.materials[i].photoUrl = "https://nandu.xyz:9090" + this.data.materials[i].photoUrl
            }
            console.log(this.data.materials)
            this.setData({
              materials: this.data.materials
            })
          })
        }
        break

        case "体育竞赛" : {
          // console.log("思政学习")
          request({
            url: "photos/all/" + that.data.allName + "/" + that.data.userInfo.account , method : "POST",
  
          }).then( res => {
            console.log(res)
            this.data.materials = []
            for(let i=0 ; i<res.data.data.length ; i++) {
              this.data.materials.unshift(res.data.data[i])
            }
            for(let i=0 ; i<res.data.data.length ; i++) {
              this.data.materials[i].photoUrl = "https://nandu.xyz:9090" + this.data.materials[i].photoUrl
            }
            console.log(this.data.materials)
            this.setData({
              materials: this.data.materials
            })
          })
        }
        break

        case "文体活动" : {
          // console.log("思政学习")
          request({
            url: "photos/all/" + that.data.allName + "/" + that.data.userInfo.account , method : "POST",
  
          }).then( res => {
            console.log(res)
            this.data.materials = []
            for(let i=0 ; i<res.data.data.length ; i++) {
              this.data.materials.unshift(res.data.data[i])
            }
            for(let i=0 ; i<res.data.data.length ; i++) {
              this.data.materials[i].photoUrl = "https://nandu.xyz:9090" + this.data.materials[i].photoUrl
            }
            console.log(this.data.materials)
            this.setData({
              materials: this.data.materials
            })
          })
        }
        break

        case "社会实践" : {
          // console.log("思政学习")
          request({
            url: "photos/all/" + that.data.allName + "/" + that.data.userInfo.account , method : "POST",
  
          }).then( res => {
            console.log(res)
            this.data.materials = []
            for(let i=0 ; i<res.data.data.length ; i++) {
              this.data.materials.unshift(res.data.data[i])
            }
            for(let i=0 ; i<res.data.data.length ; i++) {
              this.data.materials[i].photoUrl = "https://nandu.xyz:9090" + this.data.materials[i].photoUrl
            }
            console.log(this.data.materials)
            this.setData({
              materials: this.data.materials
            })
          })
        }
        break

        case "学团评比" : {
          // console.log("思政学习")
          request({
            url: "photos/all/" + that.data.allName + "/" + that.data.userInfo.account , method : "POST",
  
          }).then( res => {
            console.log(res)
            this.data.materials = []
            for(let i=0 ; i<res.data.data.length ; i++) {
              this.data.materials.unshift(res.data.data[i])
            }
            for(let i=0 ; i<res.data.data.length ; i++) {
              this.data.materials[i].photoUrl = "https://nandu.xyz:9090" + this.data.materials[i].photoUrl
            }
            console.log(this.data.materials)
            this.setData({
              materials: this.data.materials
            })
          })
        }
        break

        case "优秀表彰" : {
          // console.log("思政学习")
          request({
            url: "photos/all/" + that.data.allName + "/" + that.data.userInfo.account , method : "POST",
  
          }).then( res => {
            console.log(res)
            this.data.materials = []
            for(let i=0 ; i<res.data.data.length ; i++) {
              this.data.materials.unshift(res.data.data[i])
            }
            for(let i=0 ; i<res.data.data.length ; i++) {
              this.data.materials[i].photoUrl = "https://nandu.xyz:9090" + this.data.materials[i].photoUrl
            }
            console.log(this.data.materials)
            this.setData({
              materials: this.data.materials
            })
          })
        }
        break

        case "全部证明" : {
          // console.log("优秀表彰")
          request({
            url: "photos/all/" + that.data.userInfo.account , method : "POST",
  
          }).then( res => {
            console.log(res)
            this.data.materials = []
            for(let i=0 ; i<res.data.data.length ; i++) {
              this.data.materials.unshift(res.data.data[i])
            }
            for(let i=0 ; i<res.data.data.length ; i++) {
              this.data.materials[i].photoUrl = "https://nandu.xyz:9090" + this.data.materials[i].photoUrl
            }
            console.log(this.data.materials)
            this.setData({
              materials: this.data.materials
            })
          })
        }
        break
      }
    }
  },
  onClose3: function(e) {
    this.setData({
      show3: false
    })
  },
  // 取消上传
  // confirm: function(e) {
  //   wx.uploadFile({
  //     url: 'url',
  //     filePath: 'filePath',
  //     name: 'name',
  //     success (res) {

  //     },
  //     fail (res) {
        
  //     }
  //   })
  // },
  // // 确定上传
  // cancel: function(e) {
  //   this.data.cancel = false
  //   this.data.choosed = 0
  //   this.data.choosedImgList = []
  //   this.setData({
  //     cancel: this.data.cancel,
  //     choosed: this.data.choosed,
  //     choosedImgList: this.data.choosedImgList
  //   })
  //   console.log(this.data.choosedImgList)
  // }
})