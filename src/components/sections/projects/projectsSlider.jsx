import React from 'react'
import { Link } from 'react-router-dom';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import ProjectCard from './projectCard';
import { projectsData } from '@/db/projectsDAta';


const ProjectsSlider = () => {
    return (
        <div className="project-display-section ptb-100">
            <div className="container">
                <div className="section-title-2 style-3" data-animation="fade-up" >
                    <div className="sub-title-3">
                        <p>Projects</p>
                    </div>
                    <h2>Unveil New Creative Horizons with Models</h2>
                </div>
            </div>
            <div className="container-fluid">
                <Swiper
                    spaceBetween={20}
                    breakpoints={{
                        0: {
                            slidesPerView: 1
                        },
                        768: {
                            slidesPerView: 2
                        }
                    }}
                    autoplay={{
                        delay: 5000
                    }}
                    speed={2000}
                    modules={[Autoplay]}
                >
                    {projectsData.map((project, index) => (
                        <SwiperSlide key={project.id}>
                            <ProjectCard project={project} index={index}/>
                        </SwiperSlide>
                    ))}
                </Swiper>
                
            </div>
        </div>

    )
}

export default ProjectsSlider