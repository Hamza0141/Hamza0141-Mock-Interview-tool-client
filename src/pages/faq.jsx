import ContinuousLearning from '@/components/sections/continuousLearning'
import FaqSection from '@/components/sections/faqSection'
import PageHeader from '@/components/sections/pageHeader'
import PriceOne from '@/components/sections/pricing/priceOne'
import React from 'react'

const Faq = () => {
    return (
        <>
            <PageHeader
                className={"sbg-3"}
                currentPage={"Faq"}
                title={"Faq"}
            />
            <FaqSection/>
            <ContinuousLearning/>
            <PriceOne/>
        </>
    )
}

export default Faq