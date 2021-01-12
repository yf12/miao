import React, {forwardRef, useState, useEffect, useRef, useImperativeHandle, useMemo} from 'react'
import PropTypes from 'prop-types'
import BScroll from 'better-scroll'
import styled from 'styled-components'
import Loading from '../loading'
import Loading2 from '../loading-v2'
import { debounce } from '../../api/utils'

const ScrollContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`

const PullUpLoading = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 5px;
  width: 60px;
  height: 60px;
  margin: auto;
  z-index: 100;
`

export const PullDownLoading = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 30px;
  margin: auto;
  z-index: 100;
`

const Scroll = forwardRef((props, ref) => {
  const [bScroll, setBScroll] = useState()
  const scrollContainerRef = useRef()
  const { direction, click, refresh, pullUpLoading, pullDownLoading, bounceTop, bounceBottom } = props
  const { onScroll, pullUp, pullDown } = props

  let pullUpDebounce = useMemo(() => {
    return debounce(pullUp, 300)
  }, [pullUp])
  
  let pullDownDebounce = useMemo(() => {
    return debounce(pullDown, 300)
  }, [pullDown])

  //创建better-scroll
  useEffect(() => {
    const scroll = new BScroll(scrollContainerRef.current, {
      scrollX: direction === 'horizental',
      scrollY: direction === 'vertical',
      probeType: 3,
      click,
      bounce: {
        top: bounceTop,
        bottom: bounceBottom
      }
    })
    setBScroll(scroll)
    return () => {
      setBScroll(null)
    }
  }, [])

  //给实例绑定scroll事件
  useEffect(() => {
    if(!bScroll || !onScroll) return
    bScroll.on('scroll', scroll => {
      onScroll(scroll)
    })
    return () => {
      bScroll.off('scoll')
    }
  }, [bScroll, onScroll])

  //下拉刷新，上拉加载
  //进行上拉到底的判断，调用上拉刷新的函数
  useEffect(() => {
    if(!bScroll || !pullUp) return
    bScroll.on('scrollEnd', () => {
      //判断是否滑动到了底部
      if(bScroll.y <= bScroll.maxScrollY + 100) {
        pullUpDebounce()
      }
    })
    return () => {
      bScroll.off('scrollEnd')
    }
  }, [pullUp, bScroll])

  //进行下拉的判断，调用下拉刷新的函数
  useEffect(() => {
    if(!bScroll || !pullDown) return
    bScroll.on('touchEnd', pos => {
      //判断用户的下拉动作
      if(pos.y > 50) {
        pullDownDebounce()
      }
    })
    return () => {
      bScroll.off('touchEnd')
    }
  }, [pullDown, bScroll])

  //每次重新渲染时刷新实例，防止无法滑动
  useEffect(() => {
    if(refresh && bScroll) {
      bScroll.refresh()
    }
  })

  useImperativeHandle(ref, () => ({
    refresh() {
      if(bScroll) {
        bScroll.fresh()
        bScroll.scrollTo(0, 0)
      }
    },
    getBScroll() {
      if(bScroll) {
        return bScroll
      }
    }
  }))

  useEffect(() => {
    
  })

  const PullUpdisplayStyle = pullUpLoading ? { display: '' } : { display: 'none' }
  const PullDowndisplayStyle = pullDownLoading ? { display: '' } : { display: 'none' }
  return (
    <ScrollContainer ref={ scrollContainerRef } onClick = {(e) => console.log(e)}>
      {props.children}
      {/* 滑到底部加载动画 */}
      <PullUpLoading style={ PullUpdisplayStyle }><Loading></Loading></PullUpLoading>
      {/* 顶部下拉加载动画 */}
      <PullDownLoading style={ PullDowndisplayStyle }><Loading2></Loading2></PullDownLoading>
    </ScrollContainer>
  )
})

Scroll.defaultProps = {
  direction: 'vertical',
  click: true,
  refresh: true,
  onScroll: null,
  pullUp: null,
  pullDown: null,
  pullUpLoading: false,
  pullDownLoading: false,
  bounceTop: true,
  bounceBottom: true
}

Scroll.protoType = {
  direction: PropTypes.oneOf(['vertical', 'horizental']),  //滚动方向 垂直/水平
  click: PropTypes.bool,  //是否支持点击
  refresh: PropTypes.bool,  //是否刷新
  onScroll: PropTypes.func,  //滑动触发的回调函数
  pullUp: PropTypes.func,  //上拉加载逻辑
  pullDown: PropTypes.func,  //下拉加载逻辑
  pullUpLoading: PropTypes.bool,  //是否显示上拉loading动画
  pullDownLoading: PropTypes.bool,  //是否显示下拉loading动画
  bounceTop: PropTypes.bool,  //是否支持向上吸顶
  bounceBottom: PropTypes.bool  //是否支持向下吸顶
}

export default Scroll
