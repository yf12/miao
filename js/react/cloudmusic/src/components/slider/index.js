import React, { useState, useEffect } from 'react'
import { SliderContainer } from './style'
import Swiper from 'swiper'
import 'swiper/css/swiper.css'

function Slider(props) {
  const { bannerList } = props
  const [sliderSwiper, setSliderSwiper] = useState(null)

  useEffect(() => {
    if(bannerList.length && !sliderSwiper) {
      let sliderSwiper = new Swiper('.slider-container', {
        loop: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false
        },
        pagination: {
          el: '.swiper-pagination'
        }
      })
      setSliderSwiper(sliderSwiper)
    } 
  }, [bannerList.length, sliderSwiper])

  useEffect(() => {
    let sliderSwiper = new Swiper('.swiper-container', {
      loop: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false
      },
      pagination: {
        el: '.swiper-pagination'
      }
    })
  })

  return (
    <SliderContainer>
      <div className="before"></div>
      <div className="swiper-container">
        <div className="swiper-wrapper">
          {
            bannerList.map((item, idx) => {
              return (
                <div className="swiper-slide" key={idx}>
                  <div className="swiper-nav">
                    <img src={item.imageUrl} width="100%" height="100%" alt="推荐" />
                  </div>
                </div>
              )
            })
          }
        </div>
        <div className="swiper-pagination"></div>
      </div>
    </SliderContainer>
  )
}

export default React.memo(Slider)
