import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/Login/LoginPage";
import ProtectedRoute from "./Components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import UserManagement from "./pages/UserManagement/UserManagement"; 
import VotingManagement from "./pages/VotingManagement/VotingManagement";
import Cms from "./pages/CmsManagement/Cms";
import CMSView from "./pages/CmsManagement/CMSView";
import AddCmsPage from "./pages/CmsManagement/AddCmsPage";
import MonetizationManagement from "./pages/MonetizationManagement/MonetizationManagement";
import Analytics from "./pages/Analytics/Analytics";
import NotificationCommunication from "./pages/NotificationCommunication/NotificationCommunication";
import UnderDevelopment from "./pages/UnderDevelopment";
import AddUser from "./pages/UserManagement/AddUser"; 
import ViewUser from "./pages/UserManagement/ViewUser"; 
import ViewVoting from "./pages/VotingManagement/ViewVoting";
import Legal from "./pages/legal";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import FirmManagement from "./pages/EventManagement/FirmManagement";
import AddFirm from "./pages/EventManagement/AddEvent";
import ViewFirm from "./pages/EventManagement/ViewEvent";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="*" element={<NotFound />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/user-management/add-user" element={<AddUser />} />
          <Route path="/user-management/view-user/:id" element={<ViewUser />} />

          <Route path="/firm-management" element={<FirmManagement />} />
          <Route path="/firm-management/add-firm" element={<AddFirm />} />
          <Route
            path="/firm-management/view-firm/:firmId"
            element={<ViewFirm />}
          />

          <Route path="/voting-management" element={<VotingManagement />} />
          <Route
            path="/voting-management/view-vote/:voteId"
            element={<ViewVoting />}
          />

          <Route path="/cms" element={<Cms />} />
          <Route path="/cms/view" element={<CMSView />} />
          <Route path="/cms/add" element={<AddCmsPage />} />
          <Route path="/monetization" element={<MonetizationManagement />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route
            path="/notification-and-communication"
            element={<NotificationCommunication />}
          />
          <Route path="/underdevelopment" element={<UnderDevelopment />} />
          <Route path="/legal" element={<Legal />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
