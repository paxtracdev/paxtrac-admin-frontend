import Select from "react-select";
import Swal from "sweetalert2";
export default function StatusDropdownCell(params) {
  const {
    value,
    node,
    options = [
      { value: "pending", label: "Pending" },
      { value: "completed", label: "Completed" },
      { value: "cancelled", label: "Cancelled" },
    ],
    lockAfter = null, // e.g. "resolved"
  } = params;

  const selected = options.find((o) => o.value === value) || options[0];
  const statusColors = {
    pending: {
      border: "#ffffff",
      bg: "#fff7db",
      text: "#EE973D",
    },
    completed: {
      border: "#ffffff",
      bg: "#e9f9ef",
      text: "#2ea44f",
    },
    cancelled: {
      border: "#ffffff",
      bg: "#ffecec",
      text: "#e53935",
    },
    resolved: {
      border: "#ffffff",
      bg: "#d1fae5",
      text: "#065f46",
    },
  };
  const customStyles = {
    control: (base) => ({
      ...base,
      minHeight: 32,
      height: 32,
      borderRadius: 10,
      backgroundColor: colors.bg,
      boxShadow: "none",
      cursor: "pointer",
      fontSize: 13,
      border: "none",
    }),
    singleValue: (base) => ({
      ...base,
      color: colors.text,
      fontWeight: 600,
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: colors.text,
      padding: 6,
    }),
    indicatorSeparator: () => ({ display: "none" }),
    option: (base, state) => ({
      ...base,
      cursor: "pointer",
    }),
  };

  const colors = statusColors[selected.value] || statusColors.pending;

  const handleChange = async (opt) => {
    if (opt.value === value) return;

    if (lockAfter && value === lockAfter) return;

    const result = await Swal.fire({
      title: "Confirm Status Change",
      text: `Change status to "${opt.label}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, confirm",
      confirmButtonColor: "#a99068",
    });

    if (result.isConfirmed) {
      node.setDataValue("status", opt.value);

      Swal.fire({
        title: "Updated",
        text: "Status updated successfully",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div
      style={{
        width: 140,
        pointerEvents: lockAfter && value === lockAfter ? "none" : "auto",
        opacity: lockAfter && value === lockAfter ? 0.6 : 1,
      }}
    >
      <Select
        value={selected}
        options={options}
        styles={customStyles}
        isSearchable={false}
        onChange={handleChange}
        menuPortalTarget={document.body}
        menuPosition="fixed"
      />
    </div>
  );
}
