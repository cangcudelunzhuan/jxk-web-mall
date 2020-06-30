import {
  $post,
  // $get
} from '@jxkang/utils';

export default {
  searchList: (reqModel) => $post('/itemSearch/seekList', reqModel),
  getLabel: (reqModel) => $post('/apollo/getLabel', reqModel),
};
