
import React from "react";
import { Link } from "react-router-dom";
// import PageHeader from "@/components/sections/pageHeader.jsx";

const PrivacyPolicy = () => {
  return (
    <>
      {/* <PageHeader
        className={"sbg-6"}
        currentPage={"Privacy Policy"}
        title={"Privacy Policy"}
      /> */}

      <div className="cookie-section ptb-100">
        <div className="container">
          <div className="row">
            {/* Main content */}
            <div className="col-lg-8">
              <div className="cookie-content">
                {/* Intro */}
                <div className="pera-list">
                  <p className="text">
                    Last updated: January 2025
                  </p>
                  <p>
                    This Privacy Policy explains how <b>Prepare With AI</b>{" "}
                    (“we”, “us”, or “our”) collects, uses, and protects your
                    information when you use our AI-powered mock interview and
                    speech training platform.
                  </p>
                  <p>
                    By using Prepare With AI, you agree to the collection and
                    use of information in accordance with this Policy.
                  </p>
                </div>

                {/* 1. Information We Collect */}
                <div className="pera-list">
                  <h2>1. Information We Collect</h2>
                  <p>
                    We collect only the information needed to operate, secure,
                    and improve the Prepare With AI platform.
                  </p>

                  <h2>1.1 Information You Provide</h2>
                  <ul className="style-2">
                    <li>First name and last name</li>
                    <li>Email address</li>
                    <li>Password (stored only as a hashed value)</li>
                    <li>
                      Text responses to interview questions and speech prompts
                    </li>
                    <li>
                      Feedback you provide to us through questionnaires or
                      support tickets
                    </li>
                  </ul>

                  <h2>1.2 Information Collected Automatically</h2>
                  <ul className="style-2">
                    <li>Basic device and browser information</li>
                    <li>Approximate usage timestamps</li>
                    <li>
                      Essential cookies or tokens used for authentication and
                      session security
                    </li>
                  </ul>
                </div>

                {/* 2. Audio, Camera & AI Processing */}
                <div className="pera-list">
                  <h2>2. Audio, Camera &amp; AI Processing</h2>

                  <h2>2.1 Camera</h2>
                  <p>
                    Prepare With AI may request access to your camera to
                    simulate a real interview or presentation environment.
                    Camera access is used only to enhance your experience. We do
                    not store, transmit, or analyze video beyond the active
                    session.
                  </p>

                  <h2>2.2 Audio &amp; Transcription</h2>
                  <p>If you choose to answer questions verbally:</p>
                  <ul className="style-2">
                    <li>
                      Your audio is processed by <b>OpenAI Whisper API</b> to
                      generate a transcript.
                    </li>
                    <li>
                      Raw audio is not stored by Prepare With AI after
                      transcription is completed.
                    </li>
                    <li>
                      The transcript (text) may be stored along with
                      AI-generated feedback in your session history.
                    </li>
                  </ul>
                  <p>
                    You can refer to OpenAI’s documentation for more details on
                    how their AI models handle data.
                  </p>
                </div>

                {/* 3. How We Use Your Information */}
                <div className="pera-list">
                  <h2>3. How We Use Your Information</h2>
                  <ul className="style-2">
                    <li>To create and manage your Prepare With AI account</li>
                    <li>
                      To generate interview questions and evaluate your
                      responses
                    </li>
                    <li>To provide feedback and performance summaries</li>
                    <li>
                      To show you your past sessions and improvement history
                    </li>
                    <li>To process payments and manage credits (via Stripe)</li>
                    <li>To send transactional emails (e.g., OTPs, notices)</li>
                    <li>
                      To improve the Service, fix bugs, and maintain platform
                      security
                    </li>
                  </ul>
                </div>

                {/* 4. Payments & Stripe */}
                <div className="pera-list">
                  <h2>4. Payments &amp; Stripe</h2>
                  <p>
                    Payments on Prepare With AI are handled by <b>Stripe</b>, a
                    third-party payment processor. We do not store your full
                    payment card information on our servers.
                  </p>
                  <p>We may store limited payment metadata such as:</p>
                  <ul className="style-2">
                    <li>Stripe Payment Intent IDs</li>
                    <li>Transaction references</li>
                    <li>Credit purchase records</li>
                  </ul>
                  <p>
                    For more information on how payment data is handled, please
                    refer to Stripe’s{" "}
                    <a
                      href="https://stripe.com/privacy"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Privacy Policy
                    </a>
                    .
                  </p>
                </div>

                {/* 5. Cookies & Session Tokens */}
                <div className="pera-list">
                  <h2>5. Cookies &amp; Session Tokens</h2>
                  <p>Prepare With AI uses cookies in a limited way:</p>
                  <ul className="style-2">
                    <li>
                      <b>Authentication cookies:</b> we store hashed tokens such
                      as <code>auth_token</code> or <code>admin_token</code> to
                      identify who is making a request and to keep you logged
                      in.
                    </li>
                    <li>
                      <b>Essential only:</b> we do not use cookies for
                      advertising or cross-site tracking.
                    </li>
                  </ul>
                  <p>
                    You can disable cookies in your browser settings, but some
                    features of Prepare With AI may not work correctly without
                    them.
                  </p>
                  <p>
                    For more details, please see our{" "}
                    <Link to="/cookie-policy">Cookie Policy</Link>.
                  </p>
                </div>

                {/* 6. Credit Transfers */}
                <div className="pera-list">
                  <h2>6. Credit Transfers Between Users</h2>
                  <p>When you transfer credits to another user:</p>
                  <ul className="style-2">
                    <li>
                      We use the receiver’s email address to identify their
                      account.
                    </li>
                    <li>
                      The receiver may see your first name in the notification
                      to understand who sent the credits.
                    </li>
                    <li>
                      We log the transfer for integrity and fraud prevention.
                    </li>
                  </ul>
                </div>

                {/* 7. Data Sharing */}
                <div className="pera-list">
                  <h2>7. Data Sharing &amp; Third Parties</h2>
                  <p>
                    We do not sell your personal data. We may share data with:
                  </p>
                  <ul className="style-2">
                    <li>
                      Service providers such as OpenAI (for AI processing) and
                      Stripe (for payments)
                    </li>
                    <li>Hosting and infrastructure providers</li>
                    <li>
                      Authorities, where required by law or to protect our
                      rights and the safety of users
                    </li>
                  </ul>
                </div>

                {/* 8. Data Retention */}
                <div className="pera-list">
                  <h2>8. Data Retention</h2>
                  <p>
                    We retain your basic account details and session history for
                    as long as your account is active or as needed to provide
                    the Service.
                  </p>
                  <p>
                    Certain records (such as payment references or logs) may be
                    retained longer to comply with legal, accounting, or
                    security requirements.
                  </p>
                </div>

                {/* 9. Security */}
                <div className="pera-list">
                  <h2>9. Security</h2>
                  <p>
                    We use reasonable technical and organizational measures:
                  </p>
                  <ul className="style-2">
                    <li>Password hashing</li>
                    <li>Secure session tokens and cookies</li>
                    <li>
                      Minimal storage of sensitive data and limited retention
                    </li>
                  </ul>
                  <p>
                    However, no system is 100% secure. You are responsible for
                    keeping your password and device secure.
                  </p>
                </div>

                {/* 10. Your Rights */}
                <div className="pera-list">
                  <h2>10. Your Choices &amp; Rights</h2>
                  <p>Depending on your region, you may have the right to:</p>
                  <ul className="style-2">
                    <li>Access certain information we hold about you</li>
                    <li>Request corrections to inaccurate information</li>
                    <li>
                      Request limitation of certain processing, where allowed by
                      law
                    </li>
                  </ul>
                  <p>
                    To exercise these rights, contact us at{" "}
                    <a href="mailto:support@prepwithai.net">
                      support@prepwithai.net
                    </a>
                    .
                  </p>
                </div>

                {/* 11. Children’s Privacy */}
                <div className="pera-list">
                  <h2>11. Children’s Privacy</h2>
                  <p>
                    Prepare With AI is not specifically directed to children,
                    and we do not knowingly collect date of birth or verify age.
                    If you believe a minor is using Prepare With AI without
                    proper consent, please contact us.
                  </p>
                </div>

                {/* 12. Changes & Contact */}
                <div className="pera-list">
                  <h2>12. Changes to This Policy &amp; Contact</h2>
                  <p>
                    We may update this Privacy Policy from time to time. Any
                    updates will be posted on this page, and continued use of
                    Prepare With AI after changes means you accept the revised
                    Policy.
                  </p>
                  <p>
                    If you have questions or concerns about privacy, please
                    contact us at{" "}
                    <a href="mailto:support@prepwithai.net">
                      support@prepwithai.net
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar / empty column */}
            <div className="col-lg-4">{/* reserved for future widgets */}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
