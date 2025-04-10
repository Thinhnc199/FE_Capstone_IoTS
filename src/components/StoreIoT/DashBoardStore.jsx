import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DynamicBreadcrumb from "../common/DynamicBreadcrumb";
import { getStatisticStore } from "../../redux/slices/dashboardSlice";

import {
  Row,
  Col,
  Card,
  Statistic,
  Table,
  List,
  Avatar,
  Tabs,
  Button,
  DatePicker,
  Drawer,
  Form,
  Input,
  Select,
  Space,
} from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
const { Option } = Select;
export default function DashBoardStore() {
  const dispatch = useDispatch();
  // const { dataStatistic } = useSelector((state) => state.statistic);
  const [totalSales, setTotalSales] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [userTotal, setUserTotal] = useState(0);
  const onChange = (key) => {
    console.log(key);
  };
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    // Fake API calls to fetch data
    // dispatch(getStatisticStore({ startDate, endDate }));
    setUserTotal(246); // Replace with actual API call
    setTotalSales(123); // Replace with actual API call
    setTotalRevenue(45678); // Replace with actual API call
    setPendingOrders(12); // Replace with actual API call
  }, [dispatch]);

  const data = [
    { name: "Jan", sales: 4000, revenue: 2400 },
    { name: "Feb", sales: 3000, revenue: 1398 },
    { name: "Mar", sales: 2000, revenue: 9800 },
    { name: "Apr", sales: 2780, revenue: 3908 },
    { name: "May", sales: 1890, revenue: 4800 },
    { name: "Jun", sales: 2390, revenue: 3800 },
    { name: "Jul", sales: 3490, revenue: 4300 },
  ];

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Sales",
      dataIndex: "sales",
      key: "sales",
    },
    {
      title: "Revenue",
      dataIndex: "revenue",
      key: "revenue",
    },
  ];
  const items = [
    {
      key: "1",
      label: "View all",
    },
    {
      key: "2",
      label: "Most recent",
    },
    {
      key: "3",
      label: "Popular",
    },
    // {
    //   key: "3",
    //   label: "Popular",
    //   children: "Content of Tab Pane 3",
    // },
  ];
  const tableData = data.map((item, index) => ({ key: index, ...item }));

  const topPerformers = [
    {
      name: "Norman Mohrbacher",
      role: "UI Designer",
    },
    {
      name: "Leeann Monnet",
      role: "Web Developer",
    },
    {
      name: "Kathe Rahimi",
      role: "Marketing Team",
    },
    {
      name: "Kathe Rahimi",
      role: "Marketing Team",
    },
    {
      name: "Kathe Rahimi",
      role: "Marketing Team",
    },
  ];

  return (
    <div className="container mx-auto pb-8">
      <div className="  ">
        <div className=" max-w-6xl mb-4 ">
          <DynamicBreadcrumb />
        </div>
        <div className="flex items-center justify-between">
          <p className="font-medium text-3xl ">👋Hi, vietle!</p>
          <>
            <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
              New account
            </Button>
            <Drawer
              title="Create a new account"
              width={720}
              onClose={onClose}
              open={open}
              styles={{
                body: {
                  paddingBottom: 80,
                },
              }}
              extra={
                <Space>
                  <Button onClick={onClose}>Cancel</Button>
                  <Button onClick={onClose} type="primary">
                    Submit
                  </Button>
                </Space>
              }
            >
              <Form layout="vertical" hideRequiredMark>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="name"
                      label="Name"
                      rules={[
                        {
                          required: true,
                          message: "Please enter user name",
                        },
                      ]}
                    >
                      <Input placeholder="Please enter user name" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="url"
                      label="Url"
                      rules={[
                        {
                          required: true,
                          message: "Please enter url",
                        },
                      ]}
                    >
                      <Input
                        style={{
                          width: "100%",
                        }}
                        addonBefore="http://"
                        addonAfter=".com"
                        placeholder="Please enter url"
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="owner"
                      label="Owner"
                      rules={[
                        {
                          required: true,
                          message: "Please select an owner",
                        },
                      ]}
                    >
                      <Select placeholder="Please select an owner">
                        <Option value="xiao">Xiaoxiao Fu</Option>
                        <Option value="mao">Maomao Zhou</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="type"
                      label="Type"
                      rules={[
                        {
                          required: true,
                          message: "Please choose the type",
                        },
                      ]}
                    >
                      <Select placeholder="Please choose the type">
                        <Option value="private">Private</Option>
                        <Option value="public">Public</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="approver"
                      label="Approver"
                      rules={[
                        {
                          required: true,
                          message: "Please choose the approver",
                        },
                      ]}
                    >
                      <Select placeholder="Please choose the approver">
                        <Option value="jack">Jack Ma</Option>
                        <Option value="tom">Tom Liu</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="dateTime"
                      label="DateTime"
                      rules={[
                        {
                          required: true,
                          message: "Please choose the dateTime",
                        },
                      ]}
                    >
                      <DatePicker.RangePicker
                        style={{
                          width: "100%",
                        }}
                        getPopupContainer={(trigger) => trigger.parentElement}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item
                      name="description"
                      label="Description"
                      rules={[
                        {
                          required: true,
                          message: "please enter url description",
                        },
                      ]}
                    >
                      <Input.TextArea
                        rows={4}
                        placeholder="please enter url description"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Drawer>
          </>
        </div>

        <Tabs
          defaultActiveKey="1"
          items={items}
          onChange={onChange}
          className="font-normal  "
        />
        <hr />

        <div className="site-card-wrapper mt-4 space-y-7">
          <Row gutter={16} className="mt-4">
            <Col span={16}>
              <Card title="Sales and Revenue Chart" className="bg-white">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="sales" stroke="#8884d8" />
                    <Line type="monotone" dataKey="revenue" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col span={8}>
              <Card title="Top Performance" className="bg-white ">
                <List
                  itemLayout="horizontal"
                  dataSource={topPerformers}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />
                        }
                        title={<a href="#">{item.name}</a>}
                        description={item.role}
                      />
                    </List.Item>
                  )}
                />
                <div className="text-right mt-4">
                  <a href="/see-all" className="text-blue-500 font-bold">
                    See all
                  </a>
                </div>
              </Card>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={6}>
              <Card className="font-medium ">
                <div className="flex items-center justify-between">
                  <Statistic
                    title="User Total"
                    value={userTotal}
                    valueStyle={{}}
                  />
                  <div className="rounded-full bg-blue-500 w-14 h-14 flex items-center justify-center">
                    <i className="las la-users text-3xl text-white"></i>
                  </div>
                </div>
                <div className="bg-[#ccf5e7] text-[#00cc88] rounded-md p-1 text-start mt-2 w-14 ">
                  {<ArrowUpOutlined />} 15%
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card className="font-medium">
                <div className="flex items-center justify-between">
                  <Statistic
                    title="Total Sales"
                    value={totalSales}
                    valueStyle={{}}
                  />
                  <div className="rounded-full bg-green-500 w-14 h-14 flex items-center justify-center">
                    <i className="las la-users text-3xl text-white"></i>
                  </div>
                </div>
                <div className="bg-[#ccf5e7] text-[#00cc88] rounded-md p-1 text-start mt-2 w-14 ">
                  {<ArrowUpOutlined />} 23%
                </div>
              </Card>
            </Col>

            <Col span={6}>
              <Card className="font-medium">
                <div className="flex items-center justify-between">
                  <Statistic
                    title="Total Revenue"
                    value={totalRevenue}
                    valueStyle={{}}
                  />
                  <div className="rounded-full bg-red-500 w-14 h-14 flex items-center justify-center">
                    <i className="las la-users text-3xl text-white"></i>
                  </div>
                </div>
                <div className="bg-[#ffd6e0] text-[#ff3366] rounded-md p-1 text-start mt-2 w-14 ">
                  {<ArrowDownOutlined />} 15%
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card className="font-medium">
                <div className="flex items-center justify-between">
                  <Statistic
                    title="Pending Orders"
                    value={pendingOrders}
                    valueStyle={{}}
                  />
                  <div className="rounded-full bg-yellow-500 w-14 h-14 flex items-center justify-center">
                    <i className="las la-users text-3xl text-white"></i>
                  </div>
                </div>
                <div className="bg-[#ccf5e7] text-[#00cc88] rounded-md p-1 text-start mt-2 w-14 ">
                  {<ArrowUpOutlined />} 30%
                </div>
              </Card>
            </Col>
          </Row>
          <Row gutter={16} className="mt-4">
            <Col span={24}>
              <Card title="Sales and Revenue Table" className="bg-white">
                <Table
                  columns={columns}
                  dataSource={tableData}
                  pagination={false}
                />
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}

// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import DynamicBreadcrumb from "../common/DynamicBreadcrumb";
// import { getStatisticStore } from "../../redux/slices/dashboardSlice";
// import {
//   Row,
//   Col,
//   Card,
//   Statistic,
//   Button,
//   DatePicker,
//   Space,
//   Select,
// } from "antd";
// import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import moment from "moment";

// const { RangePicker } = DatePicker;
// const { Option } = Select;

// export default function DashBoardStore() {
//   const dispatch = useDispatch();
//   const { dataStatistic } = useSelector((state) => state.statistics);

//   // State cho filters
//   const [filterType, setFilterType] = useState("week"); // Mặc định là tuần
//   const [dateRange, setDateRange] = useState([]);

//   // Hàm tính ngày bắt đầu dựa trên loại filter
//   const getStartDate = (type) => {
//     const now = moment();
//     switch (type) {
//       case "week":
//         return now.startOf("week");
//       case "month":
//         return now.startOf("month");
//       case "quarter":
//         return now.startOf("quarter");
//       case "year":
//         return now.startOf("year");
//       default:
//         return now.startOf("week");
//     }
//   };

//   // Fetch data khi filter thay đổi
//   useEffect(() => {
//     const endDate = moment().format("YYYY-MM-DD");
//     let startDate;

//     if (dateRange.length === 2) {
//       startDate = moment(dateRange[0]).format("YYYY-MM-DD");
//     } else {
//       startDate = getStartDate(filterType).format("YYYY-MM-DD");
//     }

//     dispatch(
//       getStatisticStore({
//         startDate,
//         endDate,
//       })
//     );
//   }, [dispatch, filterType, dateRange]);

//   // Xử lý khi thay đổi filter type
//   const handleFilterChange = (value) => {
//     setFilterType(value);
//     setDateRange([]); // Reset DatePicker khi đổi filter
//   };

//   // Xử lý khi chọn ngày từ DatePicker
//   const handleDateRangeChange = (dates) => {
//     setDateRange(dates);
//     setFilterType(""); // Reset filter type khi chọn custom date
//   };

//   // Validate DatePicker
//   const disabledDate = (current) => {
//     const today = moment();
//     const oneYearAgo = moment().subtract(1, "year");
//     return current && (current > today || current < oneYearAgo);
//   };

//   // Dữ liệu mẫu cho chart (có thể thay bằng data thực từ API)
//   const chartData = [
//     { name: "Jan", sales: 4000, revenue: 2400 },
//     { name: "Feb", sales: 3000, revenue: 1398 },
//     { name: "Mar", sales: 2000, revenue: 9800 },
//     { name: "Apr", sales: 2780, revenue: 3908 },
//   ];

//   return (
//     <div className="container mx-auto pb-8">
//       <div>
//         <div className="max-w-6xl mb-4">
//           <DynamicBreadcrumb />
//         </div>

//         <div className="flex items-center justify-between mb-4">
//           <p className="font-medium text-3xl">👋Hi, vietle!</p>
//         </div>

//         {/* Filter controls */}
//         <Space className="mb-4">
//           <Select
//             value={filterType}
//             onChange={handleFilterChange}
//             style={{ width: 120 }}
//           >
//             <Option value="week">Tuần</Option>
//             <Option value="month">Tháng</Option>
//             <Option value="quarter">Quý</Option>
//             <Option value="year">Năm</Option>
//           </Select>

//           <RangePicker
//             value={dateRange}
//             onChange={handleDateRangeChange}
//             disabledDate={disabledDate}
//             format="DD/MM/YYYY"
//             placeholder={["Từ ngày", "Đến ngày"]}
//           />
//         </Space>

//         <div className="site-card-wrapper mt-4 space-y-7">
//           <Row gutter={16}>
//             <Col span={16}>
//               <Card title="Sales and Revenue Chart" className="bg-white">
//                 <ResponsiveContainer width="100%" height={400}>
//                   <LineChart data={chartData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="name" />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Line type="monotone" dataKey="sales" stroke="#8884d8" />
//                     <Line type="monotone" dataKey="revenue" stroke="#82ca9d" />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </Card>
//             </Col>
//             <Col span={8}>
//               <Card title="Statistics" className="bg-white">
//                 <Space direction="vertical" size="middle">
//                   <Statistic
//                     title="Total Orders"
//                     value={dataStatistic?.totalOrders || 0}
//                   />
//                   <Statistic
//                     title="Total Revenue"
//                     value={dataStatistic?.totalRevenue || 0}
//                     suffix="VND"
//                   />
//                   <Statistic
//                     title="Active Users"
//                     value={dataStatistic?.totalActiveUsers || 0}
//                   />
//                 </Space>
//               </Card>
//             </Col>
//           </Row>

//           <Row gutter={16}>
//             <Col span={6}>
//               <Card>
//                 <Statistic
//                   title="Total Orders"
//                   value={dataStatistic?.totalOrders || 0}
//                   prefix={<i className="las la-shopping-cart text-2xl mr-2" />}
//                 />
//                 <div className="bg-[#ccf5e7] text-[#00cc88] rounded-md p-1 text-start mt-2 w-14">
//                   <ArrowUpOutlined /> 15%
//                 </div>
//               </Card>
//             </Col>
//             <Col span={6}>
//               <Card>
//                 <Statistic
//                   title="Total Revenue"
//                   value={dataStatistic?.totalRevenue || 0}
//                   suffix="VND"
//                   prefix={<i className="las la-wallet text-2xl mr-2" />}
//                 />
//                 <div className="bg-[#ccf5e7] text-[#00cc88] rounded-md p-1 text-start mt-2 w-14">
//                   <ArrowUpOutlined /> 23%
//                 </div>
//               </Card>
//             </Col>
//             <Col span={6}>
//               <Card>
//                 <Statistic
//                   title="Active Users"
//                   value={dataStatistic?.totalActiveUsers || 0}
//                   prefix={<i className="las la-users text-2xl mr-2" />}
//                 />
//                 <div className="bg-[#ffd6e0] text-[#ff3366] rounded-md p-1 text-start mt-2 w-14">
//                   <ArrowDownOutlined /> 15%
//                 </div>
//               </Card>
//             </Col>
//             <Col span={6}>
//               <Card>
//                 <Statistic
//                   title="Pending Orders"
//                   value={dataStatistic?.totalVnPayOrders || 0}
//                   prefix={<i className="las la-clock text-2xl mr-2" />}
//                 />
//                 <div className="bg-[#ccf5e7] text-[#00cc88] rounded-md p-1 text-start mt-2 w-14">
//                   <ArrowUpOutlined /> 30%
//                 </div>
//               </Card>
//             </Col>
//           </Row>
//         </div>
//       </div>
//     </div>
//   );
// }
