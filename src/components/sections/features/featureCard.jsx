import React from 'react'

const FeatureCard = ({ feature, index }) => {
    return (
        <div
            className="feature-box"
            data-animation="fade-up"
            data-delay={index * 0.1}
        >
            <span>AI Features</span>
            <div className="icon">
                <i className={feature.icon} />
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
        </div>
    )
}

export default FeatureCard