import React, { useState, useEffect } from 'react'
import Horizon from '../../baseUI/horizen-item'
import { categoryTypes, alphaTypes } from '../../api/config'
import { NavContainer, ListContainer, List, ListItem, EnterLoading } from './style'
import Scroll from '../../baseUI/scroll'
import {
  getSingerList,
  refreshMoreSingerList,
  getHotSingerList,
  refreshMoreHotSingerList,
  changePageCount,
  changeEnterLoading,
  changePullUpLoading,
  changePullDownLoading
} from './store/actionCreators'
import { connect } from 'react-redux'
import Loading from '../../baseUI/loading'
import LazyLoad, { forceCheck, lazyload } from 'react-lazyload'
import { toJS } from 'immutable' 
import { renderRoutes }  from 'react-router-config'

function Singers(props) {
  let [category, setCategory] = useState('')
  let [alpha, setAlpha] = useState('')

  const { singerList, enterLoading, pullUpLoading, pullDownLoading, pageCount } = props
  const { getHotSingerDispatch, updateDispatch, pullUpRefreshDispatch, pullDownRefreshDispatch } = props

  const { songsCount } = props

  useEffect(() => {
    if(!singerList.size && !category && !alpha) {
      getHotSingerDispatch()
    }
  }, [])

  const enterDetail = id => {
    props.history.push(`/singers/${id}`)
  }

  const handlePullUp = () => {
    pullUpRefreshDispatch(category, alpha, category === '', pageCount)
  }

  const handlePullDown = () => {
    pullDownRefreshDispatch(category, alpha)
  }

  let handleUpdateAlpha = val => {
    setAlpha(val)
    updateDispatch(category, val)
  }
  let handleUpdateCategory = val => {
    setCategory(val)
    updateDispatch(val, alpha)
  }

  // //歌手列表的mock数据
  // const singerList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(item => {
  //   return {
  //     picUrl: 'https://p2.music.126.net/uTwOm8AEFFX_BYHvfvFcmQ==/109951164232057952.jpg',
  //     name: '隔壁老樊',
  //     accountId: 277313426
  //   }
  // })

  //渲染函数，返回歌手列表
  const renderSingerList = () => {
    return (
      <List>
        {
          singerList.toJS().map((item, index) => {
            return (
              <ListItem key={item.accountId + '' + index} onClick={() => enterDetail(item.id)}>
                <div className="imgWrapper">
                  <LazyLoad placeholder={<img width="100%" height="100%" src={require('./singer.png')} alt="music" />}>
                  <img src={item.picUrl + "?param=300x300"} width="100%" height="100%" alt="music" />
                  </LazyLoad>
                </div>
                <span className="name">{item.name}</span>
              </ListItem>
            )
          })
        }
      </List>
    )
  }
  return (
    <div>
      <NavContainer>
        <Horizon
          list={categoryTypes}
          title={"分类(默认热门):"}
          handleClick={val => handleUpdateCategory(val)}
          oldVal={category}>  
        </Horizon>
        <Horizon
          list={alphaTypes}
          title={"首字母:"}
          handleClick={val => handleUpdateAlpha(val)}
          oldVal={alpha}>   
        </Horizon>
      </NavContainer>
      <ListContainer play={songsCount}>
        { enterLoading ? <EnterLoading><Loading></Loading></EnterLoading> : null }
        <Scroll
          onScroll = { forceCheck }
          pullUp = { handlePullUp }
          pullDown = { handlePullDown }
          pullUpLoading = { pullUpLoading }
          pullDownLoading = { pullDownLoading }
        >
        { renderSingerList() }
        </Scroll>
      </ListContainer>
      { renderRoutes(props.route.routes) }
    </div>
  )
}

const mapStateToProps = state => ({
  singerList: state.getIn(['singers', 'singerList']),
  enterLoading: state.getIn(['singers', 'enterLoading']),    //控制进场Loading
  pullUpLoading: state.getIn(['singers', 'pullUpLoading']),   //控制上拉加载动画
  pullDownLoading: state.getIn(['singers', 'pullDownLoading']),   //控制下拉加载动画
  pageCount: state.getIn(['singers', 'pageCount']),
  songsCount: state.getIn(['player', 'playList']).size
})

const mapDispatchToProps = dispatch => ({
  getHotSingerDispatch() {
    dispatch(getHotSingerList())
  },
  updateDispatch(category, alpha) {
    dispatch(changePageCount(0))  //改变了分类因此pageCount清零
    dispatch(changeEnterLoading(true))
    dispatch(getSingerList(category, alpha))
  },

  //滑到最底部刷新部分的处理
  pullUpRefreshDispatch(category, alpha, hot, count) {
    dispatch(changePullUpLoading(true))
    dispatch(changePageCount(count + 1))
    if(hot) {
      dispatch(refreshMoreHotSingerList())
    } else {
      dispatch(refreshMoreSingerList(category, alpha))
    }
  },

  //顶部下拉刷新
  pullDownRefreshDispatch(category, alpha) {
    dispatch(changePullDownLoading(true))
    dispatch(changePageCount(0))
    if(category === '' && alpha === '') {
      dispatch(getHotSingerList())
    } else{
      dispatch(getSingerList(category, alpha))
    }
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Singers)
