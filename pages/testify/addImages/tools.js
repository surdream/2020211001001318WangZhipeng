export const request = (params) => {

  // 定义公共的  URL
  const host = "https://nandu.xyz:9090/";
  var baseUrl = "https://nandu.xyz:9090/";

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