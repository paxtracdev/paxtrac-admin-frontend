import { Link } from "react-router-dom";
import useBreadcrumbs from "../hooks/useBreadcrumbs"; // Adjust path if needed

const Breadcrumbs = () => {
  const breadcrumbs = useBreadcrumbs();

  return (
    <nav className="breadcrumb">
      {breadcrumbs.map((crumb, index) => (
        <span key={crumb.path}>
          {index !== 0 && " > "}
          {index === breadcrumbs.length - 1 || crumb.isClickable === false ? (
            <span className="active-breadcrumb">{crumb.label}</span>
          ) : (
            <Link className="parent-breadcrumb" to={crumb.path}>
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
