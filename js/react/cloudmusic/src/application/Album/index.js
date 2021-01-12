import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Container, TopDesc, Menu, SongList, SongItem } from './style'
import { CSSTransition } from 'react-transition-group'
import Header from '../../baseUI/header'
import Scroll from '../../baseUI/scroll'
import { getCount, getName, isEmptyObject } from '../../api/utils'
import style from '../../assets/global-style'
import { connect } from 'react-redux'
import { getAlbumList, changeEnterLoading } from './store/actionCreators'
import Loading from '../../baseUI/loading'
import AlbumDetail from '../../components/album-detail'
import MusicNote from '../../baseUI/music-note'

export const HEADER_HEIGHT = 45

function Album(props) {
  const [showStatus, setShowStatus] = useState(true)
  const [title, setTitle] = useState("歌单")
  const [isMarquee,setIsMarquee] = useState(false)

  const { songsCount } = props

  const headerEl = useRef()

  const musicNoteRef = useRef()

  const id = props.match.params.id

  const { currentAlbum: currentAlbumImmutable, enterLoading } = props
  const { getAlbumDataDispatch } = props

  let currentAlbum = currentAlbumImmutable.toJS()

  useEffect(() => {
    getAlbumDataDispatch(id)
  }, [getAlbumDataDispatch, id])   //为什么有getAlbumDataDispatch
 
  const handleScroll = pos => {
    let minScrollY = -HEADER_HEIGHT
    let percent = Math.abs(pos.y / minScrollY)
    let headerDom = headerEl.current
    if(pos.y < minScrollY) {
      headerDom.style.backgroundColor = style["theme-color"];
      headerDom.style.opacity = Math.min(1, (percent -1) / 2)
      setTitle(currentAlbum.name)
      setIsMarquee(true)
    } else {
      headerDom.style.backgroundColor = ''
      headerDom.style.opacity = 1
      setTitle("歌单")
      setIsMarquee(false)
    }
  }

  const musicAnimation = (x, y) => {
    musicNoteRef.current.startAnimation({x, y})
  }

  //mock数据
  // const currentAlbum = {
  //   creator: {
  //     avatarUrl: "http://p1.music.126.net/O9zV6jeawR43pfiK2JaVSw==/109951164232128905.jpg",
  //     nickname: "浪里推舟",
  //   },
  //   coverImgUrl: "http://p2.music.126.net/ecpXnH13-0QWpWQmqlR0gw==/109951164354856816.jpg",
  //   subscribedCount: 2010711,
  //   name: "听完就睡，耳机是天黑以后柔软的梦境",
  //   tracks: [
  //     {
  //       name: "我真的受伤了",
  //       ar: [{name: "张学友"}, {name: "周华健"}],
  //       al: {name: "学友 热"}
  //     },
  //     {
  //       name: "我真的受伤了",
  //       ar: [{name: "张学友"}, {name: "周华健"}],
  //       al: {name: "学友 热"}
  //     },
  //     {
  //       name: "我真的受伤了",
  //       ar: [{name: "张学友"}, {name: "周华健"}],
  //       al: {name: "学友 热"}
  //     },
  //     {
  //       name: "我真的受伤了",
  //       ar: [{name: "张学友"}, {name: "周华健"}],
  //       al: {name: "学友 热"}
  //     }, 
  //     {
  //       name: "我真的受伤了",
  //       ar: [{name: "张学友"}, {name: "周华健"}],
  //       al: {name: "学友 热"}
  //     },
  //     {
  //       name: "我真的受伤了",
  //       ar: [{name: "张学友"}, {name: "周华健"}],
  //       al: {name: "学友 热"}
  //     },
  //     {
  //       name: "我真的受伤了",
  //       ar: [{name: "张学友"}, {name: "周华健"}],
  //       al: {name: "学友 热"}
  //     },
  //     {
  //       name: "我真的受伤了",
  //       ar: [{name: "张学友"}, {name: "周华健"}],
  //       al: {name: "学友 热"}
  //     },
  //     {
  //       name: "我真的受伤了",
  //       ar: [{name: "张学友"}, {name: "周华健"}],
  //       al: {name: "学友 热"}
  //     },
  //     {
  //       name: "我真的受伤了",
  //       ar: [{name: "张学友"}, {name: "周华健"}],
  //       al: {name: "学友 热"}
  //     }
  //   ]
  // }

  const handleBack = () => {
    setShowStatus(false)
  }

  return (
    <CSSTransition
      in={showStatus}
      timeout={300}
      classNames="fly"
      appear={true}
      unmountOnExit
      onExited={props.history.goBack}
    >
      <Container play={songsCount}>
        <Header ref={headerEl} title={title} handleClick={handleBack} isMarquee={isMarquee}></Header>
        {
          !isEmptyObject(currentAlbum) ? (
            <Scroll bounceTop={false} onScroll={handleScroll}>       
              <AlbumDetail currentAlbum={currentAlbum} musicAnimation={musicAnimation}></AlbumDetail>
            </Scroll>
          ) : null 
        }
        { enterLoading ? <Loading></Loading> : null }
        <MusicNote ref={musicNoteRef}></MusicNote>
      </Container>
    </CSSTransition>
  )
}

const mapStateToProps = state => ({
  currentAlbum: state.getIn(['album', 'currentAlbum']),
  enterLoading: state.getIn(['album', 'enterLoading']),
  songsCount: state.getIn(['player', 'playList']).size
})

const mapDispatchToProps = dispatch => {
  return {
    getAlbumDataDispatch(id) {
      dispatch(changeEnterLoading(true))
      dispatch(getAlbumList(id))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Album))
