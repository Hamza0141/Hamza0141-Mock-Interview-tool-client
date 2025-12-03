import { pricingData } from '@/db/pricingData'
import React from 'react'
import PriceCard from './priceCard'

const PriceTwo = () => {
    return (
        <div className="pricing-section style-2 ptb-100">
            <div className="container">
                <div className="pricing-table">
                    <div className="row">
                        {pricingData.map((plan, index) => (
                            <div key={plan.id} className="col-lg-4 col-sm-6">
                                <PriceCard plan={plan} index={index} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

    )
}

export default PriceTwo