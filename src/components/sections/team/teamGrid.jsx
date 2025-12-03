import { teamMembers } from '@/db/teamMembers'
import React from 'react'
import TeamCard from './teamCard'

const TeamGrid = () => {
    return (
        <div className="team-section-2 pt-100">
            <div className="container">
                <div className="row">
                    {
                        teamMembers.map(({ description, id, image, name, role, social }, index) => (
                            <div key={id} className="col-lg-4 col-sm-6" data-animation="fade-up" data-delay={index * 0.1}>
                                <TeamCard description={description} imgSrc={image} name={name} role={role} social={social} />
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>

    )
}

export default TeamGrid