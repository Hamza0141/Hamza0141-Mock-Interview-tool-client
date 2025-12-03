import React from 'react'
import { Link } from 'react-router-dom'

const SearchBox = () => {
    return (
        <div className="aithm offcanvas offcanvas-top" tabIndex={-1} id="offcanvasTop">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="offcanvasDarkLabel"> <Link to="/">Aithm</Link></h5>
                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close" />
            </div>
            <div className="offcanvas-body">
                <div className="search-box">
                    <div className="searchwrapper">
                        <div className="searchbox">
                            <form>
                                <div className="row align-items-center">
                                    <div className="col-md-9">
                                        <input type="text" className="form-control" placeholder="Type words for search" /></div>
                                    <div className="col-lg-3">
                                        <button className="btn" type="submit">Search</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default SearchBox