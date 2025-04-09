import PropTypes from "prop-types";

const statusConfig = {
  0: {
    text: "All orders",
    color: "bg-amber-100 text-amber-800 border-amber-200",
    icon: "📋",
    tabName: "All orders",
  },
  1: {
    text: "Pending",
    color: "bg-amber-100 text-amber-800 border-amber-200",
    icon: "⏳",
    tabName: "Pending",
  },
  2: {
    text: "Packing",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: "📦",
    tabName: "Packing",
  },
  3: {
    text: "Delivering",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: "🚚",
    tabName: "Delivering",
  },
  5: {
    text: "Pending to feedback",
    color: "bg-pink-100 text-pink-800 border-pink-200",
    icon: "⭐",
    tabName: "Pending to feedback",
  },
  6: {
    text: "Success order",
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
    icon: "🏆",
    tabName: "Success order",
  },
  7: {
    text: "Cancel",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: "↩️",
    tabName: "Cancel",
  },
  8: {
    text: "Bad feedback",
    color: "bg-yellow-100 text-red-800 border-red-200",
    icon: "👎",
    tabName: "Bad feedback",
  },
};

export const OrderStatusTag = ({ statusId }) => {
  const config = statusConfig[statusId] || {
    text: "Unknown",
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: "",
  };

  return (
    <div
      className={`inline-flex items-center px-2 py-1 rounded-sm text-xs border ${config.color}`}
    >
      <span className="mr-1">{config.icon}</span>
      {config.text}
    </div>
  );
};

OrderStatusTag.propTypes = {
  statusId: PropTypes.number.isRequired,
};
