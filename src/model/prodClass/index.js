import {
  $post,
  // $get
} from '@jxkang/utils';

export default {
  firstCategory: (reqModel) => $post('/category/firstCategory', reqModel),
  secondCategory: (reqModel) => $post('/category/secondCategory', reqModel),
  getItemCategory: (reqModel) => $post('/itemQuery/getItemCategory', reqModel),
};
