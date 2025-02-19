import React from "react";
import { useState } from "react";

import "./InterViewStart.scss";
const InterViewStart = () => {
  return (
    <div className="pg_interviewstart">
      <div className="candidate_info">
        <div
          className="pic_area"
          style={{
            backgroundImage: 'url("/assets/img/home/interview_bg.jpg")',
          }}
        >
          <div className="pic">
            <img alt="candidate img" src="/assets/img/home/dummy_img.jpg" />
          </div>
          <div className="id">ID: 112506748525</div>
        </div>
        <div className="c_info">
          <h5>Faizan Khan</h5>
          <h6>+91 70601-57420</h6>
          <h6 className="break_all">faizankhan99@gmail.com</h6>
          <h6>Riyadh, India</h6>
        </div>
        <div className="grade_time">
          <div className="gt_single">
            <h6>Time</h6>
            <h5>04:50</h5>
          </div>
          <div className="gt_single grade">
            <h6>Grade</h6>
            <h5>
              12 <span>/100</span>
            </h5>
          </div>
        </div>
        <div className="theme_btn btn_fill no_icon text-center all_info">
          All Information
        </div>
      </div>
      <div className="interview_questions">
  <div className="question_card">
    <div className="title">Talk about yourself</div>
    <div className="questions">
      {[
        { key: "general_appearance", label: "General appearance" },
        { key: "physical_structure", label: "Physical Structure" },
        { key: "english_language", label: "English Language" },
      ].map(({ key, label }) => (
        <div className="q_single" key={key}>
          <div className="form_field">
            <h6 className="label">{label}</h6>
            <div className="field_box theme_radio_new">
              <div className="theme_radio_container" style={{ padding: "0px", border: "none" }}>
                {[
                  { id: "bad", label: "Bad" },
                  { id: "acceptable", label: "Acceptable" },
                  { id: "excellent", label: "Excellent" },
                ].map(({ id, label }) => (
                  <div className="radio_single" key={key + "_" + id} style={{ display: "flex", alignItems: "center" }}>
                    <input type="radio" name={key} value={id} id={key + "_" + id} />
                    <label htmlFor={key + "_" + id}>{label}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>

  <div className="question_card">
    <div className="title">Have you ever worked during the Hajj season?</div>
    <div className="questions">
      <div className="q_single">
        <div className="form_field">
          <h6 className="label">Experience in Hajj and crowds</h6>
          <div className="field_box theme_radio_new">
            <div className="theme_radio_container" style={{ padding: "0px", border: "none" }}>
              {[
                { id: "onthetrain", label: "On the train" },
                { id: "inhajj", label: "In Hajj" },
                { id: "thereisnotany", label: "There isn't any" },
              ].map(({ id, label }) => (
                <div className="radio_single" key={"hajj_" + id} style={{ display: "flex", alignItems: "center" }}>
                  <input type="radio" name="hajj_work" value={id} id={"hajj_" + id} />
                  <label htmlFor={"hajj_" + id}>{label}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div className="question_card">
    <div className="title">Can you work in the sun for 9 hours straight?</div>
    <div className="questions">
      <div className="q_single">
        <div className="form_field">
          <h6 className="label">Withstand working pressure</h6>
          <div className="field_box theme_radio_new">
            <div className="theme_radio_container" style={{ padding: "0px", border: "none" }}>
              {[
                { id: "bad", label: "Bad" },
                { id: "acceptable", label: "Acceptable" },
                { id: "excellent", label: "Excellent" },
              ].map(({ id, label }) => (
                <div className="radio_single" key={"working_pressure_" + id} style={{ display: "flex", alignItems: "center" }}>
                  <input type="radio" name="working_pressure" value={id} id={"working_pressure_" + id} />
                  <label htmlFor={"working_pressure_" + id}>{label}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

    </div>
  );
};

export default InterViewStart;
