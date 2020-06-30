import { $post, $get } from '@jxkang/utils';

export default {
  getCategory: (reqModel) => $post('/category/getCategory', reqModel),
  getApolloInfo: (reqModel) => $post('/apollo/getApolloInfo', reqModel),
  getActivityDetail: (reqModel) => $post('/activityQuery/getActivityDetail', reqModel),
  getRegisterActivityCount: (reqModel) => $get('/getRegisterActivityCount', reqModel),
  registerActivity: (reqModel) => $post('/registerActivity', reqModel),
  addOrCancelCollect: (reqModel) => $post('/addOrCancelCollect', reqModel),
  getAllActivityDetail: (reqModel) => $post('/activityQuery/getAllActivityDetail', reqModel),
  getApolloBanner: (reqModel) => $post('/apollo/getApolloBanner', reqModel),
  getMarkeBanner: (reqModel) => $post('/apollo/getMarkeBanner', reqModel),
};
