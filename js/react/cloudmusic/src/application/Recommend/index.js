import React, { useEffect } from 'react'
import Slider from '../../components/slider'
import RecommendList from '../../components/list'
import Scroll from '../../baseUI/scroll'
import { Content } from './style'
import { connect } from 'react-redux'
import * as actionCreators from './store/actionCreators'
import { forceCheck } from 'react-lazyload'
import Loading from '../../baseUI/loading'
import { renderRoutes } from 'react-router-config'

// function Recommend(props) {
//   const { bannerList, recommendList, enterLoading } = props
//   const { getBannerDataDispatch, getRecommendListDataDispatch } = props

//   useEffect(() => {
//     if(!bannerList.size) {
//       getBannerDataDispatch()
//     }
//     if(!recommendList.size) {
//       getRecommendListDataDispatch()
//     }
//   }, [])

  // const bannerListJS = bannerList ? bannerList.toJS() : []
  // const recommendListJS = recommendList ? recommendList.toJS() : []

//   // const bannerList = [1, 2, 3, 4].map(item => {
//   //   return {imgUrl: "http://p1.music.126.net/ZYLJ2oZn74yUz5x8NBGkVA==/109951164331219056.jpg"}
//   // })

//   // const recommendList = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(item => {
//   //   return {
//   //     id: 1,
//   //     picUrl: "https://p1.music.126.net/fhmefjUfMD-8qtj3JKeHbA==/18999560928537533.jpg",
//   //     playCount: 12345,
//   //     name: "小坠, rajor, mario"
//   //   }
//   // })

//   return (
//     <Content>
//       <Scroll className="list" onScroll={forceCheck}>
//         <div>
//           <Slider bannerList={bannerListJS} />
//           <RecommendList recommendList={recommendListJS} />
//         </div>
//       </Scroll>
//       { enterLoading ? <Loading></Loading> : null }
//     </Content>
//   )
// }

// //将Redux全局的state映射到组件的props上
// const mapStateToProps = state => ({
//   bannerList: state.getIn(['recommend', 'bannerList']),
//   recommendList: state.getIn(['recommend', 'recommendList']),
//   enterLoading: state.getIn(['recommend', 'enteringLoading'])
// })

// const mapDispatchToProps = dispatch => ({
//   getBannerDataDispatch() {
//     dispatch(actionCreators.getBannerList())
//   },
//   getRecommendListDataDispatch() {
//     dispatch(actionCreators.getRecommendList())
//   }
// })

// export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Recommend))

function Recommend(props) {
  const { bannerList, recommendList, enterLoading } = props
  const { getBannerDataDispatch, getRecommendListDataDispatch } = props

  const { songsCount } = props

  useEffect(() => {
    if(!bannerList.size) {
      getBannerDataDispatch()
    }
    if(!recommendList.size) {
      getRecommendListDataDispatch()
    }
  }, [])

  const bannerListJS = bannerList ? bannerList.toJS() : []
  const recommendListJS = recommendList ? recommendList.toJS() : []

  return (
    <Content play={songsCount}>
      <Scroll className="list" onScroll={forceCheck}>
        <div>
          <Slider bannerList={bannerListJS} />
          <RecommendList recommendList={recommendListJS} />
        </div>
      </Scroll>
      { enterLoading ? <Loading></Loading> : null }
      { renderRoutes(props.route.routes) }
    </Content>
  )
}

//将Redux全局的state映射到组件的props上
const mapStateToProps = state => ({
  bannerList: state.getIn(['recommend', 'bannerList']),
  recommendList: state.getIn(['recommend', 'recommendList']),
  enterLoading: state.getIn(['recommend', 'enterLoading']),
  songsCount: state.getIn(['player', 'playList']).size
})

const mapDispatchToProps = dispatch => ({
  getBannerDataDispatch() {
    dispatch(actionCreators.getBannerList())
  },
  getRecommendListDataDispatch() {
    dispatch(actionCreators.getRecommendList())
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Recommend))
