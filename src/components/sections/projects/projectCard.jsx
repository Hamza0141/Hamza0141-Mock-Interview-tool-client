import React from 'react'
import { Link } from 'react-router-dom'

const ProjectCard = ({project, index}) => {
    return (
        <div className="project-img" data-animation="fade-up" data-delay={index * 0.1}>
            <img src={project.imgSrc} alt="Project Image" />
            <div className="project-btn">
                <Link to="/portfolio-details">
                    <i className="bx bx-arrow-back bx-rotate-180" /> <span>View Project</span>
                </Link>
            </div>
        </div>
    )
}

export default ProjectCard