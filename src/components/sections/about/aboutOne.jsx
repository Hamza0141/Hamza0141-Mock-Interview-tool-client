import React from "react";
import { Link } from "react-router-dom";

const AboutOne = ({ className, inVideoBg }) => {
  return (
    <div className={`about-section pb-100 ${className}`}>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6 col-md-6">
            {inVideoBg ? (
              <div
                className="about-wrap"
                data-animation="fade-zoom-in"
                data-aos-offset="100"
              >
                <div className="about-video-wrap">
                  <video
                    className="about-video"
                    src="/img/all-img/video-3.mp4"
                    playsInline
                    autoPlay
                    muted
                    loop
                  ></video>
                </div>
              </div>
            ) : (
              <div
                className="img-wrapper"
                data-animation="fade-zoom-in"
                data-delay={0.1}
              >
                <div className="img-box">
                  <img
                    className="image-box-item"
                    src="/img//AI-Image/about-one.png"
                    alt="image"
                  />
                  <img
                    className="image-box-item"
                    src="/img/AI-Image/about-one.png"
                    alt="image"
                  />
                </div>
              </div>
            )}
          </div>
          <div className="col-lg-6 col-md-6">
            <div
              className="about-content"
              data-animation="fade-up"
              data-delay={0.2}
            >
              <div className="sub-title-2">
                <p>What Prepare With AI Does</p>
              </div>
              <h2>Practice interviews & speeches with AI.</h2>
              <p>
                Prepare With AI helps you get ready for real interviews and
                public speaking by simulating realistic scenarios with AI.
                You’ll receive instant feedback on your answers, structure,
                confidence, and delivery so you can improve faster and feel more
                prepared.
              </p>
              <ul>
                <li>
                  <i className="bx bx-check" /> AI-powered mock interviews
                </li>
                <li>
                  <i className="bx bx-check" /> Practice public speaking with
                  evaluation
                </li>
                <li>
                  <i className="bx bx-check" /> Clear feedback on strengths and
                  areas to improve
                </li>
              </ul>
              <Link className="default-btn" to="/about">
                <span>About Us</span> <i className="bx bx-chevron-right" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutOne;
