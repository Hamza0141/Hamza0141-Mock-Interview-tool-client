import { Link } from "react-router-dom";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg-body)] text-[var(--color-text-main)] px-4 py-10">
      <div className="max-w-5xl mx-auto bg-[var(--color-bg-panel)] border border-[var(--color-border)] rounded-2xl shadow-sm p-8 md:p-10 space-y-8">
        {/* Header */}
        <header className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-[var(--color-primary)]">
            SelfMock – Privacy Policy
          </h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            Last updated: January 2025
          </p>
        </header>

        {/* Intro */}
        <section className="space-y-3 text-sm leading-relaxed">
          <p>
            This Privacy Policy explains how{" "}
            <span className="font-semibold">SelfMock</span> (“we”, “us”, or
            “our”) collects, uses, and protects your information when you use
            our AI-powered mock interview and speech training platform.
          </p>
          <p>
            By using SelfMock, you agree to the collection and use of
            information in accordance with this Policy.
          </p>
        </section>

        {/* 1. Information We Collect */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-[var(--color-primary)]">
            1. Information We Collect
          </h2>

          <h3 className="text-sm font-semibold">1.1 Information You Provide</h3>
          <ul className="list-disc pl-5 text-sm space-y-1 leading-relaxed">
            <li>First name and last name</li>
            <li>Email address</li>
            <li>Password (stored only as a hashed value)</li>
            <li>Text responses to interview questions and speech prompts</li>
            <li>
              Feedback you provide to us through questionnaires or support
              tickets
            </li>
          </ul>

          <h3 className="text-sm font-semibold mt-2">
            1.2 Automatically Collected Information
          </h3>
          <ul className="list-disc pl-5 text-sm space-y-1 leading-relaxed">
            <li>Basic device and browser information</li>
            <li>Approximate usage timestamps</li>
            <li>Essential cookies or tokens used for authentication</li>
          </ul>
        </section>

        {/* 2. Audio, Camera & AI Providers */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-[var(--color-primary)]">
            2. Audio, Camera, and AI Processing
          </h2>

          <h3 className="text-sm font-semibold">2.1 Camera</h3>
          <p className="text-sm leading-relaxed">
            SelfMock may request access to your camera to simulate a real
            interview or presentation environment. Camera access is purely for
            user experience; we do not store, transmit, or analyze video beyond
            the active session.
          </p>

          <h3 className="text-sm font-semibold mt-2">
            2.2 Audio & Transcription
          </h3>
          <p className="text-sm leading-relaxed">
            If you choose to answer questions verbally:
          </p>
          <ul className="list-disc pl-5 text-sm space-y-1 leading-relaxed">
            <li>
              Your audio is processed by{" "}
              <span className="font-semibold">OpenAI Whisper API</span> to
              generate a transcript.
            </li>
            <li>
              Raw audio is not stored by SelfMock after transcription is
              completed.
            </li>
            <li>
              The transcript (text) may be stored along with AI-generated
              feedback in your session history.
            </li>
          </ul>

          <p className="text-sm leading-relaxed">
            You can refer to OpenAI’s own terms and privacy documentation for
            further details on how AI models handle data.
          </p>
        </section>

        {/* 3. How We Use Your Data */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-[var(--color-primary)]">
            3. How We Use Your Information
          </h2>
          <ul className="list-disc pl-5 text-sm space-y-1 leading-relaxed">
            <li>To create and manage your SelfMock account</li>
            <li>To generate interview questions and evaluate your responses</li>
            <li>To provide feedback and performance summaries</li>
            <li>To show you your past sessions and improvement history</li>
            <li>To process payments and manage credits (via Stripe)</li>
            <li>To send transactional emails (e.g., OTPs, notifications)</li>
            <li>
              To improve the Service, fix bugs, and maintain platform security
            </li>
          </ul>
        </section>

        {/* 4. Payments & Stripe */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-[var(--color-primary)]">
            4. Payments & Stripe
          </h2>
          <p className="text-sm leading-relaxed">
            Payments on SelfMock are handled through{" "}
            <span className="font-semibold">Stripe</span>, a third-party payment
            processor. We do not store your full payment card information on our
            servers.
          </p>
          <p className="text-sm leading-relaxed">
            We may store non-sensitive payment metadata such as:
          </p>
          <ul className="list-disc pl-5 text-sm space-y-1 leading-relaxed">
            <li>Stripe Payment Intent ID</li>
            <li>Transaction references</li>
            <li>Credit purchase records</li>
          </ul>
          <p className="text-sm leading-relaxed">
            For more information on how payment data is handled, please refer to
            Stripe’s own{" "}
            <a
              href="https://stripe.com/privacy"
              target="_blank"
              rel="noreferrer"
              className="text-[var(--color-primary)] underline"
            >
              Privacy Policy
            </a>
            .
          </p>
        </section>

        {/* 5. Cookies */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-[var(--color-primary)]">
            5. Cookies & Session Tokens
          </h2>
          <p className="text-sm leading-relaxed">
            SelfMock uses cookies in a focused, security-oriented way:
          </p>
          <ul className="list-disc pl-5 text-sm space-y-1 leading-relaxed">
            <li>
              <span className="font-semibold">Authentication cookies:</span> we
              store hashed tokens such as{" "}
              <code className="bg-black/20 px-1 rounded">auth_token</code> or{" "}
              <code className="bg-black/20 px-1 rounded">admin_token</code> to
              identify who is making a request and to maintain your session.
            </li>
            <li>
              <span className="font-semibold">Essential only:</span> we do not
              use cookies for advertising or cross-site tracking.
            </li>
          </ul>
          <p className="text-sm leading-relaxed">
            You can disable cookies in your browser settings, but some features
            of SelfMock may not work correctly without them.
          </p>
        </section>

        {/* 6. Credit Transfers */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-[var(--color-primary)]">
            6. Credit Transfers Between Users
          </h2>
          <p className="text-sm leading-relaxed">
            When you transfer credits to another user:
          </p>
          <ul className="list-disc pl-5 text-sm space-y-1 leading-relaxed">
            <li>
              We use the receiver’s email address to identify their account.
            </li>
            <li>
              The receiver may see your first name in the notification to
              understand who sent the credits.
            </li>
            <li>We log the transfer for integrity and fraud prevention.</li>
          </ul>
        </section>

        {/* 7. Data Sharing */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-[var(--color-primary)]">
            7. Data Sharing & Third Parties
          </h2>
          <p className="text-sm leading-relaxed">
            We do not sell your personal data. We may share limited data with:
          </p>
          <ul className="list-disc pl-5 text-sm space-y-1 leading-relaxed">
            <li>
              Service providers such as OpenAI (for AI processing) and Stripe
              (for payments)
            </li>
            <li>Hosting and infrastructure providers</li>
            <li>
              Authorities, if required by law or to protect our rights and the
              safety of users
            </li>
          </ul>
        </section>

        {/* 8. Data Retention */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-[var(--color-primary)]">
            8. Data Retention
          </h2>
          <p className="text-sm leading-relaxed">
            We retain your basic account details and session history for as long
            as your account is active or as needed to provide the Service.
          </p>
          <p className="text-sm leading-relaxed">
            Certain records (such as payment references or logs) may be retained
            longer to comply with legal, accounting, or security requirements.
          </p>
        </section>

        {/* 9. Security */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-[var(--color-primary)]">
            9. Security
          </h2>
          <p className="text-sm leading-relaxed">
            We use reasonable technical and organizational measures to protect
            your information, including:
          </p>
          <ul className="list-disc pl-5 text-sm space-y-1 leading-relaxed">
            <li>Password hashing</li>
            <li>Secure session tokens and cookies</li>
            <li>
              Limited data retention and minimal storage of sensitive data
            </li>
          </ul>
          <p className="text-sm leading-relaxed">
            However, no system is 100% secure. You are responsible for keeping
            your password and device secure.
          </p>
        </section>

        {/* 10. Your Choices */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-[var(--color-primary)]">
            10. Your Choices & Rights
          </h2>
          <p className="text-sm leading-relaxed">
            Depending on your region, you may have the right to:
          </p>
          <ul className="list-disc pl-5 text-sm space-y-1 leading-relaxed">
            <li>Access certain information we hold about you</li>
            <li>Request corrections to inaccurate information</li>
            <li>
              Request limitation of certain processing, where applicable by law
            </li>
          </ul>
          <p className="text-sm leading-relaxed">
            To exercise these rights, contact us at{" "}
            <a
              href="mailto:hamzaserke@gmail.com"
              className="text-[var(--color-primary)] underline"
            >
              hamzaserke@gmail.com
            </a>
            .
          </p>
        </section>

        {/* 11. Children’s Privacy */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-[var(--color-primary)]">
            11. Children’s Privacy
          </h2>
          <p className="text-sm leading-relaxed">
            SelfMock is not specifically directed to children, and we do not
            knowingly collect date of birth or verify age. If you believe a
            minor is using SelfMock without proper consent, please contact us.
          </p>
        </section>

        {/* 12. Changes & Contact */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-[var(--color-primary)]">
            12. Changes to This Privacy Policy & Contact
          </h2>
          <p className="text-sm leading-relaxed">
            We may update this Privacy Policy from time to time. Updates will be
            posted on this page, and continued use of SelfMock after changes
            means you accept the revised Policy.
          </p>
          <p className="text-sm leading-relaxed">
            If you have questions or concerns about privacy, please contact us
            at{" "}
            <a
              href="mailto:hamzaserke@gmail.com"
              className="text-[var(--color-primary)] underline"
            >
              hamzaserke@gmail.com
            </a>
            .
          </p>
        </section>

        {/* Footer */}
        <footer className="pt-4 border-t border-[var(--color-border)] mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--color-text-muted)]">
          <span>
            © {new Date().getFullYear()} SelfMock. All rights reserved.
          </span>
          <div className="flex gap-3">
            <Link
              to="/terms"
              className="text-[var(--color-primary)] hover:underline"
            >
              Terms &amp; Conditions
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
