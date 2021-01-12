import React, { useState, useEffect, useRef, useCallback } from 'react'
import { CSSTransition } from 'react-transition-group'
import { Container, ImgWrapper,CollectButton, SongListWrapper, BgLayer } from './style'
import Header from '../../baseUI/header'
import Scroll from '../../baseUI/scroll'
import SongsList from '../SongList'
import { HEADER_HEIGHT } from '../../api/config'
import { getSingerInfo, changeEnterLoading } from './store/actionCreators'
import { connect } from 'react-redux'
import Loading from '../../baseUI/loading'
import MusicNote from '../../baseUI/music-note'

function Singer(props) {
  const [showStatus, setShowStatus] = useState(true)

  const collectButton = useRef()
  const imageWrapper = useRef()
  const songScrollWrapper = useRef()
  const songScroll = useRef()
  const header = useRef()
  const layer = useRef()
  const musicNoteRef = useRef()

  //图片初始高度
  const initialHeight = useRef(0)

  const { songsCount } = props

  const {
    artist: immutableArtist,
    songs: immutableSongs,
    loading
  } = props

  const { getSingerDataDispatch } = props

  const artist = immutableArtist.toJS()
  const songs = immutableSongs.toJS()

  useEffect(() => {
    const id = props.match.params.id
    getSingerDataDispatch(id)
  }, [])

  //往上偏移的尺寸，露出圆角
  const OFFSET = 5
  useEffect(() => {
    let h = imageWrapper.current.offsetHeight
    songScrollWrapper.current.style.top = `${h - OFFSET}px`
    initialHeight.current = h
    //把遮罩先放在下面，以裹住歌曲列表
    layer.current.style.top = `${h - OFFSET}px`
    songScroll.current.refresh()
  }, [])

  //传给子组件的方法用useCallback包起来防止不必要的重渲染
  const handleScroll = useCallback(pos => {
    let height = initialHeight.current
    const newY = pos.y
    const imageDOM = imageWrapper.current
    const buttonDOM = collectButton.current
    const headerDOM = header.current
    const layerDOM = layer.current
    const minScrollY = -(height - OFFSET) + HEADER_HEIGHT

    //滑动距离占图片高度的百分比
    const percent = Math.abs(newY / height)

    if (newY > 0) {
      imageDOM.style["transform"] = `scale(${1 + percent})`
      buttonDOM.style["transform"] = `translate3d(0, ${newY}px, 0)`
      layerDOM.style.top = `${height - OFFSET + newY}px`
    } 
    else if (newY >= minScrollY) {
      layerDOM.style.top = `${height - OFFSET - Math.abs(newY)}px`
      //保证遮罩的层叠优先级比图片高，不被图片挡住
      layerDOM.style.zIndex = 1
      imageDOM.style.paddingTop = "75%"
      imageDOM.style.height = 0
      imageDOM.style.zIndex = -1
      //按钮跟着移动且渐渐透明
      buttonDOM.style["transform"] = `translate3d(0, ${newY}px, 0)`
      buttonDOM.style["opacity"] = `${1 - percent * 2}`
    } 
    else if (newY < minScrollY) {
      layerDOM.style.top = `${HEADER_HEIGHT - OFFSET}px`
      layerDOM.style.zIndex = 1
      //防止溢出的歌单内容遮住Header
      headerDOM.style.zIndex = 100
      //此时图片高度与Header一致
      imageDOM.style.height = `${HEADER_HEIGHT}px`
      imageDOM.style.paddingTop = 0
      imageDOM.style.zIndex = 99
    }
  })

  const musicAnimation = (x, y) => {
    musicNoteRef.current.startAnimation({x, y})
  }

  const setShowStatusFalse = useCallback(() => {
    setShowStatus(false)
  }, [])


  // const artist = {
  //   picUrl: "https://p2.music.126.net/W__FCWFiyq0JdPtuLJoZVQ==/109951163765026271.jpg",
  //   name: "薛之谦",
  //   hotSongs: [
  //     {
  //       name: "我好像在哪见过你",
  //       ar: [{name: "薛之谦"}],
  //       al: {
  //         name: "薛之谦专辑"
  //       }
  //     },
  //     {
  //       name: "我好像在哪见过你",
  //       ar: [{name: "薛之谦"}],
  //       al: {
  //         name: "薛之谦专辑"
  //       }
  //     },
  //     {
  //       name: "我好像在哪见过你",
  //       ar: [{name: "薛之谦"}],
  //       al: {
  //         name: "薛之谦专辑"
  //       }
  //     }
  //   ]
  // }

  return (
    <CSSTransition
      in={showStatus}
      timeout={300}
      classNames="fly"
      appear={true}
      unmountOnExit
      onExited = {() => props.history.goBack()}
    >
      <Container props={songsCount}>
        <Header handleClick={setShowStatusFalse} title={artist.name} ref={header}></Header>
        <ImgWrapper ref={imageWrapper} bgUrl={artist.picUrl}>
          <div className="filter"></div>
        </ImgWrapper>
        <CollectButton ref={collectButton}>
          <i className="iconfont">&#xe62d;</i>
          <span className="text">收藏</span>
        </CollectButton>
        <BgLayer ref={layer}></BgLayer>
        <SongListWrapper ref={songScrollWrapper}>
          <Scroll onScroll={handleScroll} ref={songScroll}>
            <SongsList songs={songs} showCollect={false} musicAnimation={musicAnimation}>
            </SongsList>
          </Scroll>
        </SongListWrapper>
        { loading ? <Loading></Loading> : null }
        <MusicNote ref={musicNoteRef}></MusicNote>
      </Container>
    </CSSTransition>
  )
}

const mapStateToProps = state => ({
  artist: state.getIn(['singerInfo', 'artist']),
  songs: state.getIn(['singerInfo', 'songsOfArtist']),
  loading: state.getIn(['singerInfo', 'loading']),
  songsCount: state.getIn(['player', 'playList']).size
})

const mapDispatchToProps = dispatch => {
  return {
    getSingerDataDispatch(id) {
      dispatch(changeEnterLoading(true))
      dispatch(getSingerInfo(id))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Singer))
