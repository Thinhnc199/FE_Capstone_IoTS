import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStatisticStore } from "../../redux/slices/dashboardSlice";
import DynamicBreadcrumb from "../common/DynamicBreadcrumb";
import {
  Row,
  Col,
  Card,
  Select,
  Typography,
  Spin,
  message,
  Statistic,
} from "antd";

import CountUp from "react-countup";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import dayjs from "dayjs";
import {
  ShoppingCartOutlined,
  MessageOutlined,
  DollarOutlined,
  TagsOutlined,
  MobileOutlined,
  ExperimentOutlined,
} from "@ant-design/icons";
const { Option } = Select;
const { Title } = Typography;
const formatter = (value) => <CountUp end={value} separator="," />;
export default function DashBoardStore() {
  const dispatch = useDispatch();
  const { dataStatistic, loading } = useSelector((state) => state.statistics);

  const [year, setYear] = useState(dayjs().year());
  const [month, setMonth] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];
  const BAR_COLORS = ["#8884d8", "#82ca9d", "#FFBB28"];

  const yearOptions = Array.from({ length: 7 }, (_, i) => 2024 + i);
  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);

  useEffect(() => {
    const requestData = month ? { year, month } : { year };

    dispatch(getStatisticStore(requestData)).catch((error) => {
      message.warning("Failed to fetch statistics: " + error.message);
    });
  }, [dispatch, year, month]);

  const getBarChartData = () => {
    if (!dataStatistic?.statisticProducts) return [];

    return dataStatistic.statisticProducts.map((item) => ({
      name: item.time,
      devices: item.devices,
      combos: item.combos,
      labs: item.labs,
    }));
  };

  const getPieChartData = () => {
    if (!dataStatistic) return [];

    const {
      totalOrders,
      totalSuccessOrders,
      totalCancelledOrders,
      totalIncludedBadFeedbackOrders,
    } = dataStatistic;

    const otherOrders =
      totalOrders -
      totalSuccessOrders -
      totalCancelledOrders -
      totalIncludedBadFeedbackOrders;

    return [
      { name: "Success", value: totalSuccessOrders },
      { name: "Cancelled", value: totalCancelledOrders },
      { name: "Bad Feedback", value: totalIncludedBadFeedbackOrders },
      { name: "Other", value: otherOrders > 0 ? otherOrders : 0 },
    ].filter((item) => item.value > 0);
  };

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  return (
    <div className="container mx-auto pb-8 ">
      <div className=" max-w-6xl mb-4 ">
        <DynamicBreadcrumb />
      </div>
      <div className="max-w-6xl mb-6">
        <Title level={3} className="text-gray-800">
          Dashboard
        </Title>
        {/* <p className="font-medium text-3xl ">👋Hi, vietle!</p> */}
      </div>
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <Select value={year} onChange={setYear} className="w-28">
            {yearOptions.map((year) => (
              <Option key={year} value={year}>
                {year}
              </Option>
            ))}
          </Select>

          <Select
            value={month}
            onChange={(value) => setMonth(value || null)}
            className="w-32"
            placeholder="All months"
            allowClear
          >
            {monthOptions.map((month) => (
              <Option key={month} value={month}>
                {dayjs()
                  .month(month - 1)
                  .format("MMMM")}
              </Option>
            ))}
          </Select>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* Summary Statistics */}
          {/* <Row gutter={[16, 16]} className="mb-6">
            {[
              {
                title: "Total Orders",
                value: dataStatistic?.totalOrders,
                icon: (
                  <ShoppingCartOutlined className="text-3xl text-green-500" />
                ),
              },
              {
                title: "Total Feedbacks",
                value: dataStatistic?.totalFeedbacks,
                icon: <MessageOutlined className="text-3xl text-purple-500" />,
              },
              {
                title: "Total Revenues",
                value: dataStatistic?.totalRevenue * 1000 || 0,
                icon: <DollarOutlined className="text-3xl text-yellow-500" />,
              },
            ].map((item, index) => (
              <Col xs={24} sm={12} md={6} key={index}>
                <Card
                  className="h-full transition-all duration-300 hover:shadow-md"
                  bodyStyle={{ padding: "16px" }}
                >
                  <div className="flex  items-center justify-between  flex-row text-center">
                    <div className="flex flex-col justify-center items-start gap-2">
                      <span className="text-gray-600">{item.title}</span>
                      <Statistic
                        value={item.value || 0}
                        valueStyle={{ fontSize: "20px", fontWeight: 500 }}
                        precision={2}
                        formatter={formatter}
                      />
                    </div>
                    <span className="text-blue-500">{item.icon}</span>
                  </div>
                </Card>
              </Col>
            ))}
          </Row> */}
          {/* Summary Statistics */}
          <Row gutter={[16, 16]} className="mb-6">
            {[
              {
                title: "Total Orders",
                value: dataStatistic?.totalOrders,
                icon: (
                  <ShoppingCartOutlined className="text-3xl text-blue-500" />
                ),
                suffix: "",
              },
              {
                title: "Active Combos",
                value: dataStatistic?.totalActiveCombos,
                icon: <TagsOutlined className="text-3xl text-purple-500" />,
                suffix: "",
              },
              {
                title: "Active Devices",
                value: dataStatistic?.totalActiveDevices,
                icon: <MobileOutlined className="text-3xl text-green-500" />,
                suffix: "",
              },
              {
                title: "Active Labs",
                value: dataStatistic?.totalActiveLabs,
                icon: (
                  <ExperimentOutlined className="text-3xl text-orange-500" />
                ),
                suffix: "",
              },
              {
                title: "Total Feedbacks",
                value: dataStatistic?.totalFeedbacks,
                icon: <MessageOutlined className="text-3xl text-cyan-500" />,
                suffix: "",
              },
              {
                title: "Total Revenue",
                value: dataStatistic?.totalRevenue * 1000 || 0,
                icon: <DollarOutlined className="text-3xl text-yellow-500" />,
                suffix: "đ",
              },
            ].map((item, index) => (
              <Col xs={24} sm={12} md={8} lg={6} xl={4} key={index}>
                <Card
                  className="h-full transition-all duration-300 hover:shadow-md"
                  bodyStyle={{ padding: "16px" }}
                >
                  <div className="flex items-center justify-between flex-row text-center">
                    <div className="flex flex-col justify-center items-start gap-2">
                      <span className="text-gray-600 text-sm">
                        {item.title}
                      </span>
                      <Statistic
                        value={item.value || 0}
                        valueStyle={{ fontSize: "20px", fontWeight: 500 }}
                        precision={item.title.includes("Revenue") ? 2 : 0}
                        formatter={formatter}
                        suffix={item.suffix}
                      />
                    </div>
                    <span
                      className="p-2 bg-opacity-20 rounded-full"
                      style={{
                        backgroundColor: `${
                          item.icon.props.className.match(/text-(.*?)-500/)[1]
                        }20`,
                      }}
                    >
                      {item.icon}
                    </span>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
          {/* Charts */}
          <Row gutter={[16, 16]}>
            {/* Bar Chart */}
            <Col xs={24} md={16}>
              <Card
                title="Product Statistics"
                className="h-full"
                bodyStyle={{ padding: "16px" }}
              >
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getBarChartData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "8px",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                        }}
                      />
                      <Legend />
                      <Bar
                        dataKey="devices"
                        fill={BAR_COLORS[0]}
                        name="Devices"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="combos"
                        fill={BAR_COLORS[1]}
                        name="Combos"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="labs"
                        fill={BAR_COLORS[2]}
                        name="Labs"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>

            {/* Pie Chart - Đã sửa */}
            <Col xs={24} md={8}>
              <Card
                title="Order Distribution"
                className="h-full"
                bodyStyle={{ padding: "16px" }}
              >
                <div className="flex flex-col items-center h-full">
                  <div className="w-full h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          activeIndex={activeIndex}
                          data={getPieChartData()}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          onMouseEnter={onPieEnter}
                          onMouseLeave={() => setActiveIndex(null)}
                          paddingAngle={2}
                        >
                          {getPieChartData().map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                              stroke="#fff"
                              strokeWidth={activeIndex === index ? 2 : 1}
                              style={{
                                transition: "all 0.3s",
                                opacity:
                                  activeIndex === null || activeIndex === index
                                    ? 1
                                    : 0.7,
                                filter:
                                  activeIndex === index
                                    ? "drop-shadow(0px 0px 5px rgba(0, 0, 0, 0.2))"
                                    : "none",
                              }}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value, name) => [
                            `${value} orders`,
                            `${name}`,
                          ]}
                          contentStyle={{
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                          }}
                        />
                        <Legend
                          wrapperStyle={{ paddingTop: "20px" }}
                          formatter={(value, entry, index) => (
                            <span className="text-gray-700">
                              {value}: {getPieChartData()[index].value}
                            </span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}
