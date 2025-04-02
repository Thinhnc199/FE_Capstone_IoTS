import { Card, Typography, Table, Button } from "antd";
import {
  ShoppingCartOutlined,
  MessageOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import "tailwindcss/tailwind.css";

const { Title, Paragraph } = Typography;

// Dữ liệu bảng
const supervisorColumns = [
  { title: "No.", dataIndex: "no", key: "no" },
  { title: "Fullname", dataIndex: "fullname", key: "fullname" },
  { title: "Phone", dataIndex: "phone", key: "phone" },
  { title: "E-Mail", dataIndex: "email", key: "email" },
];

const supervisorData = [
  {
    key: "1",
    no: "Supervisor",
    fullname: "Mr. Pham Minh Tri",
    phone: "093*****96",
    email: "tript9@fe.edu.vn",
  },
  {
    key: "2",
    no: "Supervisor",
    fullname: "Mr. Ho Hoan Kiem",
    phone: "093*****96",
    email: "KiemHH@fpt.edu.vn",
  },
];

const studentColumns = [
  { title: "", dataIndex: "index", key: "index" },
  { title: "Full Name", dataIndex: "fullname", key: "fullname" },
  { title: "Student Code", dataIndex: "studentCode", key: "studentCode" },
  { title: "Phone", dataIndex: "phone", key: "phone" },
  { title: "E-Mail", dataIndex: "email", key: "email" },
  { title: "Role in Group", dataIndex: "role", key: "role" },
];

const studentData = [
  {
    key: "1",
    index: "1",
    fullname: "Lê Văn Hà",
    studentCode: "SE140685",
    phone: "0364463482",
    email: "Halvse140685@fpt.edu.vn",
    role: "Leader",
  },
  {
    key: "2",
    index: "2",
    fullname: "Lê Tấn Việt",
    studentCode: "SE173272",
    phone: "0867603194",
    email: "vietltse173165@fpt.edu.vn",
    role: "Member",
  },
  {
    key: "3",
    index: "3",
    fullname: "Nguyễn Cường Thịnh",
    studentCode: "SE160927",
    phone: "0938291478",
    email: "Thinhncse160927@fpt.edu.vn",
    role: "Member",
  },
  {
    key: "4",
    index: "4",
    fullname: "Nguyễn Hoàng Thiện",
    studentCode: "SE160869",
    phone: "0833300912",
    email: "ThienNHSE160869@fpt.edu.vn",
    role: "Member",
  },
];

const AboutIoTs = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-5xl mx-auto text-center mb-12">
        <Title level={1} className="text-4xl font-bold text-gray-800">
          About IoTs
        </Title>
        <Paragraph className="text-lg text-gray-600 mt-2">
          IoT Materials Trading Platform with Assembly Instructions
        </Paragraph>
      </div>

      {/* Supervisor Info */}
      <Card
        title="1. Supervisor Information"
        className="max-w-5xl mx-auto mb-8 shadow-lg rounded-lg"
      >
        <Table
          columns={supervisorColumns}
          dataSource={supervisorData}
          pagination={false}
          className="overflow-x-auto"
        />
      </Card>

      {/* Student Info */}
      <Card
        title="2. Student Team Information"
        className="max-w-5xl mx-auto mb-8 shadow-lg rounded-lg"
      >
        <Table
          columns={studentColumns}
          dataSource={studentData}
          pagination={false}
          className="overflow-x-auto"
        />
      </Card>

      {/* Capstone Project Content */}
      <div className="max-w-5xl mx-auto">
        <Card
          title="3. Capstone Project Details"
          className="shadow-lg rounded-lg mb-8"
        >
          <div className="space-y-6">
            {/* Project Name */}
            <div>
              <Title level={4} className="text-xl font-semibold text-gray-800">
                3.1 Capstone Project Name
              </Title>
              <Paragraph className="text-gray-700">
                <strong>English:</strong> IoT Materials Trading Platform with
                Assembly Instructions
              </Paragraph>
              <Paragraph className="text-gray-700">
                <strong>Vietnamese:</strong> Nền tảng buôn bán vật liệu IoT có
                hướng dẫn lắp ráp
              </Paragraph>
              <Paragraph className="text-gray-700">
                <strong>Abbreviation:</strong> IoTs
              </Paragraph>
            </div>

            {/* Context */}
            <div>
              <Title level={4} className="text-xl font-semibold text-gray-800">
                a. Context
              </Title>
              <Paragraph className="text-gray-700">
                Materials are multiple components required for a complete smart
                device. The platform allows users to explore, learn about, and
                purchase smart devices through online stores managed via the
                website. Users can choose to buy individual devices and learn
                how to assemble them on their own or select kits that come with
                detailed assembly instructions and access instructional videos
                from expert instructors. Additionally, users can interact with
                the store through live chat and report issues with devices or
                kits when encountering problems. This enables staff to provide
                timely support and effective management.
              </Paragraph>
              <Paragraph className="text-gray-700">
                Products are listed for direct sale by stores after purchasing a
                designated package on the system. Accounts assigned as stores
                must go through an approval process before they can operate.
                Stores also have the ability to create promotional blogs,
                allowing users to access information and content more flexibly.
              </Paragraph>
              <Paragraph className="text-gray-700">
                When registering a store, there will be certain warranty
                policies between the store and the customer, making the system
                more secure. For warranty claims, users must take or upload a
                photo of the current product along with the order code for
                accurate verification.
              </Paragraph>
              {/* <img
                src="https://via.placeholder.com/600x300?text=IoT+Platform+Demo"
                alt="IoT Platform Demo"
                className="w-full rounded-lg mt-4 shadow-md"
              /> */}
            </div>

            {/* Proposed Solutions */}
            <div>
              <Title level={4} className="text-xl font-semibold text-gray-800">
                b. Proposed Solutions
              </Title>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="flex items-start p-4 bg-white shadow-md rounded-lg">
                  <ShoppingCartOutlined className="text-3xl text-blue-500 mr-4" />
                  <div>
                    <strong>Reliable Buy-and-Sell Platform:</strong> Provides a
                    dependable space for buying and selling IoT devices, with
                    prompt customer support post-purchase.
                  </div>
                </Card>
                <Card className="flex items-start p-4 bg-white shadow-md rounded-lg">
                  <MessageOutlined className="text-3xl text-blue-500 mr-4" />
                  <div>
                    <strong>Direct Communication:</strong> Enables direct
                    interaction between users and stores through live chat,
                    making it easy for users to get support without additional
                    effort.
                  </div>
                </Card>
                <Card className="flex items-start p-4 bg-white shadow-md rounded-lg">
                  <HeartOutlined className="text-3xl text-blue-500 mr-4" />
                  <div>
                    <strong>Wishlist Feature:</strong> Allows users to create a
                    wishlist of favorite products for future review and
                    purchase.
                  </div>
                </Card>
                <Card className="flex items-start p-4 bg-white shadow-md rounded-lg">
                  <div>
                    <strong>Content Promotion:</strong> Stores can post daily
                    promotional blogs, with an algorithm prioritizing
                    high-quality content based on user engagement (comments and
                    likes). This keeps valuable, well-rated content visible,
                    while limiting excessive posts.
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-12">
        <Button
          type="primary"
          size="large"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg"
        >
          Learn More About IoTs
        </Button>
      </div>
    </div>
  );
};

export default AboutIoTs;
