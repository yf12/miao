import React, { useRef, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import {
  changeCurrentSong,
  changeFullScreen,
  changePlayingState,
  changePlayList,
  changePlayMode,
  changeCurrentIndex,
  changeShowPlayList
} from './store/actionCreators'
import MiniPlayer from './mini-player'
import NormalPlayer from './normal-player'
import { getSongUrl, isEmptyObject, findIndex, shuffle } from "../../api/utils"
import Toast from '../../baseUI/toast'
import { playMode } from '../../api/config'

function Player(props) {
  // const currentSong = {
  //   al: {picUrl: "https://p1.music.126.net/JL_id1CFwNJpzgrXwemh4Q==/109951164172892390.jpg"},
  //   name: "木偶人",
  //   ar: [{name: "薛之谦"}]
  // }

  const {
    currentSong: immutableCurrentSong,
    fullScreen,
    playing,
    currentIndex,
    playList: immutablePlayList,
    mode,  //模式
    sequencePlayList: immutableSequencePlayList  //顺序列表
  } = props
  const {
    toggleFullScreenDispatch,
    changeCurrentIndexDispatch,
    togglePlayingDispatch,
    changeCurrentDispatch,
    changePlayListDispatch,
    changeModeDispatch,
    togglePlayListDispatch
  } = props
  
  // const playList = [
  //   {
  //     ftype: 0,
  //     djId: 0,
  //     a: null,
  //     cd: '01',
  //     crbt: null,
  //     no: 1,
  //     st: 0,
  //     rt: '',
  //     cf: '',
  //     alia: [
  //       '手游《梦幻花园》苏州园林版推广曲'
  //     ],
  //     rtUrls: [],
  //     fee: 0,
  //     s_id: 0,
  //     copyright: 0,
  //     h: {
  //       br: 320000,
  //       fid: 0,
  //       size: 9400365,
  //       vd: -45814
  //     },
  //     mv: 0,
  //     al: {
  //       id: 84991301,
  //       name: '拾梦纪',
  //       picUrl: 'http://p1.music.126.net/M19SOoRMkcHmJvmGflXjXQ==/109951164627180052.jpg',
  //       tns: [],
  //       pic_str: '109951164627180052',
  //       pic: 109951164627180050
  //     },
  //     name: '拾梦纪',
  //     l: {
  //       br: 128000,
  //       fid: 0,
  //       size: 3760173,
  //       vd: -41672
  //     },
  //     rtype: 0,
  //     m: {
  //       br: 192000,
  //       fid: 0,
  //       size: 5640237,
  //       vd: -43277
  //     },
  //     cp: 1416668,
  //     mark: 0,
  //     rtUrl: null,
  //     mst: 9,
  //     dt: 234947,
  //     ar: [
  //       {
  //         id: 12084589,
  //         name: '妖扬',
  //         tns: [],
  //         alias: []
  //       },
  //       {
  //         id: 12578371,
  //         name: '金天',
  //         tns: [],
  //         alias: []
  //       }
  //     ],
  //     pop: 5,
  //     pst: 0,
  //     t: 0,
  //     v: 3,
  //     id: 1416767593,
  //     publishTime: 0,
  //     rurl: null
  //   }
  // ];

  const currentSong = immutableCurrentSong.toJS()
  const playList = immutablePlayList.toJS()
  const sequencePlayList = immutableSequencePlayList.toJS()

  //目前播放事件
  const [currentTime, setCurrentTime] = useState(0)
  //歌曲总时长
  const [duration, setDuration] = useState(0)

  //记录当前的歌曲，以便于下次重渲染对比是否是一首歌
  const [preSong, setPreSong] = useState({})

  const [modeText, setModeText] = useState('')

  //歌曲播放进度
  let percent = isNaN(currentTime / duration) ? 0 : currentTime / duration

  const songReady = useRef(true)
  const audioRef = useRef()
  const toastRef = useRef()

  useEffect(() => {
    changeCurrentIndexDispatch(0)
  }, [])

  // useEffect(() => {
  //   if (
  //     !playList.length ||
  //     currentIndex === -1 ||
  //     !playList[currentIndex].id ||
  //     playList[currentIndex].id === preSong.id ||
  //     !songReady  //标志位为false
  //   )
  //     return
  //   let current = playList[currentIndex]
  //   setPreSong(current)
  //   setSongReady(false)  //把现在的标志位设为false，表示新的资源没有缓冲完成，不能切歌
  //   changeCurrentDispatch(current)  //赋值currentSong
  //   audioRef.current.srv = getSongUrl(current.id)
  //   setTimeout(() => {
  //     //play方法返回的是一个promise对象
  //     audioRef.current.play().then(() => {
  //       setSongReady(true)
  //     })
  //   }) 
  //   togglePlayingDispatch(true)  //播放状态
  //   setCurrentTIme(0)  //从头开始播放
  //   setDuration((current.dt / 1000) | 0)  //时长
  // }, [playList, currentIndex])

  useEffect(() => {
    if (
      !playList.length ||
      currentIndex === -1 ||
      !playList[currentIndex].id ||
      playList[currentIndex].id === preSong.id
    )
    return
    let current = playList[currentIndex]
    changeCurrentDispatch(current)  //赋值currentSong
    setPreSong(current)
    audioRef.current.src = getSongUrl(current.id)
    setTimeout(() => {
      audioRef.current.play()
    })
    togglePlayingDispatch(true)  //播放状态
    setCurrentTime(0)  //从头开始播放
    setDuration((current.dt / 1000) | 0)  //时长
  }, [playList, currentIndex])

  useEffect(() => {
    playing ? audioRef.current.play() : audioRef.current.pause()
  }, [playing])

  const clickPlaying = (e, state) => {
    e.stopPropagation()
    togglePlayingDispatch(state)
  }

  const handleError = () => {
    songReady.current = true
    alert("播放出错")
  }

  const updateTime = e => {
    setCurrentTime(e.target.currentTime)
  }

  const onProgressChange = curPercent => {
    const newTime = curPercent * duration
    setCurrentTime(newTime)
    audioRef.current.currentTime = newTime
    // if(!playing) {
    //   togglePlayingDispatch(true)
    // }
  }

  //一首歌循环
  const handleLoop = () => {
    audioRef.current.currentTime = 0
    changePlayingState(true)
    audioRef.current.play()
  }

  //前一首
  const handlePrev = () => {
    //播放列表只有一首歌时单曲循环
    if (playList.length === 1) {
      handleLoop()
      return
    }
    let index = currentIndex - 1
    if (index < 0) {
      index = playList.length - 1
    }
    if (!playing) {
      togglePlayingDispatch(true)
    }
    changeCurrentIndexDispatch(index)
  }

  //后一首
  const handleNext = () => {
    //播放列表只有一首歌时单曲循环
    if (playList.length === 1) {
      handleLoop()
      return
    }
    let index = currentIndex + 1
    if (index === playList.length) {
      index = 0
    }
    if (!playing) {
      togglePlayingDispatch(true)
    }
    changeCurrentIndexDispatch(index)
  }

  const changeMode = () => {
    let newMode = (mode + 1) % 3  //点击所以+1
    if(newMode === 0) {
      //顺序模式
      changePlayListDispatch(sequencePlayList)
      let index = findIndex(currentSong, sequencePlayList)
      changeCurrentIndexDispatch(index)
      setModeText('顺序模式')
    } else if (newMode === 1) {
      //单曲循环
      changePlayListDispatch(sequencePlayList)
      setModeText('单曲循环')
    } else if (newMode === 2) {
      //随机播放
      let newList = shuffle(sequencePlayList)
      let index = findIndex(currentSong, newList)
      changePlayListDispatch(newList)
      changeCurrentIndexDispatch(index)
      setModeText('随机播放')
    }
    changeModeDispatch(newMode)
    toastRef.current.show()
  }

  const handleEnd = () => {
    if(mode === playMode.loop) {
      handleLoop()
    } else {
      handleNext()
    }
  }

  return (
    <div>
      {
        isEmptyObject(currentSong) ? null :
        <MiniPlayer
          song={currentSong}
          full={fullScreen}
          playing={playing}
          setFullScreen={toggleFullScreenDispatch}
          clickPlaying={clickPlaying}
          percent={percent}
          togglePlayList={togglePlayListDispatch}
        />
      }
      {
        isEmptyObject(currentSong) ? null :
        <NormalPlayer
          song={currentSong}
          fullScreen={fullScreen}
          playing={playing}
          duration={duration}  //总时长
          currentTime={currentTime}  //播放时间
          percent={percent}  //进度
          toggleFullScreen={toggleFullScreenDispatch}
          clickPlaying={clickPlaying}
          onProgressChange={onProgressChange}
          handlePrev={handlePrev}
          handleNext={handleNext}
          mode={mode}
          changeMode={changeMode}
          modeText={modeText}
          togglePlayList={togglePlayListDispatch}
        >
        </NormalPlayer>
      }
      <audio
        ref={audioRef}
        onTimeUpdate={updateTime}
        onError={handleError}
        onEnded={handleEnd}
      ></audio>
      <Toast text={modeText} ref={toastRef}></Toast>
    </div>
  )
}

const mapStateToProps = state => ({
  fullScreen: state.getIn(['player', 'fullScreen']),
  playing: state.getIn(['player', 'playing']),
  sequencePlayList: state.getIn(['player', 'sequencePlayList']),
  playList: state.getIn(['player', 'playList']),
  mode: state.getIn(['player', 'mode']),
  currentIndex: state.getIn(['player', 'currentIndex']),
  showPlayingList: state.getIn(['player', 'showPlayingList']),
  currentSong: state.getIn(['player', 'currentSong'])
})

const mapDispatchToProps = dispatch => {
  return {
    togglePlayingDispatch(data) {
      dispatch(changePlayingState(data))
    },
    toggleFullScreenDispatch(data) {
      dispatch(changeFullScreen(data))
    },
    togglePlayListDispatch(data) {
      dispatch(changeShowPlayList(data))
    },
    changeCurrentIndexDispatch(index) {
      dispatch(changeCurrentIndex(index))
    },
    changeCurrentDispatch(data) {
      dispatch(changeCurrentSong(data))
    },
    changeModeDispatch(data) {
      dispatch(changePlayMode(data))
    },
    changePlayListDispatch(data) {
      dispatch(changePlayList(data))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Player))
