import React from 'react'

const ContactForm = () => {
    return (
        <div className="contact-section pb-70">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6 col-md-6">
                        <div className="contact-form">
                            <form id="contact-form" method="post" encType="multipart/form-data">
                                <div className="row">
                                    <div className="col-lg-12 col-md-12">
                                        <div className="form-group">
                                            <input type="text" name="name" className="form-control" id="name" required data-error="Please enter your name" placeholder="Your name" />
                                            <div className="help-block with-errors" />
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-12">
                                        <div className="form-group">
                                            <input type="email" name="email" className="form-control" id="email" required data-error="Please enter your email" placeholder="Your email address" />
                                            <div className="help-block with-errors" />
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-12">
                                        <div className="form-group">
                                            <input type="text" name="subject" className="form-control" id="phone_number" required data-error="Please enter your subjects" placeholder="Your subjects" />
                                            <div className="help-block with-errors" />
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-12">
                                        <div className="form-group">
                                            <textarea name="message" id="message" className="form-control" cols={30} rows={6} required data-error="Please enter your message" placeholder="Write your message..." defaultValue={""} />
                                            <div className="help-block with-errors" />
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-12">
                                        <button type="submit" name="submit" id="submitButton" className="default-btn"><span>Send Message</span><i className="bx bx-paper-plane" /></button>
                                        <div id="msgSubmit" className="h3 text-center hidden" />
                                        <div className="clearfix" />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                        <div className="contact-wrap">
                            <div className="contact-video-wrap">
                                <video className="contact-video" src="/img/all-img/video-4.mp4" playsInline autoPlay muted loop>
                                </video>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default ContactForm