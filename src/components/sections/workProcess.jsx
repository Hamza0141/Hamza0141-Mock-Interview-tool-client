import React from 'react'

const processSteps = [
    {
        id: 1,
        title: "Intelligent Automation",
        description: "Experience the power of intelligent automation as our AI services streamline your workflows.",
    },
    {
        id: 2,
        title: "Predictive Analytics",
        description: "Uncover valuable insights, trends, and patterns to make informed decisions that drive business growth.",
    },
    {
        id: 3,
        title: "Enhanced Security",
        description: "AI services fortify your digital infrastructure. Utilize advanced algorithms to detect and mitigate potential threats.",
    },
];

const WorkProcess = ({ order, isLampImgTop }) => {
    return (
        <div className="process-wrap ptb-100">
            <div className="container">
                <div className="row align-items-center">
                    <div className={`col-lg-6 col-md-6 ${order}`}>
                        <div className="process-content" data-animation="fade-up" data-delay={0.1}>
                            <div className="content-title">
                                <div className="sub-title-2">
                                    <p>Working Process</p>
                                </div>
                                <h2>Get Images of from 3 simple process</h2>
                                <p>They evolve and learn from experiences. Benefit from adaptive algorithms that continuously improve performance:</p>
                            </div>
                            <div className="process-item-wrap">
                                {processSteps.map((step) => (
                                    <div key={step.id} className="process-item">
                                        <span>{String(step.id).padStart(2, "0")}</span>
                                        <div className="process-info">
                                            <h4>{step.title}</h4>
                                            <p>{step.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                        <div className="img-wrapper" data-animation="fade-zoom-in" data-delay={0.1}>
                            <div className="img-box">
                                {
                                    isLampImgTop ?
                                        <>
                                            <img className="image-box-item" src="/img/all-img/pricing-image-3.png" alt="image" />
                                            <img className="image-box-item" src="/img/all-img/pricing-image-2.png" alt="image" />
                                        </>
                                        :
                                        <>
                                            <img className="image-box-item" src="/img/all-img/pricing-image-2.png" alt="image" />
                                            <img className="image-box-item" src="/img/all-img/pricing-image-3.png" alt="image" />
                                        </>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default WorkProcess