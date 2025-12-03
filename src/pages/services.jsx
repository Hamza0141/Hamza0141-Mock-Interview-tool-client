
import ContinuousLearning from '@/components/sections/continuousLearning'
import Features from '@/components/sections/features/features'
import PageHeader from '@/components/sections/pageHeader'
import WorkProcess from '@/components/sections/workProcess'
import React from 'react'

const Services = () => {
    return (
        <>
            <PageHeader
                className={"sbg-2"}
                currentPage={"Services"}
                title={"Services"}
            />
            <Features/>
            <ContinuousLearning/>
            <WorkProcess order={"order-1"} isLampImgTop={false}/>
        </>
    )
}

export default Services