import React, { useEffect, useState } from "react";
import Swal from "sweetalert2"; 
import { useGetStripeStatusQuery, useInitiateStripeMutation } from "../Api/stripeApi";

const ConnectStripeButton = () => {
  
  const { data: statusData, refetch } = useGetStripeStatusQuery();
  const [initiateStripe, { isLoading }] = useInitiateStripeMutation();

  const [status, setStatus] = useState("not_connected");

  useEffect(() => {
    if (statusData?.data) {
      const { chargesEnabled, payoutsEnabled } = statusData.data;

      if (chargesEnabled && payoutsEnabled) {
        setStatus("connected");
      } else {
        setStatus("pending");
      }
    }
  }, [statusData]);

  const handleStripeConnect = async () => {
    try {
      const res = await initiateStripe().unwrap();
      window.open(res.data.url, "_blank"); 
      refetch();

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Unable to initiate Stripe onboarding",
        text: err?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <button
      className={`main-secondary-btn w-max ${
        status === "connected" ? "btn-success" : ""
      }`}
      onClick={handleStripeConnect}
      disabled={isLoading || status === "connected"}
    >
      {isLoading
        ? "Connecting..."
        : status === "connected"
        ? "Stripe Connected"
        : status === "pending"
        ? "Continue Stripe Setup"
        : "Connect with Stripe"}
    </button>
  );
};

export default ConnectStripeButton;
