import React from "react";
import { useState } from "react";
import "./InterViewStart.scss";

const InterViewStart = () => {
  const [grade, setGrade] = useState(60);
  const [timer, setTimer] = useState("01:25");

  const questionsData = [
    {
      title: "Talk about yourself",
      questions: [
        {
          label: "General appearance",
          type: "buttons",
          options: ["Bad", "Acceptable", "Excellent"],
        },
        {
          label: "Physical structure",
          type: "buttons",
          options: ["Bad", "Acceptable", "Excellent"],
        },
        {
          label: "English language",
          type: "buttons",
          options: ["Bad", "Acceptable", "Excellent"],
        },
        {
          label: "General knowledge",
          type: "buttons",
          options: ["Bad", "Acceptable", "Excellent"],
        },
        {
          label: "Function",
          type: "buttons",
          options: [
            "Other",
            "University student",
            "Leadership job",
            "Doctor",
            "Teacher",
          ],
        },
      ],
    },
    {
      title: "Have you ever worked during the Hajj season?",
      questions: [
        {
          label: "Experience in hajj and crowds",
          type: "buttons",
          options: ["On the train", "In Hajj", "There isn't any"],
        },
      ],
    },
    {
      title: "Can you work in the sun for 9 hours straight?",
      questions: [
        {
          label: "Withstand working pressure",
          type: "buttons",
          options: ["Bad", "Acceptable", "Excellent"],
        },
      ],
    },  
  ];

  const [activeButtons, setActiveButtons] = useState({});
  const [textInputs, setTextInputs] = useState({});

  const handleButtonClick = (questionIndex, optionIndex) => {
    setActiveButtons((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleInputChange = (questionIndex, value) => {
    setTextInputs((prev) => ({ ...prev, [questionIndex]: value }));
  };


  // General recommandation 

  const [suitableForJob, setSuitableForJob] = useState(null);
  const [reason, setReason] = useState(null);
  const [jobNominated, setJobNominated] = useState(null);
  const [leadershipPosition, setLeadershipPosition] = useState(null);
  const [proposedPosition, setProposedPosition] = useState(null);
  const [reviews, setReviews] = useState("");

  return (
    <div className="interview_container">
      <div className="left">
        <div className="timer">{`${timer}`}</div>
        <div className="final_grade">
          <h6>Final Grade</h6>
          <h5>
            {grade} <span>/100</span>
          </h5>
        </div>
        <div className="candidate-info">
          <div className="pic_area">
            <div className="pic">
              <img
                className="candidate-photo"
                src="/assets/img/home/client_img_6.jpg"
                alt="candidate-photo"
              />
            </div>
            <button className="theme_btn">Full Size</button>
          </div>
          <div className="info">
            <p>
              <b>Name:</b> Full Size
            </p>
            <p>
              <b>ID Number:</b> 1125067452
            </p>
            <p>
              <b>Nationality:</b> Saudi
            </p>
            <button className="theme_btn w-100">All Information</button>
          </div>
        </div>
      </div>
      <div className="right">
        <div className="questions_container">
          {questionsData.map((qSingle, qIndex) => (
            <div className="q_single" key={qIndex}>
              <h3 className="title">
                {qSingle.title}
                <div className="dot"></div>
              </h3>
              {qSingle.questions.map((question, questionIndex) => (
                <div className="question" key={questionIndex}>
                <div className="q_left">
                <h6>{question.label}</h6>
                </div>
                <div className="q_right">
                {question.type === "buttons" && (
                    <div className="button_group">
                      {question.options.map((option, optionIndex) => (
                        <button
                          key={optionIndex}
                          className={`theme_btn ${
                            activeButtons[`${qIndex}-${questionIndex}`] ===
                            optionIndex
                              ? "active"
                              : ""
                          }`}
                          onClick={() =>
                            handleButtonClick(
                              `${qIndex}-${questionIndex}`,
                              optionIndex
                            )
                          }
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                  {question.type === "select" && (
                    <select
                      value={textInputs[`${qIndex}-${questionIndex}`] || ""}
                      onChange={(e) =>
                        handleInputChange(
                          `${qIndex}-${questionIndex}`,
                          e.target.value
                        )
                      }
                    >
                      <option value="" disabled>
                        Select an option
                      </option>
                      {question.options.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  )}
                  {question.type === "textarea" && (
                    <textarea
                      value={textInputs[`${qIndex}-${questionIndex}`] || ""}
                      onChange={(e) =>
                        handleInputChange(
                          `${qIndex}-${questionIndex}`,
                          e.target.value
                        )
                      }
                    />
                  )}
                </div>
                </div>
              ))}
            </div>
          ))}
           <div className="q_single">
        <h3 className="title">General recommendation</h3>

        {/* Is the candidate suitable for the job */}
        <div className="question">
         <div className="q_left">
         <h6>Is the candidate suitable for the job?</h6>
         </div>
        <div className="q_right">
        <div className="button_group">
            {["Yes", "No"].map((option) => (
              <button
                key={option}
                className={`theme_btn ${suitableForJob === option ? "active" : ""}`}
                onClick={() => setSuitableForJob(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        </div>

        {/* Reason - Show only when "No" is selected */}
        {suitableForJob === "No" && (
          <div className="question">
          <div className="q_left">
          <h6>Reason</h6>
          </div>
           <div className="q_right">
           <div className="button_group">
              {["Other", "Nationality does not match", "Age does not match"].map((option) => (
                <button
                  key={option}
                  className={`theme_btn ${reason === option ? "active" : ""}`}
                  onClick={() => setReason(option)}
                >
                  {option}
                </button>
              ))}
            </div>
           </div>
          </div>
        )}

        {/* Job nominated - Show only when "Yes" is selected */}
        {suitableForJob === "Yes" && (
          <div className="question">
           <div className="q_left">
           <h6>Job nominated</h6>
           </div>
          <div className="q_right">
          <div className="button_group">
              {["Station Pier", "Entrance gates and waiting area"].map((option) => (
                <button
                  key={option}
                  className={`theme_btn ${jobNominated === option ? "active" : ""}`}
                  onClick={() => setJobNominated(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          </div>
        )}

        {/* Is he nominated for a leadership position? - Show only when "Yes" is selected */}
        {suitableForJob === "Yes" && (
          <div className="question">
         <div className="q_left">
         <h6>Is he nominated for a leadership position?</h6>
         </div>
          <div className="q_right">
          <div className="button_group">
              {["No", "Yes"].map((option) => (
                <button
                  key={option}
                  className={`theme_btn ${leadershipPosition === option ? "active" : ""}`}
                  onClick={() => setLeadershipPosition(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          </div>
        )}

        {/* Proposed position - Show only when "Job nominated" is "Entrance gates and waiting area" */}
        {jobNominated === "Entrance gates and waiting area" && (
          <div className="question">
        <div className="q_left">
        <h6>Proposed position</h6>
        </div>
          <div className="q_right">
          <select value={proposedPosition || ""} onChange={(e) => setProposedPosition(e.target.value)}>
              <option value="" disabled>Select an option</option>
              <option value="Waiting area agent">Waiting area agent</option>
              <option value="Access control agent">Access control agent</option>
            </select>
          </div>
          </div>
        )}
          {/* Reviews */}
{(suitableForJob === "Yes"  || suitableForJob === "No")  && (
      
        <div className="question">
         <div className="q_left">
         <h6>Reviews</h6>
         </div>
         <div className="q_right">
         <textarea value={reviews} onChange={(e) => setReviews(e.target.value)} />
         </div>

        </div>
        )}
      </div>
        </div>
        <div className="action_btn">
          <button className="theme_btn " style={{
            marginRight:"8px"
          }}>
            Cancel
          </button>
          <button className="theme_btn fill">
End of Interview
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterViewStart;
