import { useLocation } from "react-router-dom";

const useBreadcrumbs = () => {
  const location = useLocation();

  // Split the pathname into an array
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Generate breadcrumbs
  const breadcrumbs = pathnames.map((value, index) => {
    // Check if this is the last segment and we have a pageName in state
    const isLastSegment = index === pathnames.length - 1;
    const hasPageName = location.state?.pageName && isLastSegment;
    
    // Format the label for display
    let formattedLabel;
    let isClickable = true; // Track if breadcrumb should be clickable
    
    if (hasPageName) {
      // Use the page name from state and format it
      formattedLabel = location.state.pageName
        .replace(/-/g, " ") // Replace "-" with space
        .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word
    } else {
      // Check if this looks like a MongoDB ID (24 hex characters)
      const isMongoId = /^[a-f\d]{24}$/i.test(value);
      
      if (isMongoId) {
        return null;
      } else {
        formattedLabel = decodeURIComponent(value)
          .replace(/-/g, " ") // Replace "-" with space
          .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word
        
        // Make "Details" segments non-clickable
        if (formattedLabel.toLowerCase() === "details") {
          isClickable = false;
        }
      }
    }

    // Construct clean path
    let path = `/${pathnames.slice(0, index + 1).join("/")}`;

    return { label: formattedLabel, path, isClickable };
  }).filter(Boolean); // Remove null entries (MongoDB IDs)

  // Ensure first breadcrumb is always "Dashboard"
  if (!breadcrumbs.some((crumb) => crumb.label.toLowerCase() === "dashboard")) {
    breadcrumbs.unshift({ label: "Dashboard", path: "/dashboard", isClickable: true });
  }

  return breadcrumbs;
};

export default useBreadcrumbs;
