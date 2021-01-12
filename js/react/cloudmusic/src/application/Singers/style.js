import styled from 'styled-components'
import style from '../../assets/global-style'

export const NavContainer = styled.div`
  position: fixed;
  top: 95px;
  box-sizing: border-box;
  width: 100%;
  padding: 5px;
  overflow: hidden;
`
export const ListContainer = styled.div`
  position: fixed;
  top: 160px;
  left: 0;
  bottom: ${props => props.play ? '60px' : 0};
  width: 100%;
  overflow: hidden;
`

export const List = styled.div`
  display: flex;
  margin: auto;
  flex-direction: column;
  overflow: hidden;
`

export const ListItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0 5px;
  padding: 5px 0;
  border-bottom: 1px solid ${style["border-color"]};
  .imgWrapper {
    margin-right: 20px;
    img {
      width: 50px;
      height: 50px;
      border-radius: 3px;
    }
  }
  span {
    font-size: ${style["font-size-m"]};
    color: ${style["font-color-desc"]};
    font-weight: 500;
  }
`

export const EnterLoading = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100px;
  height: 100px;
  margin: auto;
`
