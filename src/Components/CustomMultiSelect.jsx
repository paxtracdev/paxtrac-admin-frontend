import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, X } from "lucide-react";

const CustomMultiSelect = ({ options, placeholder, value = [], onChange }) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleSelect = (val) => {
    let updated;

    if (value.includes(val)) {
      updated = value.filter((v) => v !== val);
    } else {
      updated = [...value, val];
    }

    onChange(updated); // sends array back to parent
  };

  const removeItem = (val) => {
    onChange(value.filter((v) => v !== val));
  };

  return (
    <div className="custom-multi-wrapper position-relative" ref={wrapperRef}>
      {/* Selected Box */}
      <div className="custom-multi-box" onClick={() => setOpen(!open)}>
        {value.length === 0 ? (
          <span className="multiSelect-placeholder">{placeholder}</span>
        ) : (
          <div className="selected-chip-container">
            {value.map((val) => {
              const label = options.find((o) => o.value === val)?.label;
              return (
                <div className="chip" key={val}>
                  {label}
                  <X
                    size={14}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(val);
                    }}
                  />
                </div>
              );
            })}
          </div>
        )}

        <ChevronDown
          size={18}
          className={`dropdown-icon ${open ? "rotate-180" : ""}`}
        />
      </div>

      {/* Dropdown */}
      {open && (
        <ul className="custom-multi-dropdown">
          {options
            .filter((opt) => !value.includes(opt.value)) // REMOVE selected items
            .map((opt) => (
              <li
                key={opt.value}
                className="dropdown-item"
                onClick={() => toggleSelect(opt.value)}
              >
                {opt.label}
              </li>
            ))}

            {options.filter(opt => !value.includes(opt.value)).length === 0 && (
  <li className="dropdown-item text-muted">No more options</li>
)}
        </ul>
      )}
    </div>
  );
};

export default CustomMultiSelect;
