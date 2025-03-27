import {
  Card,
  Descriptions,
  Image,
  List,
  Tag,
  Typography,
  Divider,
  Button,
  Space,
} from "antd";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/vi";

const { Title, Text } = Typography;
dayjs.locale("vi");
// Dữ liệu mẫu (sẽ thay bằng API thực tế)
const mockOrder = {
  orderId: 300,
  applicationSerialNumber: "OD12020250325183646",
  totalPrice: 175000,
  address: "quảng ngãi",
  contactNumber: "0867603194",
  notes: "",
  createDate: "2025-03-25T18:36:46.3262076",
  orderStatusId: 1,
  shippingFee: 0,
  orderDetailsGrouped: [
    {
      sellerName: "chu ba duy",
      sellerRoleName: "Store",
      trackingId: "1150027441",
      orderItemStatus: 1,
      totalAmount: 175000,
      items: [
        {
          orderItemId: 206,
          imageUrl:
            "https://firebasestorage.googleapis.com/v0/b/iot-trading-system-firebase.firebasestorage.app/o/image%2Fcfda188b-3fd2-4bd0-834d-920821e31cd2.png.png?alt=media&token=4fafd47b-c29e-444b-89dc-e50efa0602e7",
          productId: 33,
          nameProduct: "tetst2",
          productType: 1,
          quantity: 1,
          price: 175000,
          warrantyEndDate: null,
          orderItemStatus: 1,
        },
      ],
    },
  ],
};

const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN").format(price) + "đ";
};

const getStatusTag = (statusId) => {
  switch (statusId) {
    case 1:
      return <Tag color="blue">Processing</Tag>;
    case 2:
      return <Tag color="green">Completed</Tag>;
    case 3:
      return <Tag color="red">Cancelled</Tag>;
    default:
      return <Tag>Unknown</Tag>;
  }
};

export default function HistoryOrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <Button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Orders
        </Button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50">
            <Title level={3} className="mb-0 text-gray-800">
              Order #{mockOrder.applicationSerialNumber}
            </Title>
          </div>

          <div className="p-6">
            <Descriptions bordered column={2} className="custom-descriptions">
              <Descriptions.Item
                label={
                  <span className="font-semibold text-gray-700">
                    Order Date
                  </span>
                }
              >
                <span className="text-gray-900">
                  {dayjs(mockOrder.createDate).format("dddd, DD/MM/YYYY HH:mm")}
                </span>
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span className="font-semibold text-gray-700">Status</span>
                }
              >
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                  Processing
                </span>
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span className="font-semibold text-gray-700">Contact</span>
                }
              >
                <span className="text-gray-900">{mockOrder.contactNumber}</span>
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span className="font-semibold text-gray-700">Address</span>
                }
              >
                <span className="text-gray-900">{mockOrder.address}</span>
              </Descriptions.Item>
            </Descriptions>

            {mockOrder.orderDetailsGrouped.map((group, index) => (
              <div key={index} className="mt-8">
                <Divider
                  orientation="left"
                  className="text-lg font-semibold text-gray-800"
                >
                  Seller: {group.sellerName}
                  <span className="ml-2 text-gray-500 font-normal">
                    ({group.sellerRoleName})
                  </span>
                </Divider>

                <List
                  itemLayout="horizontal"
                  dataSource={group.items}
                  renderItem={(item) => (
                    <List.Item className="p-4 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="flex w-full items-center">
                        <Image
                          src={item.imageUrl}
                          width={80}
                          height={80}
                          className="rounded-lg border border-gray-200 shadow-sm"
                          preview={false}
                        />
                        <div className="ml-4 flex-1">
                          <Text strong className="text-gray-900 block">
                            {item.nameProduct}
                          </Text>
                          <div className="flex mt-2 text-sm text-gray-600 space-x-4">
                            <span>Qty: {item.quantity}</span>
                            <span>
                              Price:{" "}
                              {new Intl.NumberFormat("vi-VN").format(
                                item.price
                              )}
                              đ
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <Text strong className="text-orange-600 text-lg">
                            {new Intl.NumberFormat("vi-VN").format(
                              item.price * item.quantity
                            )}
                            đ
                          </Text>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />

                <div className="text-right mt-6 space-y-2">
                  <div className="flex justify-end items-center space-x-4">
                    <span className="text-gray-700 font-medium">
                      Shipping Fee:
                    </span>
                    <span className="text-gray-900 font-medium">
                      {new Intl.NumberFormat("vi-VN").format(
                        mockOrder.shippingFee
                      )}
                      đ
                    </span>
                  </div>
                  <Divider className="my-2" />
                  <div className="flex justify-end items-center space-x-4">
                    <span className="text-gray-900 font-bold text-lg">
                      Total:
                    </span>
                    <span className="text-orange-600 font-bold text-xl">
                      {new Intl.NumberFormat("vi-VN").format(
                        mockOrder.totalPrice
                      )}
                      đ
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
