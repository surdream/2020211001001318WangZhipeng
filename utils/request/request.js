export const request = (params) => {

  // 定义公共的  URL
  const host = "https://v.powerv.top/";
  var baseUrl = "https://v.powerv.top/";

  return new Promise((resolve, reject) => {
      wx.request({
          ...params,
          url: baseUrl + params.url,
          success: (result) => {
              resolve(result);
          },
          fail: (err) => {
              reject(err);
          }
      });
  })
}