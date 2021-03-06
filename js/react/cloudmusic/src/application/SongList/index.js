import React from 'react'
import { SongList, SongItem } from './style'
import { getCount, getName } from '../../api/utils'
import { connect } from 'react-redux'
import { changePlayList, changeCurrentIndex, changeSequencePlayList } from '../Player/store/actionCreators'

const SongsList = React.forwardRef((props, refs) => {
  const { collectCount, showCollect, songs } = props
  const { changePlayListDispatch, changeCurrentIndexDispatch,  changeSequencePlayListDispatch } = props
  //接收触发动画的函数
  const { musicAnimation } = props

  const totalCount = songs.length

  const selectItem = (e, index) => {
    console.log(1)
    changePlayListDispatch(songs)
    changeSequencePlayListDispatch(songs)
    changeCurrentIndexDispatch(index)
    musicAnimation(e.nativeEvent.clientX, e.nativeEvent.clientY)
  }

  let songList = list => {
    let res = []
    for(let i = 0; i < list.length; i++) {
      let item = list[i]
      res.push(
        <li key={item.id} onClick={e => selectItem(e, i)}>
          <span className="index">{i + 1}</span>
          <div className="info">
            <span>{item.name}</span>
            <span>
              { item.ar ? getName(item.ar) : getName(item.artists) } - { item.al ? item.al.name : item.album.name }
            </span>
          </div>
        </li>
      )
    }
    return res
  }

  const collect = count => {
    return (
      <div className="add_list">
        <i className="iconfont">&#xe62d;</i>
        <span>收藏({getCount(count)}）</span>
      </div>
    )
  }

  return (
    <SongList ref={refs} showBackground={props.showBackground}>
      <div className="first_line">
        <div className="play_all">
          <i className="iconfont">&#xe62d;</i>
          <span>播放全部<span className="sum">(共{totalCount}首)</span></span>
        </div>
        { showCollect ? collect(collectCount) : null }
      </div>
      <SongItem>
        { songList(songs) }
      </SongItem>
    </SongList>
  )
})

const mapDispatchToProps = dispatch => {
  return {
    changePlayListDispatch (data) {
      dispatch(changePlayList(data))
    },
    changeCurrentIndexDispatch(data) {
      dispatch(changeCurrentIndex(data))
    },
    changeSequencePlayListDispatch(data) {
      dispatch(changeSequencePlayList(data))
    }
  }
}

export default connect(null, mapDispatchToProps)(React.memo(SongsList))
