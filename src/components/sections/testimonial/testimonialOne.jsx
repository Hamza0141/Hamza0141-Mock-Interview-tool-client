import { testimonialsData } from '@/db/testimonialsDataOne'
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const TestimonialOne = () => {
  return (
    <div className="testimonial-section-2 pt-100 pb-70">
      <div className="container">
        <Swiper
          spaceBetween={20}
          breakpoints={{
            0: {
              slidesPerView: 1
            },
            576: {
              slidesPerView: 2
            },
            768: {
              slidesPerView: 1
            },
            992: {
              slidesPerView: 1
            },
            1200: {
              slidesPerView: 2
            },
          }}
          loop
          autoplay={{
            delay:5000
          }}
          speed={2000}
          pagination={{
            clickable:true
          }}
          modules={[Autoplay, Pagination]}
          className='pb-4'
        >
          {testimonialsData.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <div
                className="testimonial-item-2"
                data-animation="fade-up"
                data-aos-offset={testimonial.id * 100}
              >
                <div className="row g-0 align-items-center">
                  <div className="col-lg-6 col-md-6">
                    <div className="content">
                      <p>{testimonial.quote}</p>
                      <div className="info">
                        <h4>{testimonial.author}</h4>
                        <span>{testimonial.title}</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <div className="image">
                      <div className="quate-icon">
                        <i className="bx bxs-quote-left" />
                      </div>
                      <img src={testimonial.imageSrc} alt="image" />
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>

  )
}

export default TestimonialOne