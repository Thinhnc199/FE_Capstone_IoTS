import { useState } from "react";
import PropTypes from "prop-types";

export default function FloatingInput({
  label,
  type = "text",
  required = false,
  validateFunc = null,
  errorMessage = "Invalid input",
  ...rest
}) {
  const [error, setError] = useState("");
  const handleChange = (e) => {
    let value = e.target.value;
    // Nếu là input số, chỉ giữ lại các ký tự từ 0-9
    if (type === "tel") {
      value = value.replace(/\D/g, ""); // Loại bỏ mọi ký tự không phải số
    }
    if (label.toLowerCase() === "address") {
      value = value.slice(0, 30); // cắt tối đa 30 ký tự
    }
    if (label.toLowerCase() === "note") {
      value = value.slice(0, 30); // cắt tối đa 30 ký tự
      setError("note.");
    }

    if (required && !value) {
      setError("This field is required.");
    } else if (validateFunc && !validateFunc(value)) {
      setError(errorMessage);
    } else {
      setError("");
    }

    if (rest.onChange) {
      rest.onChange({ target: { value } }); // Trả về giá trị đã lọc
    }
  };
  const handleBlur = (e) => {
    let value = e.target.value;

    if (required && !value) {
      setError("This field is required.");
    } else if (validateFunc && !validateFunc(value)) {
      setError(errorMessage);
    } else {
      setError("");
    }
  };
  return (
    <div className="relative w-full">
      {/* Input */}
      <input
        type={type}
        id={label.replace(/\s+/g, "-").toLowerCase()}
        className={`block rounded px-3 py-3 w-full text-sm text-gray-900 bg-white border border-gray-300
    appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer 
    ${error ? "border-red-500" : ""}`}
        placeholder=" "
        onChange={handleChange}
        onBlur={handleBlur} // 🟢 Thêm sự kiện này
        {...rest}
      />

      {/* Label */}
      <label
        htmlFor={label.replace(/\s+/g, "-").toLowerCase()}
        className="absolute text-sm text-gray-500 -my-1 duration-300 transform -translate-y-4 scale-75 
        top-4 z-10 origin-[0] start-2.5 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 
        peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Hiển thị lỗi */}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

FloatingInput.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  required: PropTypes.bool,
  validateFunc: PropTypes.func,
  errorMessage: PropTypes.string,
};
