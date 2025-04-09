import PropTypes from "prop-types";
import { Tabs } from "antd";

const { TabPane } = Tabs;

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

export const OrderTabs = ({ statusFilter, onChange, totalCount, children }) => (
  <Tabs
    defaultActiveKey="0"
    activeKey={statusFilter || "0"}
    onChange={onChange}
    tabPosition="top"
    className="px-6 pt-2"
    tabBarStyle={{ marginBottom: 0 }}
  >
    {Object.entries(statusConfig).map(([key, config]) => (
      <TabPane
        key={key}
        tab={
          <div className="flex items-center px-3 py-2">
            <span className="mr-2">{config.icon}</span>
            <span>{config.tabName}</span>
            {totalCount > 0 && key === (statusFilter || "0") && (
              <span className="ml-2 bg-gray-200 text-gray-800 rounded-full px-2 py-0.5 text-xs">
                {totalCount}
              </span>
            )}
          </div>
        }
      >
        {children}
      </TabPane>
    ))}
  </Tabs>
);

OrderTabs.propTypes = {
  statusFilter: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  totalCount: PropTypes.number,
  children: PropTypes.node.isRequired,
};
