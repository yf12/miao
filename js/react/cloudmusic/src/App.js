import React from 'react';
import { Provider } from 'react-redux'
import store from './store'
import { GlobalStyle } from './style'
import { IconStyle } from './assets/iconfont/iconfont'
import { HashRouter } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'   //renderRoutes只能渲染一层路由
import routes from './routes'   //导入路由配置

function App() {
  return (
    <Provider store={store}>
      <HashRouter>
        <GlobalStyle></GlobalStyle>
        <IconStyle></IconStyle>
        {renderRoutes(routes)}
      </HashRouter>
    </Provider>
  );
}

export default App;
