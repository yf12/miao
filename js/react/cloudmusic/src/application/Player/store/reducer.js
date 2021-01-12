import * as actionTypes from './constants'
import { fromJS } from 'immutable'
import { playMode } from '../../../api/config'

const defaultState = fromJS({
  fullScreen: false,  //全屏
  playing: false,  //当前歌曲是否播放
  sequencePlayList: [],  //顺序列表
  playList: [],  //播放列表
  mode: playMode.sequence,  //播放模式
  currentIndex: -1,  //当前歌曲在播放列表的索引位置
  showPlayingList: false,  //是否展示播放列表
  currentSong: {
    al: {picUrl: "https://p1.music.126.net/JL_id1CFwNJpzgrXwemh4Q==/109951164172892390.jpg"},
    name: "木偶人",
    ar: [{name: "薛之谦"}]
  }
})

export default (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.SET_CURRENT_SONG:
      return state.set('currentSong', action.data)
    case actionTypes.SET_FULL_SCREEN:
      return state.set('fullScreen', action.data)
    case actionTypes.SET_PLAYING_STATE:
      return state.set('playing', action.data)
    case actionTypes.SET_SEQUENCE_PLAYLIST:
      return state.set('sequencePlayList', action.data)
    case actionTypes.SET_PLAYLIST:
      return state.set('playList', action.data)
    case actionTypes.SET_PLAY_MODE:
      return state.set('mode', action.data)
    case actionTypes.SET_CURRENT_INDEX:
      return state.set('currentIndex', action.data)
    case actionTypes.SET_SHOW_PLAYLIST:
      return state.set('showPlayingList', action.data)
    default:
      return state
  }
}
