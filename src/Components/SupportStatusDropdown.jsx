import Select from "react-select";

export default function SupportStatusDropdown(params) {
  const {
    value,
    node,
    data,
    options,
    lockAfter = null,
    onChange,
  } = params;

  const selected = options.find((o) => o.value === value) || options[0];

  const statusColors = {
    pending: { bg: "#fff7db", text: "#EE973D" },
    resolved: { bg: "#d1fae5", text: "#065f46" },
  };

  const colors = statusColors[selected.value] || statusColors.pending;

  const customStyles = {
    control: (base) => ({
      ...base,
      minHeight: 32,
      height: 32,
      borderRadius: 10,
      backgroundColor: colors.bg,
      border: "none",
      boxShadow: "none",
      cursor: "pointer",
      fontSize: 13,
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
  };

  const handleChange = (opt) => {
    if (opt.value === value) return;
    if (lockAfter && value === lockAfter) return;

    onChange?.(opt.value, data, node);
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
