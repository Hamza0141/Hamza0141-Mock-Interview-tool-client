// src/pages/TermsConditions.jsx
import React from "react";
import { Link } from "react-router-dom";
// import PageHeader from "@/components/sections/pageHeader.jsx";

const TermsConditions = () => {
  return (
    <>
      {/* <PageHeader
        className={"sbg-6"}
        currentPage={"Terms & Conditions"}
        title={"Terms & Conditions"}
      /> */}

      <div className="cookie-section ptb-100">
        <div className="container">
          <div className="row">
            {/* Main content */}
            <div className="col-lg-8">
              <div className="cookie-content">
                {/* Intro */}
                <div className="pera-list">
                  <p className="text-muted">
                    <p>Last updated: January 2025 · Operated in the U.S.</p>
                  </p>
                  <p>
                    Welcome to <b>Prepare With AI</b> (“we”, “us”, or “our”).
                    These Terms &amp; Conditions (“Terms”) govern your access to
                    and use of the Prepare With AI platform, including our
                    website and related services (collectively, the “Service”).
                  </p>
                  <p>
                    By creating an account, accessing, or using Prepare With AI,
                    you agree to be bound by these Terms. If you do not agree,
                    you must not use the Service.
                  </p>
                </div>

                {/* 1. Eligibility */}
                <div className="pera-list">
                  <h2>1. Eligibility</h2>
                  <p>
                    Prepare With AI does not collect or verify your date of
                    birth. By using the Service, you confirm that:
                  </p>
                  <ul className="style-2">
                    <li>
                      You are legally allowed to use online services in your
                      region.
                    </li>
                    <li>
                      You understand the Service is intended to help users
                      practice job interviews, public speaking, and
                      communication skills.
                    </li>
                    <li>
                      If you are under the legal age in your jurisdiction, you
                      are using the Service with appropriate consent from a
                      parent, guardian, or applicable authority.
                    </li>
                  </ul>
                </div>

                {/* 2. Service Description */}
                <div className="pera-list">
                  <h2>2. Service Description</h2>
                  <p>
                    Prepare With AI is an AI-powered practice and training tool.
                    Features may include:
                  </p>
                  <ul className="style-2">
                    <li>Mock job interviews and AI-generated questions</li>
                    <li>Public speech and presentation practice</li>
                    <li>AI-based evaluation and feedback on responses</li>
                    <li>
                      Audio-to-text transcription using OpenAI Whisper API
                    </li>
                    <li>Session history for past interviews and speeches</li>
                    <li>
                      Credit-based usage for interviews and speech sessions
                    </li>
                    <li>Credit transfers between users via email</li>
                  </ul>
                  <p>
                    We may update, modify, or discontinue parts of the Service
                    at any time without prior notice.
                  </p>
                </div>

                {/* 3. User Accounts */}
                <div className="pera-list">
                  <h2>3. User Accounts</h2>
                  <p>
                    To use Prepare With AI, you must create an account using:
                  </p>
                  <ul className="style-2">
                    <li>First name</li>
                    <li>Last name</li>
                    <li>Email address</li>
                    <li>Password</li>
                  </ul>
                  <p>
                    You are responsible for keeping your login credentials
                    confidential and for all activities that occur under your
                    account.
                  </p>
                  <p>
                    Account deletion is not yet supported directly within the
                    platform. You may contact us (for example, by creating a
                    support ticket) to request changes or discuss data removal
                    options where applicable.
                  </p>
                </div>

                {/* 4. Data We Store */}
                <div className="pera-list">
                  <h2>4. Data We Store</h2>
                  <p>
                    Prepare With AI is designed to store only the minimum data
                    required to operate the Service. We store:
                  </p>
                  <ul className="style-2">
                    <li>First name and last name</li>
                    <li>Email address</li>
                    <li>
                      Session history (questions asked, your text responses, and
                      AI feedback)
                    </li>
                    <li>
                      Payment intent IDs and transaction references from Stripe
                      for payment tracking and credit management
                    </li>
                  </ul>
                  <p>
                    We do <b>not</b> store your card numbers, CVV codes, or full
                    payment details on our servers.
                  </p>
                  <p>
                    For more details on privacy, please see our{" "}
                    <Link to="/privacy">Privacy Policy</Link>.
                  </p>
                </div>

                {/* 5. Camera & Audio */}
                <div className="pera-list">
                  <h2>5. Camera &amp; Audio Usage</h2>
                  <h2>Camera</h2>
                  <p>
                    You may optionally enable your camera to simulate a real
                    interview or public speaking environment. We use the camera
                    only to create a more immersive experience and do not store
                    or analyze your video beyond the live session.
                  </p>
                  <h2>Audio &amp; Transcription</h2>
                  <p>When you answer questions using your voice:</p>
                  <ul className="style-2">
                    <li>
                      Your audio is sent to <b>OpenAI Whisper API</b> for
                      transcription.
                    </li>
                    <li>
                      Once transcription is complete, the raw audio is deleted
                      from our storage and not retained.
                    </li>
                    <li>
                      Only the transcribed text response and AI evaluation may
                      be stored in your session history.
                    </li>
                  </ul>
                </div>

                {/* 6. Payments, Credits & Refunds */}
                <div className="pera-list">
                  <h2>6. Payments, Credits &amp; Refunds</h2>
                  <p>
                    All payments are processed through <b>Stripe</b>. Prepare
                    With AI does not store sensitive payment details.
                  </p>
                  <p>
                    We operate on a credit-based model. Credits are consumed
                    when you start interviews or speech sessions.
                  </p>
                  <ul className="style-2">
                    <li>
                      If the Service is interrupted due to a system error during
                      an active session, we may restore the equivalent credits
                      where reasonably verifiable.
                    </li>
                    <li>
                      After credits are purchased, monetary refunds are
                      generally not provided, to the extent permitted by
                      applicable law. Stripe’s own dispute and chargeback
                      processes may still apply.
                    </li>
                  </ul>
                </div>

                {/* 7. Credit Transfers */}
                <div className="pera-list">
                  <h2>7. Credit Transfers Between Users</h2>
                  <p>
                    Users can transfer credits to another registered user by
                    entering their email address. When a transfer occurs:
                  </p>
                  <ul className="style-2">
                    <li>The receiving user is notified of the transfer.</li>
                    <li>
                      The receiver may see the sender’s first name to understand
                      who sent the credits.
                    </li>
                    <li>
                      Transfers are typically final and non-reversible unless
                      required by law or clearly caused by a system error.
                    </li>
                  </ul>
                </div>

                {/* 8. Cookies */}
                <div className="pera-list">
                  <h2>8. Cookie Policy</h2>
                  <p>
                    Prepare With AI uses cookies primarily to maintain secure
                    sessions and understand who is making a request.
                  </p>
                  <h2>Types of Cookies We Use</h2>
                  <ul className="style-2">
                    <li>
                      <b>Authentication cookies:</b> hashed tokens such as{" "}
                      <code>auth_token</code> or <code>admin_token</code> to
                      securely identify your session.
                    </li>
                    <li>
                      <b>Essential cookies only:</b> we do not use cookies for
                      advertising or behavioral tracking.
                    </li>
                  </ul>
                  <p>
                    By using Prepare With AI, you consent to these essential
                    cookies. You can disable cookies in your browser, but some
                    features of the Service may not function correctly.
                  </p>
                  <p>
                    For more details, see our{" "}
                    <Link to="/cookie-policy">Cookie Policy</Link>.
                  </p>
                </div>

                {/* 9. AI Limitations */}
                <div className="pera-list">
                  <h2>9. AI Limitations &amp; No Job Guarantee</h2>
                  <p>
                    Prepare With AI uses AI models (including those provided by
                    OpenAI) to generate questions, feedback, and evaluations.
                    While we aim to be helpful:
                  </p>
                  <ul className="style-2">
                    <li>
                      We do not guarantee accuracy or completeness of AI
                      outputs.
                    </li>
                    <li>
                      We do not guarantee job offers, interviews, or employment
                      outcomes.
                    </li>
                    <li>
                      You should always apply your own judgment and verify
                      important information independently.
                    </li>
                  </ul>
                </div>

                {/* 10. Interruptions & Liability */}
                <div className="pera-list">
                  <h2>
                    10. Service Interruptions &amp; Limitation of Liability
                  </h2>
                  <p>The Service may be unavailable at times due to:</p>
                  <ul className="style-2">
                    <li>Maintenance, updates, or technical issues</li>
                    <li>Downtime or outages affecting third-party providers</li>
                  </ul>
                  <p>We are not liable for:</p>
                  <ul className="style-2">
                    <li>
                      Loss of data caused by user actions, device failures, or
                      internet providers
                    </li>
                    <li>
                      Downtime of third-party providers (e.g., OpenAI, Stripe)
                    </li>
                    <li>
                      Indirect, incidental, or consequential damages related to
                      use or inability to use the Service
                    </li>
                  </ul>
                  <p>
                    To the fullest extent allowed by law, your exclusive remedy
                    for any claim related to the Service is limited to the value
                    of unused credits in your account.
                  </p>
                </div>

                {/* 11. Governing Law */}
                <div className="pera-list">
                  <h2>11. Governing Law</h2>
                  <p>
                    These Terms are governed by the laws of the{" "}
                    <b>State of Missouri, USA</b>, without regard to its
                    conflict-of-law principles.
                  </p>
                </div>

                {/* 12. Changes & Contact */}
                <div className="pera-list">
                  <h2>12. Changes to These Terms &amp; Contact</h2>
                  <p>
                    We may update these Terms from time to time. Changes become
                    effective when posted on the website. Your continued use of
                    Prepare With AI after changes are posted means you accept
                    the revised Terms.
                  </p>
                  <p>
                    For questions about these Terms, please contact us at{" "}
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

export default TermsConditions;
