import { Avatar, Pagination, DatePicker, Input } from "antd";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchInfoStoreid } from "../redux/slices/accountSlice";
import { fetchProductStoreid } from "../redux/slices/storeSlice";
import { MessageOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;
const { Search } = Input;

export default function StoreInfoPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { storeInfo } = useSelector((state) => state.accounts);
  const { dataProduct, totalCount } = useSelector((state) => state.store);

  // State quản lý pagination
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // State quản lý filter và search
  const [searchKeyword, setSearchKeyword] = useState("");
  const [startFilterDate, setStartFilterDate] = useState(null);
  const [endFilterDate, setEndFilterDate] = useState(null);

  useEffect(() => {
    dispatch(fetchInfoStoreid(id));
    dispatch(
      fetchProductStoreid({
        storeID: id,
        pageIndex,
        pageSize,
        searchKeyword,
        startFilterDate,
        endFilterDate,
      })
    );
  }, [
    dispatch,
    id,
    pageIndex,
    pageSize,
    searchKeyword,
    startFilterDate,
    endFilterDate,
  ]);

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
    <div className="bg-white min-h-screen p-6">
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
            <p>Online 7 giờ trước</p>
          </div>
          <button className="ml-auto bg-blue-500 text-white px-4 py-2 rounded-lg hover:text-blue-600 hover:bg-white hover:border hover:border-blue-500">
            <MessageOutlined className="mr-2" />
            Chat Now
          </button>
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
          <h3 className="text-xl font-semibold">{storeInfo.provinceName}</h3>
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {dataProduct.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h4 className="font-semibold">{product.name}</h4>
                <p className="text-gray-600">{product.description}</p>
              </div>
            </div>
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
