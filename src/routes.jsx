import React from 'react';
import { Result, ConfigProvider } from 'antd';
import ZHCN from 'antd/es/locale/zh_CN';
import { BrowserRouter, Route, Switch, Link } from 'dva/router';
import routerConf from './router';

const Routers = (
  <ConfigProvider locale={ZHCN}>
    <BrowserRouter>
      <Switch>
        {
          routerConf.map((v, i) => <Route key={i} path={v.url} exact={v.exact} component={v.component} />)
        }
        <Route component={() => <Result status="404" title="404 Not Found" subTitle="未找到相关服务" extra={<Link to="/home">回到首页</Link>} />} />
      </Switch>
    </BrowserRouter>
  </ConfigProvider>
);

export default Routers;
