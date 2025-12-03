import React from 'react'

const ContactAddress = () => {
    return (
        <div className="contact-section-title ptb-100">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-6">
                        <div className="contact-content">
                            <div className="sub-title-2">
                                <p>Contact Us</p>
                            </div>
                            <h2>Let’s Start Working Together. Get in Touch</h2>
                            <p>Get in touch to discuss your employee wellbeing needs today. Please give us a call, drop us an email.</p>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="contact-info">
                            <div className="row">
                                <div className="col-lg-6 col-md-6 col-sm-6">
                                    <div className="contact-info-box">
                                        <i className="fi fi-tr-phone-call" />
                                        <h4><a href="tel:+0123456789102">+012-3456-789102</a></h4>
                                        <span>Phone</span>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-6">
                                    <div className="contact-info-box">
                                        <i className="fi fi-tr-envelope-dot" />
                                        <h4><a href="mailto:support@example.com">support@example.com</a></h4>
                                        <span>Email</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    )
}

export default ContactAddress