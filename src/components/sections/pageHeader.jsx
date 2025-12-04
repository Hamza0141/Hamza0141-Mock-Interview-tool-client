import React from 'react'
import { Link } from 'react-router-dom'

const PageHeader = ({className, title, currentPage}) => {
    return (
        <div className={`section-banner ptb-100 ${className}`}>
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="banner-content">
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PageHeader