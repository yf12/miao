import React from 'react'
import {renderRoutes} from 'react-router-config'
import {Top, Tab, TabItem} from './style'
import Player from '../Player'

function Home(props) {
  const {route} = props

  return (
    <div>
      <Top>
        <span className="iconfont menu">&#xe63d;</span>
        <span className="title">title</span>
        <span className="iconfont search">&#xe61e;</span>
      </Top>
      <Tab>
        <a className="selected"><TabItem><span>推荐</span></TabItem></a>
        <a><TabItem><span>歌手</span></TabItem></a>
        <a><TabItem><span>排行榜</span></TabItem></a>
      </Tab>
      {renderRoutes(route.routes)}
      <Player></Player>
    </div>
  )
}

export default React.memo(Home)
