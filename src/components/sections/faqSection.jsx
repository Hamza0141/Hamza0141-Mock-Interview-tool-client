import { faqData } from '@/db/faqData'
import React, { useState } from 'react'

const FaqSection = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };
    return (
        <div className="faq-section pt-100 pb-70">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-4 col-md-6">
                        <div className="img-wrapper">
                            <div className="img-box" data-animation="fade-zoom-in" data-delay={0.1}>
                                <img className="image-box-item" src="/img/all-img/faq-2.png" alt="image" />
                                <img className="image-box-item" src="/img/all-img/faq.png" alt="image" />
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-7 col-md-6">
                        <div className="accordion" id="faqAccordion">
                            {faqData.map((faq, index) => (
                                <div className="accordion-item" key={index}>
                                    <h2 className="accordion-header faq-item" id={`heading${index}`}>
                                        <button
                                            className={`accordion-button faq-question ${index !== 0 ? "collapsed" : ""}`}
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target={`#collapse${index}`}
                                            aria-expanded={index === 0 ? "true" : "false"}
                                            aria-controls={`collapse${index}`}
                                        >
                                            {faq.question}
                                        </button>
                                        <div className="icon-container"><i className='bx bx-chevron-down'></i></div>
                                    </h2>
                                    <div
                                        id={`collapse${index}`}
                                        className={`accordion-collapse collapse faq-answer ${index === 0 ? "show" : ""}`}
                                        aria-labelledby={`heading${index}`}
                                        data-bs-parent="#faqAccordion"
                                    >
                                            {faq.answer}
                                        {/* <div className="accordion-body">
                                        </div> */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default FaqSection