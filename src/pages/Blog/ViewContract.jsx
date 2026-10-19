import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "../../Components/Breadcrumbs";
import { Editor } from "@tinymce/tinymce-react";
import Swal from "sweetalert2";
import { useContractQuery, useUpdateContractMutation } from "../../api/userApi";
import { LoadingComponent } from "../../Components/LoadingComponent";
import { cleanHtmlContent } from "../../utils/cleanHtml";

const CONTRACT_TOKENS = {
  "Listing Agreement": [
    { label: "Client Name ({{client_name}})", value: "{{client_name}}" },
    { label: "Client Address ({{client_address}})", value: "{{client_address}}" },
    { label: "Client Email ({{client_email}})", value: "{{client_email}}" },
    { label: "Client Title ({{client_title}})", value: "{{client_title}}" },
    { label: "Listing IDs ({{listing_ids}})", value: "{{listing_ids}}" },
    { label: "Payment Date ({{payment_date}})", value: "{{payment_date}}" },
    { label: "Plan Name ({{plan_name}})", value: "{{plan_name}}" },
    { label: "Plan Amount ({{plan_amount}})", value: "{{plan_amount}}" },
    { label: "Number of Listings ({{number_of_listings}})", value: "{{number_of_listings}}" },
    { label: "Current Year ({{current_year}})", value: "{{current_year}}" },
  ],
  "Participation Terms for Bidding": [
    { label: "Bidder Name ({{bidder_name}})", value: "{{bidder_name}}" },
    { label: "Bidder Title ({{bidder_title}})", value: "{{bidder_title}}" },
    { label: "Bidder Email ({{bidder_email}})", value: "{{bidder_email}}" },
    { label: "Bidder Address ({{bidder_business_address}})", value: "{{bidder_business_address}}" },
    { label: "Property ID ({{property_id}})", value: "{{property_id}}" },
    { label: "Listing ID ({{listing_id}})", value: "{{listing_id}}" },
    { label: "Property Address ({{property_address}})", value: "{{property_address}}" },
    { label: "Service Category ({{service_category}})", value: "{{service_category}}" },
    { label: "Payment Date ({{payment_date}})", value: "{{payment_date}}" },
    { label: "Current Year ({{current_year}})", value: "{{current_year}}" },
  ],
  "Listing Entity Service Agreement with Property Manager": [
    { label: "Effective Date ({{effective_date}})", value: "{{effective_date}}" },
    { label: "Listing Entity Business ({{listing_entity_business_name}})", value: "{{listing_entity_business_name}}" },
    { label: "Property Address ({{property_address}})", value: "{{property_address}}" },
    { label: "Total Units ({{total_units}})", value: "{{total_units}}" },
    { label: "Winning Bidder Company ({{winning_bidder_company_name}})", value: "{{winning_bidder_company_name}}" },
    { label: "Contract Length ({{contract_length}})", value: "{{contract_length}}" },
    { label: "Contract Start Date ({{contract_start_date}})", value: "{{contract_start_date}}" },
    { label: "Calculated End Date ({{calculated_end_date}})", value: "{{calculated_end_date}}" },
    { label: "Management Fee ({{management_fee}})", value: "{{management_fee}}" },
    { label: "Management Fee Type ({{management_fee_type}})", value: "{{management_fee_type}}" },
    { label: "Leasing Fee ({{leasing_fee}})", value: "{{leasing_fee}}" },
    { label: "Leasing Fee Type ({{leasing_fee_type}})", value: "{{leasing_fee_type}}" },
    { label: "Lease Renewal Fee ({{lease_renewal_fee}})", value: "{{lease_renewal_fee}}" },
    { label: "Property State ({{property_state}})", value: "{{property_state}}" },
    { label: "Services List ({{services_list}})", value: "{{services_list}}" },
    { label: "Written Statement ({{written_statement}})", value: "{{written_statement}}" },
    { label: "Rider Text ({{rider_text}})", value: "{{rider_text}}" },
    { label: "Current Year ({{current_year}})", value: "{{current_year}}" },
  ],
  "Listing Entity Service Agreement with Vendor": [
    { label: "Agreement Date ({{agreement_date}})", value: "{{agreement_date}}" },
    { label: "Listing Entity Business ({{listing_entity_business_name}})", value: "{{listing_entity_business_name}}" },
    { label: "Winning Bidder Company ({{winning_bidder_company_name}})", value: "{{winning_bidder_company_name}}" },
    { label: "Commencement Date ({{commencement_date}})", value: "{{commencement_date}}" },
    { label: "Calculated End Date ({{calculated_end_date}})", value: "{{calculated_end_date}}" },
    { label: "Scope of Work ({{scope_of_work}})", value: "{{scope_of_work}}" },
    { label: "Property State ({{property_state}})", value: "{{property_state}}" },
    { label: "Payment Schedule ({{payment_schedule}})", value: "{{payment_schedule}}" },
    { label: "Rider Text ({{rider_text}})", value: "{{rider_text}}" },
    { label: "Listing Entity Notice Name ({{listing_entity_notice_name}})", value: "{{listing_entity_notice_name}}" },
    { label: "Listing Entity Notice Title ({{listing_entity_notice_title}})", value: "{{listing_entity_notice_title}}" },
    { label: "Listing Entity Notice Address ({{listing_entity_notice_address}})", value: "{{listing_entity_notice_address}}" },
    { label: "Winning Bidder Notice Name ({{winning_bidder_notice_name}})", value: "{{winning_bidder_notice_name}}" },
    { label: "Winning Bidder Notice Title ({{winning_bidder_notice_title}})", value: "{{winning_bidder_notice_title}}" },
    { label: "Winning Bidder Notice Address ({{winning_bidder_notice_address}})", value: "{{winning_bidder_notice_address}}" },
    { label: "Current Year ({{current_year}})", value: "{{current_year}}" },
  ],
};

const ViewContract = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isLoading } = useContractQuery(id);
  const [updateContract, { isLoading: isUpdating }] = useUpdateContractMutation();

  const [title, setTitle] = useState(
    state?.contract?.versions?.[0]?.contractForm ||
    state?.contract?.contractForm ||
    ""
  );
  const [content, setContent] = useState("");

  useEffect(() => {
    if (data?.data) {
      const activeContract = data.data;
      const sortedVersions = (activeContract.versions || [])
        .slice()
        .sort((a, b) => b.version - a.version);
      const contractTitle =
        sortedVersions[0]?.contractForm || activeContract.contractForm || "";
      const contractContent = cleanHtmlContent(sortedVersions[0]?.content || "");
      setTitle(contractTitle);
      setContent(contractContent);
    }
  }, [data]);

  const handleSave = async () => {
    const cleaned = cleanHtmlContent(content.trim());
    if (!cleaned) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Contract content cannot be empty",
        confirmButtonColor: "#a99068",
      });
      return;
    }

    try {
      await updateContract({
        data: { contractForm: title, content: cleaned },
      }).unwrap();

      Swal.fire({
        title: "Success",
        text: "Contract updated successfully",
        icon: "success",
        confirmButtonColor: "#a99068",
      });
      navigate("/contracts");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err?.data?.message || err?.message || "Failed to update contract",
        confirmButtonColor: "#a99068",
      });
    }
  };

  const availableTokens = CONTRACT_TOKENS[title] || Object.values(CONTRACT_TOKENS)[0] || [];

  return (
    <main className="app-content body-bg">
      <section className="container">
        <div className="d-flex justify-content-between mb-4">
          <div>
            <div className="title-heading mb-2">
              {title ? `Contract: ${title}` : "Contract Terms"}
            </div>
            <p className="title-sub-heading">View or update contract content</p>
          </div>
        </div>

        <Breadcrumbs />

        <div className="custom-card bg-white p-4 mt-3">
          {isLoading && !content ? (
            <LoadingComponent isLoading fullScreen />
          ) : (
            <>
              <div className="mb-3">
                <label className="form-label fw-semibold">Contract Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Contract title"
                  value={title}
                  disabled
                  readOnly
                />
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label fw-semibold mb-0">Contract Content</label>
                  <small className="text-muted">
                    Use the <strong>"Insert Dynamic Field"</strong> menu in the editor toolbar to insert live client & property tokens.
                  </small>
                </div>
                <Editor
                  apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                  value={content}
                  init={{
                    height: 480,
                    menubar: true,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "image",
                      "charmap",
                      "preview",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "code",
                      "fullscreen",
                      "insertdatetime",
                      "table",
                      "wordcount",
                    ],
                    toolbar:
                      "undo redo | blocks | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link table | dynamicTokens | removeformat code fullscreen",
                    setup: (editor) => {
                      editor.ui.registry.addMenuButton("dynamicTokens", {
                        text: "Insert Dynamic Field",
                        fetch: (callback) => {
                          const items = availableTokens.map((t) => ({
                            type: "menuitem",
                            text: typeof t === "string" ? t : t.label,
                            onAction: () => {
                              const val = typeof t === "string" ? t : t.value;
                              editor.insertContent(val);
                            },
                          }));
                          callback(items);
                        },
                      });
                    },
                    content_style: ` 
                      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.6; }
                      ::selection {
                        background: #a99068 !important;
                        color: #fff !important;
                      } `,
                  }}
                  onEditorChange={(value) => setContent(value)}
                />
              </div>

              {data?.data?.versions && data.data.versions.length > 1 && (
                <div className="mt-4 pt-3 border-top">
                  <label className="form-label fw-semibold mb-3">Version History</label>
                  <div className="accordion" id="versionAccordion">
                    {data.data.versions.map((version, index) => (
                      <div className="accordion-item" key={version._id || index}>
                        <h2 className="accordion-header" id={`heading${index}`}>
                          <button
                            className={`accordion-button ${index !== 0 ? "collapsed" : ""}`}
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#collapse${index}`}
                          >
                            Version {version.version}
                            <span className="ms-3 text-muted" style={{ fontSize: "0.85rem" }}>
                              ({version.updated ? new Date(version.updated).toLocaleDateString() : "Initial"})
                            </span>
                          </button>
                        </h2>
                        <div
                          id={`collapse${index}`}
                          className={`accordion-collapse collapse ${index === 0 ? "show" : ""}`}
                          data-bs-parent="#versionAccordion"
                        >
                          <div className="accordion-body">
                            <div
                              className="p-3 bg-light rounded"
                              style={{ maxHeight: "300px", overflowY: "auto", fontSize: "14px" }}
                              dangerouslySetInnerHTML={{ __html: cleanHtmlContent(version.content) }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="d-flex gap-3 mt-4">
                <button
                  className="button-secondary"
                  onClick={() => navigate("/contracts")}
                  disabled={isUpdating}
                >
                  Cancel
                </button>
                <button
                  className="primary-button card-btn"
                  onClick={handleSave}
                  disabled={isUpdating}
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default ViewContract;
