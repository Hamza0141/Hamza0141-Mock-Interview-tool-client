import React from 'react'
import FeatureCard from './featureCard'
import { featuresData } from '@/db/featuresData'

const Features = () => {
    return (
        <div className="features-section-2 pt-100 pb-70">
            <div className="container">
                <div className="row">
                    {
                        featuresData.map((feature, index) => (
                            <div key={feature.id} className="col-xl-3 col-lg-6 col-sm-6">
                                <FeatureCard feature={feature} index={index}/>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>

    )
}

export default Features