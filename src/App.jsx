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
import NotificationCommunication from "./pages/Announcements/Announcements";
import UnderDevelopment from "./pages/UnderDevelopment";
import AddUser from "./pages/UserManagement/AddUser";
import ViewUser from "./pages/UserManagement/ViewUser";
import ViewVoting from "./pages/VotingManagement/ViewVoting";
import Legal from "./pages/legal";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import PropertyManagement from "./pages/PropertyManagement/PropertyManagement";
import ViewProperty from "./pages/PropertyManagement/ViewProperty"; 
import BlogList from "./pages/Blog/BlogList";
import AddBlog from "./pages/Blog/AddBlog";
import ViewBlog from "./pages/Blog/ViewBlog";
import VlogList from "./pages/Vlog/VlogList";
import AddVlog from "./pages/Vlog/AddVlog";
import ViewVlog from "./pages/Vlog/ViewVlog";
import FaqList from "./pages/FAQ/FaqList";
import AddFaq from "./pages/FAQ/AddFaq";
import ViewFaq from "./pages/FAQ/ViewFaq";
import Setting from "./pages/AccountSettings/Setting";
import Support from "./pages/Support/Support";
import PlatformSettings from "./pages/PlatformSettings/PlatformSettings";
import Review from "./pages/Review/Review";
import VendorManagement from "./pages/VendorManagement/VendorManagement";
import VendorView from "./pages/VendorManagement/VendorView";
import Analytics from "./pages/Analytics/Analytics";
import IssueResolution from "./pages/IssueResolution/IssueResolution";
import IssueResolutionView from "./pages/IssueResolution/IssueResolutionView";
import BidManagement from "./pages/BidManagement/BidManagement";
import AccoountSetting from "./pages/AccountSettings/Setting";
import AllNotification from "./Components/AllNotification";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="*" element={<NotFound />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="/user-management/add-user" element={<AddUser />} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/user-management/view-user" element={<ViewUser />} /> 
          
          <Route path="/vendor-management" element={<VendorManagement />} />
          <Route path="/vendor-management/view" element={<VendorView />} /> 

          <Route path="/bid-management" element={<BidManagement />} /> 

          <Route path="/blogs" element={<BlogList />} />
          <Route path="/blogs/add" element={<AddBlog />} />
          <Route path="/blogs/view" element={<ViewBlog />} />

          <Route path="/vlogs" element={<VlogList />} />
          <Route path="/vlogs/add" element={<AddVlog />} />
          <Route path="/vlogs/view" element={<ViewVlog />} />
          
          <Route path="/faq" element={<FaqList />} />
          <Route path="/faq/add" element={<AddFaq />} />
          <Route path="/faq/view" element={<ViewFaq />} />

          <Route path="/reviews" element={<Review />} /> 
          
          <Route path="/account-settings" element={<AccoountSetting />} />
          <Route path="/platform-settings" element={<PlatformSettings />} />
          <Route path="/support" element={<Support />} />

          <Route path="/property-management" element={<PropertyManagement />} />
          <Route
            path="/property-management/view-property"
            element={<ViewProperty />}
          />

          <Route path="/voting-management" element={<VotingManagement />} />
          <Route
            path="/voting-management/view-vote/:voteId"
            element={<ViewVoting />}
          />

          
          <Route path="/issue-resolution" element={<IssueResolution />} />
          <Route path="/issueresolution/view" element={<IssueResolutionView />} /> 

          <Route path="/policies" element={<Cms />} />
          <Route path="/policies/view" element={<CMSView />} />
          <Route path="/policies/add" element={<AddCmsPage />} />
          <Route path="/monetization" element={<MonetizationManagement />} />
          <Route path="/analytics" element={<Analytics />} /> 
          <Route path="/all-notification" element={<AllNotification />} />
          <Route
            path="/announcements"
            element={<NotificationCommunication />}
          />
          <Route path="/underdevelopment" element={<UnderDevelopment />} />
          <Route path="/legal" element={<Legal />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
