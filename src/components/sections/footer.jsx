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
                <h2>Subscribe To Ai!</h2>
                <p>Artificial Intelligence is a transformation field of computer science that empowers machines to perform</p>
                <div className="subscribe-wrapper">
                  <div className="subscribe-box">
                    <form data-toggle="validator">
                      <div className="row align-items-center">
                        <div className="col-md-8">
                          <input type="text" className="form-control" placeholder="Your email address @" name="EMAIL" required autoComplete="off" />
                        </div>
                        <div className="col-lg-4">
                          <button type="submit" className="btn">Subscribe</button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-sm-6 col-md-4">
              <div className="footer-widget">
                <h4>Quick Links</h4>
                <ul>
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/about">About Us</Link></li>
                  <li><Link to="/gallery">Gallery</Link></li>
                  <li><Link to="/portfolio">Portfolio</Link></li>
                  <li><Link to="/team">Developers</Link></li>
                  <li><Link to="/contact">Contact Us</Link></li>
                </ul>
              </div>
            </div>
            <div className="col-lg-2 col-sm-6 col-md-4">
              <div className="footer-widget">
                <h4>Resource</h4>
                <ul>
                  <li><Link to="/blog">Blogs</Link></li>
                  <li><Link to="/term-condition">Term of services</Link></li>
                  <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                  <li><Link to="/cookie-policy">Cookie Policy</Link></li>
                </ul>
              </div>
            </div>
            <div className="col-lg-2 col-sm-6 col-md-4">
              <div className="footer-widget">
                <h4>Office</h4>
                <span>175 5th Ave, New York, NY 10010, USA</span>
                <Link className="ft-mail" to="/mailto:example@example.com">example@example.com</Link>
                <Link className="ft-number" to="/tel:+18408412569">+1 840 841 25 69</Link>
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
                <p>Copyright© 2025 Aithm. All rights reserved.</p>
              </div>
            </div>
            <div className="col-xl-8 col-lg-7">
              <div className="cpr-right">
                <ul>
                  <li><Link to="/term-condition">Term of services</Link></li>
                  <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                  <li><Link to="/cookie-policy">Cookie Policy</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default Footer