import PageHeader from '@/components/sections/pageHeader'
import React from 'react'
import { Link } from 'react-router-dom'

const CookiePolicy = () => {
    return (
        <>
            <PageHeader
                className={"sbg-6"}
                currentPage={"Cookie Policy"}
                title={"Cookie Policy"}
            />
            <div className="cookie-section ptb-100">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="cookie-content">
                                <div className="pera-list">
                                    <h2>What are Cookies?</h2>
                                    <p>Cookies are small text files that are stored on your device when you visit a website. They are widely used to enhance your online experience by remembering your preferences, settings, and other information.</p>
                                </div>
                                <div className="notice">
                                    <div className="row align-items-center">
                                        <div className="col-lg-2">
                                            <div className="icon">
                                                <i className="bx bx-cookie" />
                                            </div>
                                        </div>
                                        <div className="col-lg-10">
                                            <p>Cookies are small text files that are stored on your device when you visit a website. They are widely used to enhance your online experience by remembering your preferences, settings, and other information.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="pera-list">
                                    <h2>Types of Cookies We Use</h2>
                                    <ul className="style-2">
                                        <li><b>Essential Cookies:</b> These cookies are necessary for the functioning of the Website. They enable basic functionalities such as page navigation and access to secure areas of the site. The Website cannot function properly without these cookies.</li>
                                        <li><b>Analytical/Performance Cookies:</b> These cookies help us understand how visitors interact with the Website by collecting and reporting information anonymously. This information allows us to improve the Website's performance.</li>
                                        <li><b>Functionality Cookies:</b> These cookies enable the Website to remember choices you make (such as your username, language, or region) and provide enhanced, personalized features.</li>
                                        <li><b>Targeting/Advertising Cookies:</b> These cookies are used to deliver relevant advertisements to you. They may be used to track your browsing habits and deliver ads based on your interests.</li>
                                    </ul>
                                </div>
                                <div className="pera-list">
                                    <h2>Third-Party Cookies</h2>
                                    <p>Some content on the Website may be provided by third parties. These third parties may also set cookies on your device. We do not have control over these cookies, and you should refer to the respective privacy policies of these third parties for more information.</p>
                                </div>
                                <div className="pera-list">
                                    <h2>Changes to this Cookie Policy</h2>
                                    <p>We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated effective date. We encourage you to review this policy periodically for any changes.</p>
                                </div>
                                <div className="pera-list">
                                    <h2>Managing Cookies</h2>
                                    <p>You can manage and control cookie preferences through your browser settings. Most web browsers allow you to delete or block cookies, and you can find instructions for managing cookies in your browser's help documentation.</p>
                                    <p>Please note that if you choose to disable cookies, some features of the Website may not function properly, and your user experience may be affected.</p>
                                </div>
                                <div className="pera-list">
                                    <h2>Contact Us</h2>
                                    <p>If you have any questions or concerns about our Cookie Policy, please contact us at <Link to="/contact">Contact Us</Link>.</p>
                                    <p>Please note that if you choose to disable cookies, some features of the Website may not function properly, and your user experience may be affected.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">

                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default CookiePolicy