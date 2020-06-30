import { $ajax, Common } from '@jxkang/utils';
import ErrCode from '@/config/err-code';
import Config from '@/config';
import home from './home';
import collection from './collection';
import search from './search';
import prodClass from './prodClass';
import detail from './detail';
import purchase from './purchase';

// 接口host配置
if (Config.getEnv() === 'production') { // 正式环境
  $ajax.setBaseUrl('https://api.jingxiaokang.com/webServer');
} else if (Config.getEnv() === 'pre') { // 预发环境
  $ajax.setBaseUrl('https://pre-api.jingxiaokang.com/webServer');
} else if (Config.getEnv() === 'test') { // 测试环境
  $ajax.setBaseUrl('https://daily-api.jdxiaokang.com/webServer');
} else { // 开发环境
  $ajax.setBaseUrl('https://dev-api.jingxiaokang.com/webServer');
}

$ajax.injectHeaders({
  jdxiaokang_client: 'purchase-pc',
  token: Common.getCookie(globalThis.webConfig.fetchTokenName),
});

// 注入全局方法
$ajax.injectResponse((resModel) => {
  if (resModel && ErrCode.find((v) => v === `${resModel.responseCode}`)) {
    location.href = `//${location.host.replace('www', 'b')}/login`;
  }
});

export default {
  home,
  collection,
  search,
  prodClass,
  detail,
  purchase,
};
