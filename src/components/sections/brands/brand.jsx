import React from 'react'

const Brand = ({className}) => {
    return (
        <div className={`brand-section-2 ${className}`}>
            <div className="container">
                <div className="row align-items-center justify-content-between">
                    <div className="col-xl-2 col-lg-2 col-md-4 col-6" data-animation="fade-zoom-in" data-delay={0.1}>
                        <div className="single-brand">
                            <img src="/img/all-img/white-brand-1.png" alt="image" />
                        </div>
                    </div>
                    <div className="col-xl-2 col-lg-2 col-md-4 col-6" data-animation="fade-zoom-in" data-delay={0.2}>
                        <div className="single-brand">
                            <img src="/img/all-img/white-brand-2.png" alt="image" />
                        </div>
                    </div>
                    <div className="col-xl-2 col-lg-2 col-md-4 col-6" data-animation="fade-zoom-in" data-delay={0.3}>
                        <div className="single-brand">
                            <img src="/img/all-img/white-brand-3.png" alt="image" />
                        </div>
                    </div>
                    <div className="col-xl-2 col-lg-2 col-md-4 col-6" data-animation="fade-zoom-in" data-delay={0.4}>
                        <div className="single-brand">
                            <img src="/img/all-img/white-brand-4.png" alt="image" />
                        </div>
                    </div>
                    <div className="col-xl-2 col-lg-2 col-md-4 col-6" data-animation="fade-zoom-in" data-delay={0.5}>
                        <div className="single-brand">
                            <img src="/img/all-img/white-brand-5.png" alt="image" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Brand