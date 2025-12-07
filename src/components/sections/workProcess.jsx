import React from "react";

const processSteps = [
  {
    id: 1,
    title: "Set Your Goal",
    description:
      "Choose whether you want to practice a job interview or a speech, provide your role and job description or topic, and tell Prepare With AI what you’re aiming for.",
  },
  {
    id: 2,
    title: "Practice With AI",
    description:
      "Start a live AI-powered session. Answer realistic questions or deliver your talk while our system listens, evaluates, and guides your performance.",
  },
  {
    id: 3,
    title: "Review & Improve",
    description:
      "Get instant feedback on clarity, structure, confidence, and relevance. See what went well, what needs work, and repeat sessions to track your growth.",
  },
];

const WorkProcess = ({ order, isLampImgTop }) => {
  return (
    <div className="process-wrap ptb-100">
      <div className="container">
        <div className="row align-items-center">
          <div className={`col-lg-6 col-md-6 ${order}`}>
            <div
              className="process-content"
              data-animation="fade-up"
              data-delay={0.1}
            >
              <div className="content-title">
                <div className="sub-title-2">
                  <p>Working Process</p>
                </div>
                <h2>Get interview-ready in 3 simple steps</h2>
                <p>
                  Prepare With AI makes it easy to practice interviews and
                  public speaking. Just set your goal, run a session, and use
                  the feedback to improve with every attempt.
                </p>
              </div>
              <div className="process-item-wrap">
                {processSteps.map((step) => (
                  <div key={step.id} className="process-item">
                    <span>{String(step.id).padStart(2, "0")}</span>
                    <div className="process-info">
                      <h4>{step.title}</h4>
                      <p>{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-lg-6 col-md-6">
            <div
              className="img-wrapper"
              data-animation="fade-zoom-in"
              data-delay={0.1}
            >
              <div className="img-box">
                {isLampImgTop ? (
                  <>
                    <img
                      className="image-box-item"
                      src="/img/AI-Image/about.png"
                      alt="image"
                    />
                    <img
                      className="image-box-item"
                      src="/img/AI-Image/about.png"
                      alt="image"
                    />
                  </>
                ) : (
                  <>
                    <img
                      className="image-box-item"
                      src="/img/AI-Image/andres-siimon.jpg"
                      alt="image"
                    />
                    <img
                      className="image-box-item"
                      src="/img/AI-Image/andres-siimon.jpg"
                      alt="image"
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkProcess;
