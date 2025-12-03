import React from 'react'
import { Link } from 'react-router-dom'

const HeroOne = () => {
  return (
    <div className="hero-section-2">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="hero-content-2">
              <div className="sub-title-2" data-animation="fade-zoom-in" data-delay={0.4}>
                <p>Aithm Image Generator</p>
              </div>
              <h2>
                <span data-animation="fade-up">Create beautiful art with</span>
                <span className="sub-head" data-animation="fade-up"  data-delay={0.2}>Artificial Intelligence</span>
              </h2>
              <div className="image-generator-box">
                <div className="searchbox" data-animation="fade-zoom-in">
                  <div className="searchwrapper">
                    <div className="row align-items-center">
                      <div className="col-md-9">
                        <form>
                          <input type="text" className="form-control" placeholder="Write your prompt and get you best ai artwork!" />
                        </form>
                      </div>
                      <div className="col-lg-3">
                        <form>
                          <button className="btn" type="submit">Generate</button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="short-prompt" data-animation="fade-zoom-in">
              
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default HeroOne