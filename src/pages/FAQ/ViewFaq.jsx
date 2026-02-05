import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useLocation, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../Components/Breadcrumbs";

const ViewFaq = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const faq = state?.faq;

  const [question, setQuestion] = useState(faq?.question || "");
  const [answer, setAnswer] = useState(faq?.answer || "");
  const [errors, setErrors] = useState({
    question: "",
    answer: "",
  });

  const handleSubmit = async () => {
    let newErrors = {
      question: "",
      answer: "",
    };

    if (!question.trim()) {
      newErrors.question = "Question is required";
    }

    if (!answer || !answer.replace(/<[^>]*>/g, "").trim()) {
      newErrors.answer = "Answer is required";
    }

    setErrors(newErrors);

    if (newErrors.question || newErrors.answer) return;

    const result = await Swal.fire({
      title: "Update FAQ?",
      text: "Are you sure you want to update this FAQ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, update",
      confirmButtonColor: "#a99068",
    });

    if (!result.isConfirmed) return;

    console.log({ question, answer });

    await Swal.fire({
      title: "Updated!",
      text: "FAQ has been updated successfully.",
      icon: "success",
      confirmButtonColor: "#a99068",
    });

    navigate("/faq");
  };

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
              onChange={(e) => {
                const value = e.target.value;
                setQuestion(value);
                setErrors((prev) => ({
                  ...prev,
                  question: value.trim() ? "" : "Question is required",
                }));
              }}
            />
            {errors.question && (
              <div className="text-danger">{errors.question}</div>
            )}
          </div>

          <div className="mb-4">
            <label className="form-label">Answer</label>
            <Editor
              apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
              init={{ height: 300, menubar: false }}
              onEditorChange={(v) => {
                setAnswer(v);

                const plainText = v.replace(/<[^>]*>/g, "").trim();

                setErrors((prev) => ({
                  ...prev,
                  answer: plainText ? "" : "Answer is required",
                }));
              }}
            />
            {errors.answer && (
              <div className="text-danger">{errors.answer}</div>
            )}
          </div>

          <button className="primary-button" onClick={handleSubmit}>
            Update FAQ
          </button>
        </div>
      </section>
    </main>
  );
};

export default ViewFaq;
