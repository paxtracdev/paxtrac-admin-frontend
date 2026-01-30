import { toast } from "sonner";

// Reusable Toast function
const showToast = (message, type = "success") => {
  if (type === "success") {
    toast.success(message, {
      style: {
        background: "#06736a",
        color: "white",
        border: "none",
        right: "6px",
      },
    });
  } else if (type === "error") {
    toast.error(message, {
      style: {
        background: "#993434",
        color: "white",
        border: "none",
        right: "6px",
      },
    });
  } else {
    toast(message, {
      style: {
        background: "#993434",
        color: "white",
        border: "none",
        right: "6px",
      },
    });
  }
};

export default showToast;