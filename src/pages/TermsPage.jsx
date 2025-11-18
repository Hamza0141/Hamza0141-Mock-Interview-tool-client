import { Link } from "react-router-dom";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg-body)] text-[var(--color-text-main)] px-4 py-10">
      <div className="max-w-5xl mx-auto bg-[var(--color-bg-panel)] border border-[var(--color-border)] rounded-2xl shadow-sm p-8 md:p-10 space-y-8">
        {/* Header */}
        <header className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-[var(--color-primary)]">
            SelfMock – Terms & Conditions
          </h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            Last updated: January 2025 · Operated in the U.S., accessible
            worldwide
          </p>
        </header>

        {/* Intro */}
        <section className="space-y-3 text-sm leading-relaxed">
          <p>
            Welcome to <span className="font-semibold">SelfMock</span> (“we”,
            “us”, or “our”). These Terms &amp; Conditions (“Terms”) govern your
            access to and use of the SelfMock platform, including our website
            and related services (collectively, the “Service”).
          </p>
          <p>
            By creating an account, accessing, or using SelfMock, you agree to
            be bound by these Terms. If you do not agree, you must not use the
            Service.
          </p>
        </section>

        {/* 1. Eligibility */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-[var(--color-primary)]">
            1. Eligibility
          </h2>
          <p className="text-sm leading-relaxed">
            SelfMock does not collect or verify your date of birth. By using the
            Service, you confirm that:
          </p>
          <ul className="list-disc pl-5 text-sm space-y-1 leading-relaxed">
            <li>
              You are legally allowed to use online services in your region.
            </li>
            <li>
              You understand the Service is intended to help users practice job
              interviews, public speaking, and communication skills.
            </li>
            <li>
              If you are under the legal age in your jurisdiction, you are using
              the Service with appropriate consent from a parent, guardian, or
              applicable authority.
            </li>
          </ul>
        </section>

        {/* 2. Service Description */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-[var(--color-primary)]">
            2. Service Description
          </h2>
          <p className="text-sm leading-relaxed">
            SelfMock is an AI-powered practice and training tool. Features may
            include:
          </p>
          <ul className="list-disc pl-5 text-sm space-y-1 leading-relaxed">
            <li>Mock job interviews and AI-generated questions</li>
            <li>Public speech and presentation practice</li>
            <li>AI-based evaluation and feedback on responses</li>
            <li>Audio-to-text transcription using OpenAI Whisper API</li>
            <li>Session history for past interviews and speeches</li>
            <li>Credit-based usage for interviews and speech sessions</li>
            <li>Credit transfers between users via email</li>
          </ul>
          <p className="text-sm leading-relaxed">
            We may update, modify, or discontinue parts of the Service at any
            time without prior notice.
          </p>
        </section>

        {/* 3. Accounts */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-[var(--color-primary)]">
            3. User Accounts
          </h2>
          <p className="text-sm leading-relaxed">
            To use SelfMock, you must create an account by providing:
          </p>
          <ul className="list-disc pl-5 text-sm space-y-1 leading-relaxed">
            <li>First name</li>
            <li>Last name</li>
            <li>Email address</li>
            <li>Password</li>
          </ul>
          <p className="text-sm leading-relaxed">
            You are responsible for keeping your login credentials confidential
            and for all activities under your account.
          </p>
          <p className="text-sm leading-relaxed">
            Account deletion is not yet supported directly within the platform.
            You may contact us at by creating a ticket in your account
            to request changes or discuss data removal options where applicable.
          </p>
        </section>

        {/* 4. Data We Store */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-[var(--color-primary)]">
            4. Data We Store
          </h2>
          <p className="text-sm leading-relaxed">
            SelfMock is designed to store only the minimum data required to
            operate the Service. We store:
          </p>
          <ul className="list-disc pl-5 text-sm space-y-1 leading-relaxed">
            <li>First name and last name</li>
            <li>Email address</li>
            <li>
              Session history (questions asked, your text responses, and AI
              feedback) so you can revisit your improvement over time
            </li>
            <li>
              Payment intent IDs and transaction references from Stripe for
              payment tracking and credit management
            </li>
          </ul>
          <p className="text-sm leading-relaxed">
            We do <span className="font-semibold">not</span> store your card
            numbers, CVV codes, or full payment details on our servers.
          </p>
        </section>

        {/* 5. Camera & Audio */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-[var(--color-primary)]">
            5. Camera & Audio Usage
          </h2>
          <h3 className="text-sm font-semibold">Camera</h3>
          <p className="text-sm leading-relaxed">
            You may optionally enable your camera to simulate a real interview
            or public speaking environment. SelfMock uses the camera only to
            create a more immersive experience. We do not store or analyze your
            video beyond the live session.
          </p>

          <h3 className="text-sm font-semibold mt-2">Audio & Transcription</h3>
          <p className="text-sm leading-relaxed">
            When you answer questions using your voice:
          </p>
          <ul className="list-disc pl-5 text-sm space-y-1 leading-relaxed">
            <li>
              Your audio is sent to{" "}
              <span className="font-semibold">OpenAI Whisper API</span> for
              transcription.
            </li>
            <li>
              Once transcription is complete, the raw audio is deleted from our
              storage and not retained.
            </li>
            <li>
              Only the transcribed text response and AI evaluation may be stored
              in your session history.
            </li>
          </ul>
        </section>

        {/* 6. Payments & Refunds */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-[var(--color-primary)]">
            6. Payments, Credits & Refunds
          </h2>
          <p className="text-sm leading-relaxed">
            All payments are processed through{" "}
            <span className="font-semibold">Stripe</span>. SelfMock itself does
            not store sensitive payment details.
          </p>
          <p className="text-sm leading-relaxed">
            We operate on a credit-based model. Credits are consumed when you
            start interviews or speech sessions.
          </p>
          <ul className="list-disc pl-5 text-sm space-y-1 leading-relaxed">
            <li>
              If the Service is interrupted due to a system error during an
              active session, we may restore the equivalent credits where
              reasonably verifiable.
            </li>
            <li>
              After credits are purchased, monetary refunds are generally not
              provided, to the extent permitted by applicable law. Stripe’s own
              policies on disputes or chargebacks may still apply.
            </li>
          </ul>
        </section>

        {/* 7. Credit Transfers */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-[var(--color-primary)]">
            7. Credit Transfers Between Users
          </h2>
          <p className="text-sm leading-relaxed">
            Users can transfer credits to another registered user by entering
            their email address. When a transfer occurs:
          </p>
          <ul className="list-disc pl-5 text-sm space-y-1 leading-relaxed">
            <li>The receiving user is notified of the transfer.</li>
            <li>
              The receiver may see the sender’s first name to understand who
              sent the credits.
            </li>
            <li>
              Transfers are typically final and non-reversible unless required
              by law or clearly caused by a system error.
            </li>
          </ul>
        </section>

        {/* 8. Cookie Policy */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-[var(--color-primary)]">
            8. Cookie Policy
          </h2>
          <p className="text-sm leading-relaxed">
            SelfMock uses cookies primarily to maintain secure sessions and
            understand who is making a request.
          </p>
          <h3 className="text-sm font-semibold">Types of Cookies We Use</h3>
          <ul className="list-disc pl-5 text-sm space-y-1 leading-relaxed">
            <li>
              <span className="font-semibold">Authentication cookies:</span> we
              store a hashed token (such as{" "}
              <code className="bg-black/20 px-1 rounded">auth_token</code> or{" "}
              <code className="bg-black/20 px-1 rounded">admin_token</code>) to
              securely identify your session and authorize requests.
            </li>
            <li>
              <span className="font-semibold">Essential cookies only:</span> we
              do not use cookies for advertising or behavioral tracking.
            </li>
          </ul>
          <p className="text-sm leading-relaxed">
            By using SelfMock, you consent to the use of these essential
            cookies. You can disable cookies in your browser, but some features
            of the Service may not function correctly if cookies are disabled.
          </p>
        </section>

        {/* 9. AI & No Job Guarantee */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-[var(--color-primary)]">
            9. AI Limitations & No Job Guarantee
          </h2>
          <p className="text-sm leading-relaxed">
            SelfMock uses AI models (including those provided by OpenAI) to
            generate questions, feedback, and evaluations. While we aim to be
            helpful:
          </p>
          <ul className="list-disc pl-5 text-sm space-y-1 leading-relaxed">
            <li>We do not guarantee accuracy or completeness of AI outputs.</li>
            <li>
              We do not guarantee job offers, interview invitations, or
              employment outcomes.
            </li>
            <li>
              You should always apply your own judgment and verify important
              information independently.
            </li>
          </ul>
        </section>

        {/* 10. Interruptions & Liability */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-[var(--color-primary)]">
            10. Service Interruptions & Limitation of Liability
          </h2>
          <p className="text-sm leading-relaxed">
            The Service may be occasionally unavailable due to maintenance,
            updates, or technical issues. We are not liable for:
          </p>
          <ul className="list-disc pl-5 text-sm space-y-1 leading-relaxed">
            <li>
              Loss of data caused by user actions, device failures, or ISPs
            </li>
            <li>Downtime of third-party providers (e.g., OpenAI, Stripe)</li>
            <li>
              Indirect, incidental, or consequential damages arising from the
              use or inability to use the Service
            </li>
          </ul>
          <p className="text-sm leading-relaxed">
            To the fullest extent allowed by law, your exclusive remedy for any
            claim related to the Service is limited to the value of unused
            credits in your account.
          </p>
        </section>

        {/* 11. Governing Law */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-[var(--color-primary)]">
            11. Governing Law
          </h2>
          <p className="text-sm leading-relaxed">
            These Terms are governed by the laws of the{" "}
            <span className="font-semibold">State of Missouri, USA</span>,
            without regard to its conflict-of-laws principles.
          </p>
        </section>

        {/* 12. Changes & Contact */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-[var(--color-primary)]">
            12. Changes to These Terms & Contact
          </h2>
          <p className="text-sm leading-relaxed">
            We may update these Terms from time to time. Changes become
            effective when posted on the website. Your continued use of SelfMock
            after changes are posted means you accept the revised Terms.
          </p>
          <p className="text-sm leading-relaxed">
            For questions about these Terms, please contact us at{" "}
            <a
              href="mailto:hamzaserke@gmail.com"
              className="text-[var(--color-primary)] underline"
            >
              hamzaserke@gmail.com
            </a>
            .
          </p>
        </section>

        {/* Footer links */}
        <footer className="pt-4 border-t border-[var(--color-border)] mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--color-text-muted)]">
          <span>
            © {new Date().getFullYear()} SelfMock. All rights reserved.
          </span>
          <div className="flex gap-3">
            <Link
              to="/privacy"
              className="text-[var(--color-primary)] hover:underline"
            >
              Privacy Policy
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
