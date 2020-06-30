import {
  $post,
  // $get,
} from '@jxkang/utils';

export default {
  userPlan: (reqModel) => $post('/user/userPlan', reqModel),
};
