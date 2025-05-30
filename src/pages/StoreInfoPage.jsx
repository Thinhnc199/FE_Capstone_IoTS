import { Avatar, Pagination } from "antd";
import { Card, Badge, Button, Rate, Typography } from "antd";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchInfoStoreid } from "../redux/slices/accountSlice";
import { fetchProductStoreid } from "../redux/slices/storeSlice";
import { MessageOutlined, EyeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
const { Text } = Typography;
const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN").format(price);
};
export default function StoreInfoPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { storeInfo } = useSelector((state) => state.accounts);
  const { dataProduct, totalCount } = useSelector((state) => state.store);

  // State quản lý pagination
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(fetchInfoStoreid(id));
    dispatch(
      fetchProductStoreid({
        storeID: Number(id),
        pageIndex,
        pageSize,
      })
    );
  }, [dispatch, id, pageIndex, pageSize]);

  // Hàm tính số tháng từ ngày tạo
  function calculateMonthsSince(dateString) {
    if (!dateString) return 0;
    const createdDate = new Date(dateString);
    const currentDate = new Date();

    const yearsDifference =
      currentDate.getFullYear() - createdDate.getFullYear();
    const monthsDifference = currentDate.getMonth() - createdDate.getMonth();

    return yearsDifference * 12 + monthsDifference;
  }

  const joinedMonths = calculateMonthsSince(storeInfo?.createdDate);

  // Hàm xử lý thay đổi trang
  const handlePageChange = (page, pageSize) => {
    setPageIndex(page);
    setPageSize(pageSize);
  };

  if (!storeInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white min-h-screen p-6 mx-auto container">
      {/* Header với background và nút Chat Now */}
      <div
        className="relative h-64 rounded-lg overflow-hidden flex items-end p-6"
        style={{
          backgroundImage: `url(${storeInfo.imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 flex items-center space-x-4">
          <Avatar
            size={100}
            src={storeInfo.imageUrl}
            className="border-4 border-white"
          />
          <div className="text-white">
            <h1 className="text-2xl font-semibold">{storeInfo.name}</h1>
            <p>Online 7 hours ago</p>
          </div>

          <Link to={`/chat/${storeInfo.ownerId}`}>
            <button className="ml-auto bg-blue-500 text-white px-4 py-2 rounded-lg hover:text-blue-600 hover:bg-white hover:border hover:border-blue-500">
              <MessageOutlined className="mr-2" />
              Chat Now
            </button>
          </Link>
        </div>
      </div>

      {/* Thông tin cửa hàng */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <h3 className="text-xl font-semibold">
            {storeInfo.numberOfFeedbacks}
          </h3>
          <p className="text-gray-600">Evaluates</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <h3 className="text-xl font-semibold">
            {storeInfo.storeNumberOfProducts}
          </h3>
          <p className="text-gray-600">Products</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <h3 className="text-xl font-semibold">{joinedMonths}</h3>
          <p className="text-gray-600">Joined (months ago)</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <h3 className="text-xl font-semibold ">{storeInfo.provinceName}</h3>
          <p className="text-gray-600">Address</p>
        </div>
      </div>

      {/* Hiển thị hình ảnh đính kèm */}
      <div className="flex flex-wrap gap-2 mt-6">
        {storeInfo.storeAttachments?.map((attachment) => (
          <img
            key={attachment.id}
            src={attachment.imageUrl}
            alt={`Attachment ${attachment.id}`}
            className="w-24 h-24 object-cover rounded-md"
          />
        ))}
      </div>

      {/* Danh sách sản phẩm */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">All products</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 sm:grid-cols-4 gap-4">
          {Array.isArray(dataProduct.devicesIot) &&
            dataProduct.devicesIot.map((product) => (
              <Link
                to={`/detail/${product.id}`}
                key={product.id} // Add the key prop here
              >
                <Card
                  hoverable
                  className="w-full h-96 bg-white shadow-md rounded-lg m-2 group flex flex-col"
                  cover={
                    <div className="relative flex-shrink-0">
                      <Badge.Ribbon text="New" color="red">
                        <img
                          alt={product.name}
                          src={product.imageUrl || "/placeholder.jpg"}
                          className="w-full h-48 rounded-t-lg scale-100 transition-all duration-300 group-hover:scale-90 p-0"
                        />
                      </Badge.Ribbon>

                      <div className="absolute top-2 left-2 flex space-x-2">
                        <Button
                          shape="circle"
                          className="bg-white p-2 rounded-full shadow-md"
                          icon={<EyeOutlined />}
                        />
                      </div>
                    </div>
                  }
                >
                  {/* context card */}
                  <div className="flex flex-col flex-grow space-y-2">
                    <div className="h-14 overflow-hidden">
                      <Text
                        strong
                        className="text-lg font-bold group-hover:text-headerBg line-clamp-2 overflow-ellipsis overflow-hidden"
                      >
                        {product.name}
                      </Text>
                    </div>
                    {product.product}
                    <div className="flex items-center space-x-2">
                      <Text strong className="text-xl text-red-500">
                        {formatPrice(product.price)}đ
                      </Text>
                    </div>
                    <div className="flex items-center">
                      <Rate disabled allowHalf defaultValue={product.rating} />
                      <Text className="text-gray-500 ml-2">(88)</Text>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
        </div>
        {/* Pagination */}
        <div className="mt-6 flex justify-center">
          <Pagination
            current={pageIndex}
            pageSize={pageSize}
            total={totalCount}
            onChange={handlePageChange}
            showSizeChanger={true}
            pageSizeOptions={["10", "20", "30", "50"]}
          />
        </div>
      </div>
    </div>
  );
}
