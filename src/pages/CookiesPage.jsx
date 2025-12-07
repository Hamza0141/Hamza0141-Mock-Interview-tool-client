// import PageHeader from "@/components/sections/pageHeader.jsx";
import React from "react";
import { Link } from "react-router-dom";

const CookiePolicy = () => {
  return (
    <>
      {/* <PageHeader
        className={"sbg-6"}
        currentPage={"Cookie Policy"}
        title={"Cookie Policy"}
      /> */}
      <div className="cookie-section ptb-100">
        <div className="container">
          <div className="row">
            {/* Main content */}
            <div className="col-lg-8">
              <div className="cookie-content">
                {/* What are cookies */}
                <div className="pera-list">
                  <h2>What Are Cookies?</h2>
                  <p>
                    Cookies are small text files that are stored on your device
                    when you visit a website. They help websites remember who
                    you are between page loads or visits, making it possible to
                    keep you logged in, remember preferences, and improve your
                    overall experience.
                  </p>
                  <p>
                    On <b>Prepare With AI</b>, we use cookies in a limited and
                    security-focused way to support account access and core
                    functionality.
                  </p>
                </div>

                {/* Notice box */}
                <div className="notice">
                  <div className="row align-items-center">
                    <div className="col-lg-2">
                      <div className="icon">
                        <i className="bx bx-cookie" />
                      </div>
                    </div>
                    <div className="col-lg-10">
                      <p>
                        We primarily use cookies to keep your session secure and
                        to understand which account is making a request. We do
                        <b> not</b> use cookies for advertising or cross-site
                        tracking.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Types of cookies */}
                <div className="pera-list">
                  <h2>Types of Cookies We Use</h2>
                  <ul className="style-2">
                    <li>
                      <b>Essential / Authentication Cookies:</b> These cookies
                      are required for the website and app to function properly.
                      They help us:
                      <ul className="style-2" style={{ marginTop: "8px" }}>
                        <li>Keep you signed in to your account.</li>
                        <li>
                          Securely associate your actions with your user
                          profile.
                        </li>
                        <li>
                          Protect access to your interview and speech sessions.
                        </li>
                      </ul>
                      <p style={{ marginTop: "8px" }}>
                        Examples include hashed tokens such as{" "}
                        <code>auth_token</code> or <code>admin_token</code>.
                        These values do not contain your password or raw
                        credentials.
                      </p>
                    </li>
                    <li>
                      <b>Basic Performance / Security Cookies:</b> These may
                      help us understand basic usage (for example, whether you
                      remain logged in) and protect against misuse, fraud, or
                      suspicious activity.
                    </li>
                  </ul>
                  <p>
                    We do <b>not</b> use cookies for marketing, interest-based
                    advertising, or cross-site tracking.
                  </p>
                </div>

                {/* Third-party cookies */}
                <div className="pera-list">
                  <h2>Third-Party Cookies</h2>
                  <p>
                    Some features in Prepare With AI may rely on third-party
                    services, such as:
                  </p>
                  <ul className="style-2">
                    <li>
                      <b>Stripe</b> – for secure payment processing and credit
                      purchases.
                    </li>
                    <li>
                      <b>Hosting / infrastructure providers</b> – for reliable
                      delivery of the website and app.
                    </li>
                  </ul>
                  <p>
                    These third parties may place their own cookies in your
                    browser when you interact with their embedded services. We
                    do not control these cookies and recommend reviewing their
                    respective privacy or cookie policies for more information.
                  </p>
                </div>

                {/* Managing cookies */}
                <div className="pera-list">
                  <h2>Managing Cookies</h2>
                  <p>
                    You can manage or disable cookies through your browser
                    settings. Most browsers allow you to:
                  </p>
                  <ul className="style-2">
                    <li>View which cookies are stored on your device.</li>
                    <li>Delete existing cookies.</li>
                    <li>
                      Block some or all cookies for specific websites or
                      entirely.
                    </li>
                  </ul>
                  <p>
                    Please note that if you disable essential cookies, some
                    features of <b>Prepare With AI</b> may not function
                    correctly, such as:
                  </p>
                  <ul className="style-2">
                    <li>Staying logged in to your account.</li>
                    <li>Accessing your interviews and speech sessions.</li>
                    <li>Managing or using your credits.</li>
                  </ul>
                </div>

                {/* Changes to Cookie Policy */}
                <div className="pera-list">
                  <h2>Changes to This Cookie Policy</h2>
                  <p>
                    We may update this Cookie Policy from time to time, for
                    example when we introduce new features or integrate new
                    third-party services. Any changes will be posted on this
                    page with an updated effective date.
                  </p>
                  <p>
                    Your continued use of Prepare With AI after updates are
                    posted means you accept the revised Cookie Policy.
                  </p>
                </div>

                {/* Contact */}
                <div className="pera-list">
                  <h2>Contact Us</h2>
                  <p>
                    If you have any questions or concerns about this Cookie
                    Policy or how cookies are used on Prepare With AI, please
                    contact us at{" "}
                    <a href="mailto:support@prepwithai.net">
                      support@prepwithai.net
                    </a>{" "}
                    or visit our <Link to="/contact">Contact page</Link>.
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar (empty / future use) */}
            <div className="col-lg-4"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CookiePolicy;
