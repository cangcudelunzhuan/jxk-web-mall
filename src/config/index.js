// 获取环境变量
const getEnv = () => {
  const envValue = process.projectConfig.env || 4;
  return ({
    // 生产环境
    1: 'production',
    // 预发环境
    2: 'pre', // staging
    // 测试环境
    3: 'test',
    // 开发环境
    4: 'development',
  })[envValue];
};

export default {
  getEnv,
  // 图片访问域名
  imgHost: 'production,pre'.indexOf(getEnv()) > -1 ? 'https://jxkcdn.jingxiaokang.com' : 'https://test-static.jdxiaokang.com',
  // 文件下载域名
  downImgHost: 'https://public-jingxiaokang.oss-accelerate.aliyuncs.com',
  dowmImgUrl: 'https://web-service.jingxiaokang.com/common/download',
};
