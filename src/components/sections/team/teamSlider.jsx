import { teamMembers } from '@/db/teamMembers'
import React from 'react'
import TeamCard from './teamCard'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';

const TeamSlider = () => {
  return (
    <div className="team-section pb-100">
      <div className="container-fluid">
        <div className="row position-relative">
          <div className="col-xl-5 col-md-6 col-lg-12">
            <div className="team-content" data-animation="fade-up" data-delay={0.1}>
              <div>
                <div className="sub-title-2">
                  <p>Our Developers</p>
                </div>
                <h2>Meet our team of Creative Expert.</h2>
                <p> AI systems can analyze data, recognize patterns, make decisions, and even adapt and improve over time.</p>
              </div>


            </div>
          </div>
          <div className="col-xl-7 col-md-6 col-lg-12">
            <Swiper
              spaceBetween={10}
              breakpoints={{
                0: {
                  slidesPerView: 1
                },
                575: {
                  slidesPerView: 2
                },
                768: {
                  slidesPerView: 1
                },
                992: {
                  slidesPerView: 3
                },
                1200: {
                  slidesPerView: 2
                }
              }}
              navigation={{
                nextEl:".next-nav",
                prevEl:".prev-nav",
              }}
              autoplay={{
                delay:5000
              }}
              speed={2000}
              modules={[Navigation, Autoplay]}
              loop
              data-animation="fade-zoom-in" data-delay={0.2}
            >
              {
                teamMembers.map(({ description, image, name, role, social, id }) => (
                  <SwiperSlide key={id}>
                    <TeamCard description={description} imgSrc={image} name={name} role={role} social={social} />
                  </SwiperSlide>
                ))
              }
            </Swiper>
            <div className='navigation'>
              <button className='prev-nav'>
                <i className="fi fi-tr-arrow-small-left"></i>
              </button>
              <button className='next-nav '>
                <i className="fi fi-tr-arrow-small-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default TeamSlider