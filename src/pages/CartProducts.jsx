import { Empty, Table, Button } from "antd";
import QuantityInput from "../components/common/QuantityInput";
import { useSelector, useDispatch } from "react-redux";
import { DeleteFilled } from "@ant-design/icons";
import { deleteCarts } from "../redux/slices/cartSlice";
import { fetchCarts } from "../redux/slices/cartSlice";
export default function CartProducts() {
  const dispatch = useDispatch();
  const { cart, totalCount, pageIndex, pageSize } = useSelector(
    (state) => state.carts
  );

  const handleDelete = async (cartId) => {
    try {
      await dispatch(deleteCarts({ cartId })).unwrap();
      dispatch(fetchCarts({ pageIndex, pageSize }));
    } catch (error) {
      console.error("Failed to delete cart item:", error);
    }
  };

  const columns = [
    {
      title: "Product",
      dataIndex: "product",
      render: (_, record) => (
        <div className="flex items-center gap-4">
          <img
            src={record.imageUrl}
            alt={record.productName}
            className="w-16 h-16 rounded-md"
          />
          <span className="flex justify-between items-start flex-col">
            <span className="font-medium line-clamp-2 overflow-ellipsis">
              {record.productName}
            </span>

            <DeleteFilled
              className="hover:text-red-500 cursor-pointer"
              onClick={() => handleDelete(record.id)}
            />
          </span>
        </div>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (price) => (
        <span className="font-medium">{price.toLocaleString()}₫</span>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      render: (_, record) => (
        <span>
          <QuantityInput quantity={record.quantity} cartId={record.id} />
        </span>
      ),
    },
    {
      title: "Total",
      dataIndex: "totalPrice",

      render: (price) => (
        <span className="font-medium">{price.toLocaleString()}₫</span>
      ),
    },
  ];

  return (
    <div className="max-h-screen bg-white rounded-sm shadow-sm mx-auto p-4 my-4 container">
      <div className="flex justify-between items-start gap-6">
        {/* Bảng sản phẩm - Nằm bên trái */}
        <div className="flex-1 border p-4">
          {totalCount > 0 ? (
            <Table columns={columns} dataSource={cart} pagination={false} />
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </div>

        {/* Tổng tiền + Nút thanh toán - Nằm bên phải */}
        <div className="w-1/4 space-y-4">
          <div className="border p-4 rounded-sm shadow-sm bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <p className="text-lg font-medium">Total price:</p>

              <p className="text-lg font-semibold text-headerBg">
                {cart
                  .reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                  )
                  .toLocaleString()}
                ₫
              </p>
            </div>
            <Button className="bg-headerBg text-white w-full">Payment</Button>
          </div>
          <div className=" border p-4 rounded-sm shadow-sm bg-gray-50">
            <p className="font-semibold text-lg text-yellow-500">Note !</p>
            <p>
              Quý khách xin lưu ý các đơn hàng đặt sau 15h00 IOTSHOP sẽ gửi hàng
              vào ngày hôm sau, cửa hàng nghỉ vào ngày Chủ Nhật, các yêu cầu
              giao hàng đặc biệt xin Quý Khách liên hệ bộ phận bán hàng qua
              Zalo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
