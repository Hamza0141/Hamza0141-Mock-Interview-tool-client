import React from 'react'
import { Link } from 'react-router-dom'
import FooterTopInfo from './footerTopInfo'

const Footer = () => {
  return (
    <div className="footer-area">
      <FooterTopInfo />
      <div className="footer-widget-info ptb-100">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-sm-12 col-md-12">
              <div className="subscribe-area">
                <h2>Start Improving With AI Today</h2>
                <p>
                  Practice mock interviews with instant AI
                  feedback. Build confidence, improve your delivery, and get
                  ready for real opportunities.
                </p>

                <div className="subscribe-wrapper">
                  <div className="subscribe-box">
                    <div className="row align-items-center">
                      <div className="col-md-8">
                        <p className="mb-0" style={{ fontSize: "15px" }}>
                          No distractions. Just get
                          better.
                        </p>
                      </div>
                      <div className="col-lg-4">
                        <Link to="/dashboard" className="btn w-100">
                          Start Practicing →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-sm-6 col-md-4">
              <div className="footer-widget">
                <h4>Quick Links</h4>
                <ul>
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="/about">About Us</Link>
                  </li>
                  <li>
                    <Link to="/team">Developers</Link>
                  </li>
                  <li>
                    <Link to="/contact">Contact Us</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-2 col-sm-6 col-md-4">
              <div className="footer-widget">
                <h4>Resource</h4>
                <ul>
                  <li>
                    <Link to="/terms">Term of services</Link>
                  </li>
                  <li>
                    <Link to="/privacy">Privacy Policy</Link>
                  </li>
                  <li>
                    <Link to="/cookie-policy">Cookie Policy</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-2 col-sm-6 col-md-4">
              <div className="footer-widget">
                <h4>Office</h4>
                <span>7677 N Garfield Ave, Kansas City, Mo 64118, USA</span>
                <Link className="ft-mail" to="/mailto:support@prepwithai.net.">
                  support@prepwithai.net.
                </Link>
                {/* <Link className="ft-number" to="/tel:+18408412569">
                  +1 840 841 25 69
                </Link> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="copy-right-area">
        <div className="container">
          <div className="row">
            <div className="col-xl-4 col-lg-5">
              <div className="cpr-left">
                <p>Copyright© 2025 prepwithai. All rights reserved.</p>
              </div>
            </div>
            <div className="col-xl-8 col-lg-7">
              <div className="cpr-right">
                <ul>
                  <li>
                    <Link to="/terms">Term of services</Link>
                  </li>
                  <li>
                    <Link to="/privacy">Privacy Policy</Link>
                  </li>
                  <li>
                    <Link to="/cookie-policy">Cookie Policy</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer