import React, { useState, useEffect, useRef, memo } from 'react'
import styled from 'styled-components'
import style from '../../assets/global-style'
import Scroll from '../scroll'
import { PropTypes } from 'prop-types'

const List = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
  overflow: hidden;
  >span:first-of-type {
    display: block;
    flex: 0 0 auto;
    color: grey;
    font-size: ${style["font-size-m"]};
    xpadding: 5px 0;
  }
`

const ListItem = styled.span`
  flex: 0 0 auto;
  font-size: ${style["font-size-m"]};
  padding: 5px 5px;
  border-radius: 10px;
  &.selected {
    color: ${style["theme-color"]};
    border: 1px solid ${style["theme-color"]};
    opacity: 0.8;
  }
`

function Horizon(props) {
  const Category = useRef()
  const { list, oldVal, title } = props
  const { handleClick } = props

  //初始化页面内容宽度的逻辑
  useEffect(() => {
    let categoryDOM = Category.current
    let tagELems = categoryDOM.querySelectorAll('span')
    let totalWidth = 0
    Array.from(tagELems).forEach(item => {
      totalWidth += item.offsetWidth
    })
    categoryDOM.style.width = `${totalWidth}px`
  }, [])

  return (
    <Scroll direction={"horizental"}>
      <div ref={Category}>
        <List>
          <span>{title}</span>
          {
            list.map(item => {
              return (
                <ListItem
                  key={item.key}
                  className={oldVal === item.key ? 'selected' : ''}
                  onClick={() => handleClick(item.key)}>
                  {item.name}
                </ListItem>
              )
            })
          }
        </List>
      </div>
    </Scroll>
  )
}

Horizon.defaultProps = {
  list: [],   //接受的列表数据
  oldVal: '',  //当前的item值
  title: '',  //列表左边的标题
  handleClick: null  //点击不同的item执行的方法
}

Horizon.propTypes = {
  list: PropTypes.array,
  oldVal: PropTypes.string,
  title: PropTypes.string,
  handleClick: PropTypes.func
}

export default React.memo(Horizon)
