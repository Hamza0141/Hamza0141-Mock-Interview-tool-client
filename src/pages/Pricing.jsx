
import PageHeader from '@/components/sections/pageHeader'
import PriceTwo from '@/components/sections/pricing/priceTwo'
import TestimonialOne from '@/components/sections/testimonial/testimonialOne'

import React from 'react'

const Pricing = () => {
    return (
        <>
            <PageHeader
                className={"sbg-8"}
                currentPage={"Pricing Plan"}
                title={"Pricing Plan"}
            />
            <PriceTwo/>
            <TestimonialOne/>
        </>
    )
}

export default Pricing