import React, { useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useLocation, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../Components/Breadcrumbs";
import { useFaqQuery } from "../../api/userApi";
import { useParams } from "react-router-dom";
import { useUpdateFaqMutation } from "../../api/userApi";
import Swal from "sweetalert2";
import { LoadingComponent } from "../../Components/LoadingComponent";

const ViewFaq = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: faqData, isLoading } = useFaqQuery(id);
  const faq = faqData?.data;
  const [updateFaq, { isLoading: isUpdating }] = useUpdateFaqMutation();

  const [question, setQuestion] = useState();
  const [answer, setAnswer] = useState();
  const [errors, setErrors] = useState({
    question: "",
    answer: "",
  });

  useEffect(() => {
    if (faqData) {
      setQuestion(faqData?.data?.question);
      setAnswer(faqData?.data?.answer);
    }
  }, [faqData]);
  const handleSubmit = async () => {
    const result = await Swal.fire({
      title: "Update FAQ?",
      text: "Are you sure you want to update this FAQ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, update",
      confirmButtonColor: "#a99068",
    });

    if (!result.isConfirmed) return;
    try {
      // Call the updateFaq mutation
      await updateFaq({ id, question, answer }).unwrap();

      await Swal.fire({
        title: "Updated!",
        text: "FAQ has been updated successfully.",
        icon: "success",
        confirmButtonColor: "#a99068",
      });

      navigate("/faq");
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error?.data?.message || "Failed to update FAQ",
        icon: "error",
        confirmButtonColor: "#a99068",
      });
    }
  };
  if (isLoading) return <LoadingComponent isLoading fullScreen />;

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
              value={answer}
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
