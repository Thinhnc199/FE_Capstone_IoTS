import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import Logo from "../../assets/icons/3.svg";
import { useSelector, useDispatch } from "react-redux";
import { ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import AddressForm from "./components/AddressForm";
import {
  fetchCarts,
  fetchGetTotalPrice,
  resetCart,
} from "../../redux/slices/cartSlice";
import { createOrder } from "../../redux/slices/orderSlice";
import FloatingInput from "../../components/common/FloatingInput";
import { Badge, Divider, Button, Space, Form, message } from "antd";

export default function Checkout() {
  const [selectedProvinceId, setSelectedProvinceId] = useState(null);
  const [selectedDistrictId, setSelectedDistrictId] = useState(null);
  const [selectedWardId, setSelectedWardId] = useState(null);
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart, pageIndex, pageSize, totalSelectedItemsPrice } = useSelector(
    (state) => state.carts
  );

  const token = localStorage.getItem("token");
  const isValidPhone = (value) => /^\d{10,11}$/.test(value);
  useEffect(() => {
    if (token) {
      dispatch(fetchCarts({ pageIndex, pageSize }));
      dispatch(fetchGetTotalPrice());
    } else {
      dispatch(resetCart());
    }
  }, [token, dispatch]);

  //totalItems
  const totalItems = useMemo(() => {
    if (!Array.isArray(cart)) return 0;
    return cart.reduce((total, item) => total + (item.quantity || 0), 0);
  }, [cart]);
  //handeleAddressChange
  const handleAddressChange = (newFullAddress, ids) => {
    setSelectedProvinceId(ids.provinceId);
    setSelectedDistrictId(ids.districtId);
    setSelectedWardId(ids.wardId);
  };

  const handleCreateOrder = async () => {
    try {
      const result = await dispatch(
        createOrder({
          address,
          contactNumber,
          notes,
          provinceId: selectedProvinceId,
          districtId: selectedDistrictId,
          wardId: selectedWardId,
        })
      ).unwrap();

      console.log("API Response:", result); // Kiểm tra phản hồi từ API

      if (!result?.data.paymentUrl) {
        message.error("Payment URL is missing!");
        return;
      }

      message.success("Order created successfully!", result.message);
      window.location.href = result.data.paymentUrl;
    } catch (error) {
      message.error(
        "Failed to create order: " + (error.message || "Unknown error")
      );
    }
  };
  console.log("cart", cart);

  return (
    <div className="mx-auto h-screen gap-2 bg-mainColer">
      <nav className="bg-white border-b border-b-gray-300">
        <div className="container mx-auto flex justify-between items-center px-6">
          <Link
            to="/"
            className="text-2xl font-bold text-[#007AFF] flex items-center space-x-2"
          >
            <img src={Logo} alt="Logo" className="w-16 h-16" />
            <p className="">IOTS</p>
          </Link>
          <div className="flex items-center space-x-6">
            <Space className="cursor-pointer" onClick={() => navigate("/cart")}>
              <ShoppingCartOutlined className="text-gray-700 text-[25px] hover:text-headerBg" />
            </Space>
            <Space>
              <UserOutlined className="text-[21px] text-white bg-headerBg p-2 rounded-full cursor-pointer " />
            </Space>
          </div>
        </div>
      </nav>

      {/* Main Content - Flex Layout */}
      <div className="flex flex-col sm:flex-row lg:flex-row gap-8 sm:mx-8 md:mx-10 lg:mx-40 py-4">
        {/* Delivery Information */}
        <div className="flex-1 lg:flex-[6] sm:flex-[6] border rounded-md p-4 space-y-6 relative bg-white max-w-screen-lg mx-auto">
          <p className="font-semibold text-lg text-start">
            Delivery Information
          </p>
          <div>
            <p className="font-medium mb-2">Phone:</p>
            <FloatingInput
              label="Phone"
              type="tel"
              required
              pattern="[0-9]{10,11}"
              validateFunc={isValidPhone}
              errorMessage="Phone number must be 10-11 digits."
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
            />
          </div>

          <div>
            <Form.Item
              name="address"
              rules={[
                {
                  required: true,
                  message:
                    "Please select all the address fields (Province, District, and Ward).",
                },
              ]}
            >
              <AddressForm
                onAddressChange={handleAddressChange}
                defaultProvinceId={selectedProvinceId}
                defaultDistrictId={selectedDistrictId}
                defaultWardId={selectedWardId}
              />
            </Form.Item>
          </div>
          <div>
            <p className="font-medium mb-2">Address:</p>
            <FloatingInput
              isTextarea={true}
              label="Address"
              value={address}
              required
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div>
            <p className="font-medium mb-2">Note:</p>
            <FloatingInput
              isTextarea={true}
              label="Note"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Order Summary */}
        <div className="flex-1 lg:flex-[4] sm:flex-[4] border p-4 rounded-md shadow-sm bg-white max-w-screen-lg mx-auto overflow-y-auto h-[calc(100vh-4rem)]">
          <p className="font-semibold text-lg">
            Order Summary ({totalItems} items)
          </p>
          <Divider className="bg-gray-200" />
          {cart.length === 0 ? (
            <p className="text-center text-gray-500">
              No products in your cart
            </p>
          ) : (
            cart
              .filter((carts) => carts.isSelected)
              .map((carts, index) => (
                <div
                  key={index}
                  className="h-50vw flex gap-4 items-center justify-between py-1"
                >
                  <div className="flex items-center gap-4">
                    <Badge
                      count={carts.quantity}
                      className="rounded-full "
                      color="blue"
                    >
                      <img
                        src={carts.imageUrl}
                        alt={carts.productName}
                        className="w-16 h-16 rounded-lg border"
                      />
                    </Badge>

                    <span className="flex justify-between items-start flex-col">
                      <span className="font-medium line-clamp-2 overflow-ellipsis h-12 text-sm">
                        {carts.productName}
                      </span>
                    </span>
                  </div>
                  <span className="font-medium whitespace-nowrap text-gray-500 text-sm">
                    {carts.price.toLocaleString()}₫
                  </span>
                </div>
              ))
          )}
          <Divider className="bg-gray-200" />
          <div className="space-y-3">
            <span className="justify-between text-gray-500 flex items-center">
              <p className="font-semibold text-sm"> Provisional: </p>
              <p className="font-semibold text-sm">
                {totalSelectedItemsPrice.toLocaleString()}₫
              </p>
            </span>
            <span className="justify-between text-gray-500 flex items-center">
              <p className="font-semibold text-sm"> Shipping fee: </p>
              <p className="font-semibold text-sm">{0}₫</p>
            </span>
          </div>
          <Divider className="bg-gray-200" />
          <div>
            <span className="justify-between text-gray-800 flex items-center">
              <p className="font-semibold text-lg"> Total: </p>
              <p className="font-semibold text-lg text-headerBg">
                {totalSelectedItemsPrice.toLocaleString()}₫
              </p>
            </span>
            <span className="justify-between text-gray-800 flex items-center py-4">
              <p className="font-semibold text-sm cursor-pointer text-blue-400 hover:text-blue-700 transition-all duration-200 flex items-center group">
                <span className="font-thin transform transition-all -translate-x-0 group-hover:-translate-x-1">
                  ❮
                </span>
                <Link to="/">
                  <span className="pl-1 group-hover:-translate-x-0">
                    Back to cart
                  </span>
                </Link>
              </p>

              <Button
                className="bg-headerBg text-white w-40 h-10"
                onClick={handleCreateOrder}
              >
                Confirm
              </Button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
