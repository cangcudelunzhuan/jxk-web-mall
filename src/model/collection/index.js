import {
  $post,
  $get,
} from '@jxkang/utils';

export default {
  listCollectInfo: (reqModel) => $get('/listCollectInfo', reqModel),
  batchCancelCollect: (reqModel) => $post('/batchCancelCollect', reqModel),
};
