import { pricingData } from '@/db/pricingData'
import React from 'react'
import PriceCard from './priceCard'

const PriceOne = ({ isVideoAnimationShow }) => {
    return (
        <div className="pricing-section ptb-100">
            <div className="container">
                <div className="row align-items-center">
                    {/* <div className="col-xl-5 col-lg-12">
                        {
                            isVideoAnimationShow ?
                                <div className="price-wrap">
                                    <div className="price-video-wrap">
                                        <video className="price-video" src="/img/all-img/video-2.mp4" playsInline autoPlay muted loop>
                                        </video>
                                    </div>
                                </div>
                                :
                                <div className="img-wrapper">
                                    <div className="img-box" data-animation="fade-zoom-in" data-delay={0.1}>
                                        <img className="image-box-item" src="/img/all-img/pricing-image-2.png" alt="image" />
                                        <img className="image-box-item" src="/img/all-img/pricing-image.png" alt="image" />
                                    </div>
                                </div>
                        }
                    </div> */}
                    <div className="col-xl-7 col-lg-12">
                        <div className="pricing-content">
                            <h2>Our Pricing Plans</h2>
                            <p>AI systems can analyze data, recognize patterns, make decisions, and even adapt and improve over time.</p>
                            <div className="pricing-table">
                                <div className="row">
                                    {pricingData.slice(0, 3).map((plan, index) => (
                                        <div key={plan.id} className="col-lg-6 col-sm-6">
                                            <PriceCard plan={plan} index={index}/>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default PriceOne