import { Empty, Table, Button, Checkbox } from "antd";
import QuantityInput from "../components/common/QuantityInput";
import { useSelector, useDispatch } from "react-redux";
import { DeleteFilled } from "@ant-design/icons";
import { Link } from "react-router-dom";
import {
  fetchCarts,
  deleteCarts,
  selectCarts,
  unselectCarts,
  fetchGetTotalPrice,
} from "../redux/slices/cartSlice";
export default function CartProducts() {
  const dispatch = useDispatch();
  const { cart, totalCount, pageIndex, pageSize, totalSelectedItemsPrice } =
    useSelector((state) => state.carts);

  const handleDelete = async (cartId) => {
    try {
      await dispatch(deleteCarts({ cartId })).unwrap();
    } catch (error) {
      console.error("Failed to delete cart item:", error);
    }
    dispatch(fetchGetTotalPrice());
    dispatch(fetchCarts({ pageIndex, pageSize }));
  };
  const handleCheckBox = async (cartId, isChecked) => {
    try {
      if (isChecked) {
        await dispatch(selectCarts({ cartId })).unwrap();
      } else {
        await dispatch(unselectCarts({ cartId })).unwrap();
      }
      dispatch(fetchGetTotalPrice());
      dispatch(fetchCarts({ pageIndex, pageSize }));
    } catch (error) {
      console.error("Failed to update cart selection:", error);
    }
  };

  const columns = [
    {
      title: "Product",
      dataIndex: "product",
      render: (_, record) => (
        <div className="flex items-center gap-4">
          <Checkbox
            checked={record.isSelected}
            onChange={(e) => handleCheckBox(record.id, e.target.checked)}
          />

          <img
            src={record.imageUrl}
            alt={record.productName}
            className="w-16 h-16 rounded-md"
          />
          <span className="flex justify-between items-start flex-col">
            <Link to={`/detail/${record.productId}`}>
              <span className="font-medium line-clamp-2 overflow-ellipsis h-12">
                {record.productName}
              </span>
            </Link>

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
                {totalSelectedItemsPrice.toLocaleString()}₫
              </p>
            </div>
            <Link to="/checkout">
              <Button className="bg-headerBg text-white w-full">Payment</Button>
            </Link>
          </div>
          <div className=" border p-4 rounded-sm shadow-sm bg-gray-50">
            <p className="font-semibold text-lg text-yellow-500">Note !</p>
            <p>
              Please note that orders placed after 3:00 PM will be shipped the
              following day. Our store is closed on Sundays. For special
              delivery requests, please contact our sales department via Zalo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
