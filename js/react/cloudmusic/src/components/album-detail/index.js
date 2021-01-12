import React from 'react'
import { TopDesc, Menu, SongList, SongItem } from './style'
import { getCount, getName } from '../../api/utils'

function AlbumDetail(props) {
  const { currentAlbum } = props

  const renderTopDesc = () => {
    return (
      <TopDesc background={currentAlbum.coverImgUrl}>
        <div className="background">
          <div className="filter"></div>
        </div>
        <div className="img_wrapper">
          <div className="decorate"></div>
          <img src={currentAlbum.coverImgUrl} alt="" />
          <div className="play_count">
            <i className="iconfont play">&#xe885;</i>
            <span className="count">{Math.floor(currentAlbum.subscribedCount/1000)/10}万</span>
          </div>
        </div>
        <div className="desc_wrapper">
          <div className="title">{currentAlbum.name}</div>
          <div className="person">
            <div className="avatar">
              <img src={currentAlbum.creator.avatarUrl} alt=""/>
            </div>
            <div className="name">{currentAlbum.creator.nickname}</div>
          </div>
        </div>
      </TopDesc>
    )
  }

  const renderMenu = () => {
    return (
      <Menu>
        <div>
          <i className="iconfont">&#xe6ad;</i>
          评论
        </div>
        <div>
          <i className="iconfont">&#xe6ad;</i>
          点赞
        </div>
        <div>
          <i className="iconfont">&#xe6ad;</i>
          收藏
        </div>
        <div>
          <i className="iconfont">&#xe6ad;</i>
          更多
        </div>
      </Menu>
    )
  }

  const renderSongList = () => {
    return (
      <SongList>
        <div className="first_line">
          <div className="play_all">
            <i className="iconfont">&#xe62d;</i>
            <span>播放全部<span className="sum">(共{currentAlbum.tracks.length}首)</span></span>
          </div>
          <div className="add_list">
            <i className="iconfont">&#xe62d;</i>
            <span>收藏（{getCount(currentAlbum.subscribedCount)}）</span>
          </div>
        </div>
        <SongItem>
          {
            currentAlbum.tracks.map((item, index) => {
              return (
                <li key={index}>
                  <span className="index">{index + 1}</span>
                  <div className="info">
                    <span>{item.name}</span>
                    <span>
                      { getName(item.ar) } - { item.al.name }
                    </span>
                  </div>
                </li>
              )
            })
          }
        </SongItem>
      </SongList>
    )
  }

  return (
    <div>
      { renderTopDesc() }
      { renderMenu() }
      { renderSongList() }
    </div>
  )
}

export default React.memo(AlbumDetail)
