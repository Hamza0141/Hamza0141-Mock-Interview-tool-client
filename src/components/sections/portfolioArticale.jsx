import React, { useState } from 'react'
import ModalVideo from 'react-modal-video'
import { PhotoProvider, PhotoView } from 'react-photo-view'

const PortfolioArticale = () => {
    const [isOpen, setOpen] = useState(false);
    return (
        <div className="portfolio-details ptb-100">
            <div className="container">
                <div className="row align-items-top">
                    <div className="col-lg-4">
                        <div className="portfolio-content">
                            <div className="sub-title">
                                Project Details
                            </div>
                            <ul>
                                <li> <span className="title">Date:</span> <span>Dec 1th, 2025</span></li>
                                <li> <span className="title">Client:</span> <span>Hasina Users</span></li>
                                <li> <span className="title">Services:</span> <span>Web Development</span></li>
                                <li>
                                    <span className="title dtl">Description:</span>
                                    <p>I'm very grateful to have learned so much about design and it's impact on businesses. I'm looking forward to building the Huneebee Project brand with your expertise by my side.</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-8">
                        <div className="project-dec">
                            <div className="project-wrap">
                                <div className="project-video-wrap">
                                    <video className="project-video" src="/img/all-img/project-video.mp4" playsInline autoPlay muted loop>
                                    </video>
                                </div>
                            </div>
                            <p>Looking ahead, the future of AI holds boundless possibilities. As technology continues to evolve, we can expect even greater integration of AI into our daily lives. Advancements in quantum computing, natural language processing, and explainable AI will contribute to creating more sophisticated, reliable, and transparent AI systems. The collaboration between humans and AI.</p>
                            <p>AI technology continues to advance, ethical considerations become paramount. Issues such as bias in algorithms, privacy concerns, and the potential impact on employment need careful attention.</p>
                            <div className="project-image-waper">
                                <div className="row">
                                    <PhotoProvider>
                                        <div className="col-xl-6 col-md-6">
                                            <div className="image">
                                                <PhotoView src="/img/all-img/blog-4.jpg" >
                                                    <img src="/img/all-img/blog-4.jpg" alt="image" className="popup-img" />
                                                </PhotoView>
                                            </div>
                                        </div>
                                        <div className="col-xl-6 col-md-6">
                                            <div className="image">
                                                <PhotoView src="/img/all-img/blog-5.jpg">
                                                    <img src="/img/all-img/blog-5.jpg" alt="image" className="popup-img" />
                                                </PhotoView>
                                            </div>
                                        </div>
                                    </PhotoProvider>
                                </div>
                            </div>
                            <p>These systems rely on advanced algorithms and sensors to navigate their surroundings, analyze data in real-time, and make decisions without human intervention.</p>
                            <p>Technology continues to evolve, we can expect even greater integration of AI into our daily lives. Advancements in quantum computing, natural language processing, and explainable AI will contribute to creating more sophisticated, reliable, and transparent AI systems. The collaboration between humans and AI.</p>
                            <a onClick={(e) => { setOpen(true), e.preventDefault() }} className="popup-youtube" href="#">
                                <div className="image-video">
                                    <img src="/img/all-img/pd-1.jpg" alt="image" />
                                    <div className="video-btn">
                                        <i className="bx bx-play" />
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <ModalVideo
                channel="youtube"
                youtube={{ mute: 0, autoplay: 0 }}
                isOpen={isOpen}
                videoId="vFINPUJDkS8"
                onClose={() => setOpen(false)}
            />
        </div>
    )
}

export default PortfolioArticale