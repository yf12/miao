import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { getRankList } from './store'
import { filterIndex } from '../../api/utils'
import { SongList, List, ListItem, Container } from './style'
import { renderRoutes } from 'react-router-config'
import Scroll from '../../baseUI/scroll'
import Loading from '../../baseUI/loading'
import { EnterLoading } from '../Singers/style'

function Rank(props) {
  const { rankList: list, loading } = props
  const { getRankListDataDispatch } = props

  const { songsCount } = props

  let rankList = list ? list.toJS() : []

  useEffect(() => {
    if(!rankList.length) {
      getRankListDataDispatch()
    }
  }, [])

  const enterDetail = item => {
    props.history.push(`rank/${item.id}`)
  }

  const renderSongList = list => {
    return list.length ? (
      <SongList>
        {
          list.map((item, index) => {
            return <li>{index + 1}. {item.first} - {item.second}</li>
          })
        }
      </SongList>
    ) : null
  }

  //渲染榜单列表函数，global变量区分不同的布局方式
  const renderRankList = (list, global) => {
    return (
      <List globalRank={global}>
        {
          list.map((item, index) => {
            return (
              <ListItem key={`${item.coverImgId}${index}`} tracks={item.tracks} onClick={() => enterDetail(item)}>
                <div className="img_wrapper">
                  <img src={item.coverImgUrl} alt="" />
                  <div className="decorate"></div>
                  <span className="update_frequency">{item.updateFrequency}</span>
                </div>
                {renderSongList(item.tracks)}
              </ListItem>
            )
          })
        }
      </List>
    )
  }

  let globalStartIndex = filterIndex(rankList)
  let officialList = rankList.slice(0, globalStartIndex)
  let globalList = rankList.slice(globalStartIndex)
  let displayStyle = loading ? {"display": "none"} : {"display": ""}

  return (
    <Container play={songsCount}>
      <Scroll>
        <div>
          <h1 className="official" style={displayStyle}>官方榜</h1>
          { renderRankList(officialList) }
          <h1 className="global" style={displayStyle}>官方榜</h1>
          { renderRankList(globalList, true) }
          { loading ? <EnterLoading><Loading></Loading></EnterLoading> : null }  
        </div>
      </Scroll>
      { renderRoutes(props.route.routes) }
    </Container>
  )
}

//映射Redux全局的state到组件的props上
const mapStateToProps = state => ({
  rankList: state.getIn(['rank', 'rankList']),
  loading: state.getIn(['rank', 'loading']),
  songsCount: state.getIn(['player', 'playList']).size
})

//映射dispatch到props上
const mapDispatchToProps = dispatch => {
  return {
    getRankListDataDispatch() {
      dispatch(getRankList())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Rank))
