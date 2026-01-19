import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { X } from "lucide-react";

export function CancelReasonModal({ show, onClose, reason }) {
  return (
    <Modal show={show} onHide={onClose} centered>
      <div style={{ padding: "20px", width: "100%", }}>
        <div>
          <p className="cancel-modal-title text-center">
            Reason of cancellation
          </p>
        </div>
        <textarea
          className="form-control"
          value={reason || "No reason provided"}
          placeholder="Enter the Reason of cancellation..."
          readOnly
          rows={4}
        />
      </div>
    </Modal>
  );
}
