import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useLocation } from "react-router-dom";
import Breadcrumbs from "../../Components/Breadcrumbs";

const ViewFaq = () => {
  const { state } = useLocation();
  const faq = state?.faq;

  const [question, setQuestion] = useState(faq?.question || "");
  const [answer, setAnswer] = useState(faq?.answer || "");

  return (
    <main className="app-content body-bg">
      <section className="container">
        <div className="title-heading mb-2">View / Edit FAQ</div>
        <Breadcrumbs />

        <div className="custom-card bg-white p-4">
          <div className="mb-3">
            <label className="form-label">Question</label>
            <input
              className="form-control"
              placeholder="Enter question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Answer</label>
            <Editor
              apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
              init={{ height: 300, menubar: false }}
              onEditorChange={(v) => setAnswer(v)}
            />
          </div>

          <button className="primary-button">Update FAQ</button>
        </div>
      </section>
    </main>
  );
};

export default ViewFaq;
