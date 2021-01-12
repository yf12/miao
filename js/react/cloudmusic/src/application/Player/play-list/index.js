import React, { useState, useRef, useCallback } from 'react'
import { connect } from 'react-redux'
import { PlayListWrapper, ScrollWrapper } from './style'
import { CSSTransition } from 'react-transition-group'
import { prefixStyle, getName } from '../../../api/utils'
import { changeShowPlayList, changeCurrentIndex, changePlayMode, changePlayList } from '../store/actionCreators'
import { playMode } from '../../../api/config'
import Scroll from '../../../baseUI/scroll'
import { deleteSong } from '../store/actionCreators'

function PlayList(props) {
  const {
    showPlayList,
    currentIndex,
    currentSong: immutableCurrentSong,
    playList: immutablePlayList,
    mode,
    sequencePlayList: immutableSequencePlayList
  } = props
  const {
    togglePlayListDispatch,
    changeCurrentIndexDispatch,
    changeModeDispatch,
    changePlayListDispatch,
    deleteSongDispatch
  } = props

  const currentSong = immutableCurrentSong.toJS()
  const playList = immutablePlayList.toJS()
  const sequencePlayList = immutableSequencePlayList.toJS()
  
  const [isShow, setIsShow] = useState(false)

  const transform = prefixStyle('transform')

  const playListRef = useRef()
  const listWrapperRef = useRef()

  import { playMode } from "./src/api/config"

  const getCurrrent = item => {
    //是不是当前正播放的歌曲
    const current = currentSong.id === item.id
    const className = current ? 'icon-play' : ''
    const content = current ? '&#xe6e3' : ''
    return (
      <i className={`current iconfont ${className}`} dangerouslySetInnerHTML={{__html: content}}></i>
    )
  }

  const getPlayMode = () => {
    let content, text
    if(mode === playMode.sequence) {
      content = '&#xe625;'
      text = '顺序播放'
    }
    if(mode === playMode.loop) {
      content = '&#xe653;'
      text = '单曲循环'
    }
    if(mode === playMode.random) {
      content = '&#xe61b;'
      text = '随机播放'
    }
    return (
      <div>
        <i className="iconfont" onClick={e => changeMode(e)} dangerouslySetInnerHTML={{__html: content}}></i>
        <span className="text" onClick={e => changeMode(e)}>{text}</span>
      </div>
    )
  }

  const changMode = e => {
    let newMode = (mode + 1) % 3
  }

  const handleChangeCurrentIndex = index => {
    if(currentIndex === index) return
    handleCurrentIndexDispatch(index)
  }

  const handleDeleteSong = (e, song) => {
    e.stopPropagation()
    deleteSongDispatch(song)
  }

  const onEnterCB = useCallback(() => {
    //让列表显示
    setIsShow(true)
    //最开始是隐藏在下面
    listWrapperRef.current.style[transform] = `translate3d(0, 100%, 0)`
  }, [transform])

  const onEnteringCB = useCallback(() => {
    //让列表展示
    listWrapperRef.current.style['transition'] = 'all 0.3s'
    listWrapperRef.current.style[transform] = `translate3d(0, 0, 0)`
  }, [transform])

  const onExitingCB = useCallback(() => {
    //让列表展示
    listWrapperRef.current.style['transition'] = 'all 0.3s'
    listWrapperRef.current.style[transform] = `translate3d(0, 100%, 0)`
  }, [transform])
  
  const onExitCB = useCallback(() => {
    setIsShow(false)
    listWrapperRef.current.style[transform] = `translate3d(0, 100%, 0)`
  }, [transform])

  return (
    <CSSTransition
      in={showPlayList}
      timeout={300}
      className="list-fade"
      onEnter={onEnterCB}
      onEntering={onEnteringCB}
      onExiting={onExitingCB}
      onExited={onEnteredCB}   
    >
      <PlayListWrapper
        ref={playListRef}
        style={isShow === true ? {display: 'block'} : {display: 'none'}}
        onClick={() => togglePlayListDispatch(false)}
      >
        <div className="list_wrapper" ref={listWrapperRef} onClick={e => e.stopPropagation()}>
          <ListHeader>
            <h1 className="title">
              { getPlayMode() }
              <span className="iconfont clear" onClick={handleShowClear}>&#xe63d;</span>
            </h1>
          </ListHeader>
          <ScrollWrapper>
            <Scroll>
              <ListContent>
                {
                  playList.map((item, index) => {
                    return (
                      <li className="item" key={item.id} onClick={() => handleChangeCurrentIndex(index)}>
                        {getCurrentIcon(item)}
                        <span className="text">{item.name} - {getName(item.ar)}</span>
                        <span className="like">
                          <i className="iconfont">&#xe601;</i>
                        </span>
                        <span className="delete" onClick={}>
                          <i className="iconfont">&#xe63d;</i>
                        </span>
                      </li>
                    )
                  })
                }
              </ListContent>
            </Scroll>
          </ScrollWrapper>
        </div>
      </PlayListWrapper>
    </CSSTransition>
  )
}

const mapStateToProps = state => {
  return {
    showPlayList: state.getIn(['player', 'showPlayList']),
    currentIndex: state.getIn(['player', 'currentIndex']),
    currentSong: state.getIn(['player', 'currentSong']),
    playList: state.getIn(['player', 'playList']),
    sequencePlayList: state.getIn(['player', 'sequencePlayList']),
    mode: state.getIn(['player', 'mode'])
  }
}

const mapDispatchToProps = dispatch => {
  return {
    togglePlayListDispatch(data) {
      dispatch(changeShowPlayList(data))
    },
    //切歌
    changeCurrentIndexDispatch(data) {
      dispatch(changeCurrentIndex(data))
    },
    //修改当前的播放模式
    changeModeDispatch(data) {
      dispatch(changePlayMode(data))
    },
    //修改当前的歌曲列表
    changePlayListDispatch(data) {
      dispatch(changePlayList(data))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(PlayList))
