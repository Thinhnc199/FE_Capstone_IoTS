import PropTypes from "prop-types";

export default function FloatingInput({
  label,
  type = "text",
  isTextarea = false,
  ...rest
}) {
  return (
    <div className="relative w-full">
      {/* Input */}

      {isTextarea ? (
        <textarea
          id={label.replace(/\s+/g, "-").toLowerCase()}
          className="block rounded px-3 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-white
          border  border-gray-300 appearance-none focus:outline-none focus:ring-0 
          focus:border-blue-600 peer resize-none h-24"
          placeholder=" "
          {...rest}
        ></textarea>
      ) : (
        <input
          type={type}
          id={label.replace(/\s+/g, "-").toLowerCase()} // Chuyển label thành id hợp lệ
          className="block rounded px-3  pb-2.5 pt-5 w-full text-sm text-gray-900 bg-white
        border  border-gray-300 appearance-none focus:outline-none focus:ring-0 
        focus:border-blue-600 peer "
          placeholder=" "
          {...rest} // Nhận thêm props như placeholder, value, onChange,...
        />
      )}

      {/* Label */}
      <label
        htmlFor={label.replace(/\s+/g, "-").toLowerCase()}
        className="absolute text-sm text-gray-500  p-1 duration-300 transform -translate-y-4 scale-75 
        top-4 z-10 origin-[0] start-2.5 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 
        peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
      >
        {label}
      </label>
    </div>
  );
}

// ✅ PropTypes kiểm tra dữ liệu đầu vào
FloatingInput.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  isTextarea: PropTypes.bool,
};
