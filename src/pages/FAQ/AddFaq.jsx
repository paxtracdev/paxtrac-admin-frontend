import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../Components/Breadcrumbs";

const AddFaq = () => {
  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleSubmit = () => {
    console.log({ question, answer });
    navigate("/faq");
  };

  return (
    <main className="app-content body-bg">
      <section className="container">
        <div className="title-heading mb-2">Add FAQ</div>
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

          <button className="primary-button" onClick={handleSubmit}>
            Save FAQ
          </button>
        </div>
      </section>
    </main>
  );
};

export default AddFaq;
