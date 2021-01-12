import styled from 'styled-components'
import style from '../../assets/global-style'

export const SliderContainer = styled.div`
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  margin: auto;
  background-color: white; 
  .before {
    width: 100%;
    height: 400px;
    position: absolute;
    top: -300px;
    background: ${style["theme-color"]};
    z-index: 1;
  }
  .swiper-container {
    position: relative;
    width: 98%;
    height: 160px;
    margin: auto;
    overflow: hidden;
    border-radius: 6px;
    .swiper-nav {
      position: absolute;
      display: block;
      width: 100%;
      height: 100%;
    }
  }
`
