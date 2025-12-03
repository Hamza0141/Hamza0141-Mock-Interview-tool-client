import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
    return (
        <div className="error-section ptb-100">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="error-content">
                            <h2>4<span>0</span>4</h2>
                            <h4>Page is not Found!!</h4>
                            <Link className="default-btn" to="/"><span>Go Home</span> <i className="bx bx-home" /></Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default NotFound