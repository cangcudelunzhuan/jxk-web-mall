import {
  $post,
  $ajax,
  // $get
} from '@jxkang/utils';

export default {
  getItemDetail: (reqModel) => $post('/itemQuery/getItemDetail', reqModel),
  getSupplierHot: (reqModel) => $post('/itemQuery/getSupplierHot', reqModel),
  getSupplierNew: (reqModel) => $post('/itemQuery/getSupplierNew', reqModel),
  insertPlan: (reqModel) => $post('/user/insertPlan', reqModel),
  placeOrder: (reqModel) => $post('/itemOrder/placeOrder', reqModel),
  // 获取行政区划
  getAreaList: (reqModel) => {
    const baseUrl = $ajax.getBaseUrl().replace('/webServer', '');
    return $post(`${baseUrl}/productservice/sys/getAreaList`, reqModel);
  },
};
