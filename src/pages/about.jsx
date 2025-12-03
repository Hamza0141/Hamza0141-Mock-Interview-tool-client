import AboutOne from '@/components/sections/about/aboutOne'
import Brand from '@/components/sections/brands/brand'
import PageHeader from '@/components/sections/pageHeader'
import TestimonialOne from '@/components/sections/testimonial/testimonialOne'
import WorkProcess from '@/components/sections/workProcess'
import React from 'react'

const About = () => {
  return (
    <>
      <PageHeader
        className={"sbg-5"}
        currentPage={"About us"}
        title={"About Us"}
      />
      <AboutOne className={"pt-100"} inVideoBg={true}/>
      <Brand />
      <WorkProcess isLampImgTop={true}/>
      <TestimonialOne />
    </>
  )
}

export default About