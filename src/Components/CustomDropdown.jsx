import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

const CustomDropdown = ({
  options,
  placeholder,
  value,
  onChange,
  disabled,
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedLabel =
    options.find((opt) => opt.value === value)?.label || placeholder;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="custom-select-wrapper position-relative" ref={dropdownRef}>
      <div
        className={`custom-select-box c-pointer ${disabled ? "disabled" : ""}`}
        tabIndex={disabled ? -1 : 0}
        role="button"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((prev) => !prev);
          }
        }}
        onClick={() => !disabled && setOpen(!open)}
      >
        <span>{selectedLabel}</span>
        <ChevronDown size={18} className={`ms-2 ${open ? "rotate-180" : ""}`} />
      </div>

      {open && !disabled && (
        <ul className="custom-dropdown-menu">
          {options.map((opt, idx) => (
            <li
              key={idx}
              className={`custom-dropdown-item ${
                value === opt.value ? "active" : ""
              }`}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;
