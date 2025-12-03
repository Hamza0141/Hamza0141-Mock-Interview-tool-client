import React from 'react'
import { Link } from 'react-router-dom'

const PageHeader = ({className, title, currentPage}) => {
    return (
        <div className={`section-banner ptb-100 ${className}`}>
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="banner-content">
                            <h2>{title}</h2>
                            <nav style={{"--bs-breadcrumb-divider": "'/'"}} aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                    <li className="breadcrumb-item active" aria-current="page">{currentPage}</li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PageHeader