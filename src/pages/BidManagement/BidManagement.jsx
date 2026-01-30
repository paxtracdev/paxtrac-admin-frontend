import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../Components/Breadcrumbs";
import { Pencil } from "lucide-react";
import Swal from "sweetalert2";
import CustomDropdown from "../../Components/CustomDropdown";
import defaultLogo from "../../assets/paxtracFavicon.svg";

const BidManagement = () => {
   
  return (
    <main className="app-content body-bg">
      <section className="container">
        <div className="title-heading mb-2">Bid Management </div>
        <p className="title-sub-heading">
          Manage bid
        </p>

        <Breadcrumbs />

        {/* SINGLE CARD */}
        {/* <div className="custom-card bg-white p-4 mt-3"> 

        </div> */}
      </section>
    </main>
  );
}; 

export default BidManagement;
