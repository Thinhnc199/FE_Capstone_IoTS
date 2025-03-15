import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/icons/3.svg";

import { ShoppingCartOutlined } from "@ant-design/icons";
import FloatingInput from "../components/common/FloatingInput";
import {
  Badge,
  Input,
  Dropdown,
  Space,
  Modal,
  Empty,
  Checkbox,
  Button,
} from "antd";
export default function Checkout() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto h-screen gap-2 bg-white ">
      <div className="flex items-center justify-between px-52">
        <Link
          to="/"
          className="text-2xl font-bold text-[#007AFF] flex items-center space-x-2"
        >
          <img src={Logo} alt="Logo" className="w-16 h-16" />
          <p className="">IOTS</p>
        </Link>
        <Space className="cursor-pointer" onClick={() => navigate("/cart")}>
          <Badge>
            <ShoppingCartOutlined className="text-gray-700 text-[25px] hover:text-headerBg" />
          </Badge>
        </Space>
      </div>
      <hr />

      {/* Main Content - Grid Layout */}
      <div className="grid grid-cols-9 gap-8 px-20 py-10">
        <div className="col-span-6 border-r pr-10 space-y-6">
          <p className="font-semibold text-xl">Contact</p>
          <div className="space-y-3">
            <FloatingInput label="Phone" />
          </div>
          <p className="font-semibold text-xl">Delivery</p>

          <div className="space-y-3">
            <FloatingInput label="Province" />
            <FloatingInput label="District" />
            <FloatingInput label="Ward" />
            <FloatingInput isTextarea="true" label="Address" />
            <FloatingInput isTextarea="true" label="Note" />
          </div>
        </div>

        <div className="col-span-3 border p-6 rounded-md shadow-sm">
          <p className="font-semibold text-xl">Order Summary</p>
          <div className="h-50vw   flex gap-4 items-center justify-between p-2 hover:bg-gray-100 border-b border-gray-300">
            {/* Checkbox và hình ảnh */}
            <div className="flex items-center gap-3">
              <Checkbox
                checked={item.isSelected}
                onChange={(e) => handleCheckBox(item.id, e.target.checked)}
              />
              <img
                src={item.imageUrl}
                alt={item.productName}
                className="w-12 h-12 object-cover rounded"
              />
            </div>

            {/* Thông tin sản phẩm */}
            <div className="flex-1 min-w-0">
              <Link to={`/detail/${item.productId}`}>
                <span className="font-medium line-clamp-2 break-words">
                  {item.productName}
                </span>
              </Link>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <QuantityInput quantity={item.quantity} cartId={item.id} />
              </div>
            </div>

            {/* Giá tiền */}
            <span className="font-medium whitespace-nowrap text-red-500">
              {item.price.toLocaleString()}₫
            </span>

            {/* Nút xóa */}
            <CloseOutlined
              className=" font-bold absolute top-2 right-2 text-gray-500 hover:text-red-500 cursor-pointer"
              onClick={() => handleDelete(item.id)}
            />
          </div>
          <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
            Apply Code
          </button>
        </div>
      </div>
    </div>
  );
}
