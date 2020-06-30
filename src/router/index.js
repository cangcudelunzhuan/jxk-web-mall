import { loadRouter } from '@/utils';

const routerConf = [
  { // 商城首页
    url: '/',
    exact: true,
    component: loadRouter(() => import('@/pages/index')),
  }, { // 详情
    url: '/detail/:activityType/:itemId/:activityId',
    component: loadRouter(() => import('@/pages/detail')),
  }, { // 收藏
    url: '/collection',
    component: loadRouter(() => import('@/pages/collection')),
  }, { // 商品类目
    url: '/prodClass/:page/:queryType/:categoryList',
    component: loadRouter(() => import('@/pages/prodClass')),
  }, { // 搜索结果
    url: '/searchResult/:page/:queryType/:labelType/:key',
    component: loadRouter(() => import('@/pages/search-ret')),
  }, { // 限时秒杀
    url: '/seckill/:configId/:EndTime',
    component: loadRouter(() => import('@/pages/seckill')),
  }, { // 我的采购日历
    url: '/purchase',
    component: loadRouter(() => import('@/pages/purchase')),
  }, { // 商品预告强
    url: '/advance/:configId/:activityType',
    component: loadRouter(() => import('@/pages/advance')),
  }, { // 专题页样式
    url: '/subject/:configId/:activityType',
    component: loadRouter(() => import('@/pages/subject')),
  },
];

export default routerConf;
