import styled from 'styled-components'
import style from '../../assets/global-style'

export const Container = styled.div`
  position: fixed;
  top: 0;
  bottom: ${props => props.play > 0 ? '60px' : 0};
  left: 0;
  right: 0;
  z-index: 100;
  background-color: ${style["background-color"]};
  transform-origin: right bottom;
  &.fly-enter, &.fly-appear {
    transform: rotateZ(30deg) translate3d(100%, 0, 0);
  }
  &.fly-enter-active, &.fly-appear-active {
    transition: transform .3s;
    transform: rotateZ(0deg) translate3d(0, 0, 0)
  }
  &.fly-exit {
    transform: rotateZ(0deg) translate3d(0, 0, 0)
  }
  &.fly-exit-active {
    transition: transform .3s;
    transform: rotateZ(30deg) translate3d(100%, 0, 0);
  }
`
