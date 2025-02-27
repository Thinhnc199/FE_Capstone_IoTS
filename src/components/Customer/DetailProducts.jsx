import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchProductDetails } from "../../redux/slices/productSlice";
import { Tabs, InputNumber, Button } from "antd";
import { StarOutlined } from "@ant-design/icons";

export default function DetailProducts() {
  const onChange = (value) => {
    console.log("changed", value);
  };
  const { id } = useParams();
  const dispatch = useDispatch();
  const productDetail = useSelector((state) => state.products.ProductsDetail);
  const product = productDetail.data;
  const [selectedImage, setSelectedImage] = useState(null);
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };
  useEffect(() => {
    dispatch(fetchProductDetails({ id }));
  }, [dispatch, id]);

  useEffect(() => {
    if (product?.attachments?.length) {
      setSelectedImage(product.attachments[0].imageUrl);
    }
  }, [product]);

  if (productDetail.loading) return <p>Loading...</p>;
  if (!product) return <p>Không tìm thấy sản phẩm.</p>;

  const isNew = product.deviceType === 1;

  return (
    <div className="container mx-auto p-8">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 bg-white border rounded-md shadow-md p-4 m-4 ">
        {/* Image & Basic Info */}
        <div className="col-span-full">
          <h1 className="text-2xl font-bold w-full">{product.name}</h1>
          <hr className="my-2 bg-black" />
        </div>
        <div className="col-span-2">
          <img
            src={selectedImage || product.imageUrl}
            alt={product.name}
            className="p-4 w-full h-64 object-cover rounded-lg transition-all duration-500 ease-in-out"
          />
          <div className="flex space-x-2 mt-2">
            {product.attachments?.map((img, index) => (
              <img
                key={index}
                src={img.imageUrl}
                alt="attachment"
                className="w-16 h-16 object-cover cursor-pointer border rounded"
                onClick={() => setSelectedImage(img.imageUrl)}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="col-span-2 ">
          <div className="grid grid-cols-2 md:grid-cols-2 gap-1  text-md font-medium">
            <div className="flex space-x-2">
              <p>Type:</p>
              <p className="text-headerBg">{isNew ? "New" : "Secondhand"}</p>
            </div>
            <div className="flex space-x-2">
              <p>Status:</p>
              <p
                className={
                  product.quantity > 0 ? "text-headerBg" : "text-gray-500"
                }
              >
                {product.quantity > 0 ? "In Stock" : "Out of stock"}
              </p>
            </div>
            <div className="flex space-x-2">
              <p>Category:</p>
              <p className="text-headerBg">{product.quantity || "N/A"}</p>
            </div>
            <div className="flex space-x-2">
              <p>Brand:</p>
              <p className="text-headerBg">{product.quantity || "N/A"}</p>
            </div>
          </div>

          <div className="my-4">
            <p className="text-md font-bold  my-2">Price:</p>
            <div className="flex items-center space-x-2">
              <p className="font-semibold text-3xl text-red-600">
                {formatPrice(isNew ? product.price : product.secondHandPrice)}đ
              </p>
              {!isNew && (
                <p className="text-sm line-through text-gray-400">
                  Init price: {product.price} VND
                </p>
              )}
            </div>
          </div>
          {/* add sp */}
          <div className="space-y-2">
            <div className="space-y-2">
              <p className=" font-bold">Quantity:</p>
              <InputNumber
                min={1}
                max={10}
                defaultValue={1}
                onChange={onChange}
                className="w-16 h-10 flex justify-center items-center"
              />
            </div>
            <Button className="h-10 w-full bg-yellow-500 text-white font-semibold uppercase hover:scale-101">
              Add to card
            </Button>
            <div className="flex justify-center items-center space-x-2 ">
              <Button className="w-[50%] h-10 bg-headerBg text-white font-semibold uppercase hover:scale-101">
                Buy Now
              </Button>
              <Button className="w-[50%] h-10 bg-headerBg text-white font-semibold uppercase hover:scale-101">
                Add course
              </Button>
            </div>
          </div>
        </div>
        {/* cam ket */}
        <div className="col-span-2 space-y-2">
          <div className="border border-headerBg rounded-md ">
            <h1 className="text-white bg-headerBg p-2 ">Cam kết</h1>

            <p className="p-2">
              Kiểm tra sản phẩm trước khi bánKiểm tra sản phẩm trước khi bán Tư
              vấn tận tâmTư vấn tận tâm Vận chuyển nhanh chóngVận chuyển nhanh
              chóng Bảo hành trách nhiệmBảo hành trách nhiệm
            </p>
          </div>
          <div className="border border-headerBg rounded-md ">
            <h1 className="text-white bg-headerBg p-2">Khuyến mại</h1>

            <p className="p-2">
              Miễn phí Giao hàng thông thường (3-5 ngày) cho các đơn hàng thanh
              toán chuyển khoản trước, có trị giá lớn hơn 2tr trên Toàn Quốc
              (ngoại trừ các đơn hàng nặng trên 500g)
            </p>
          </div>
        </div>
      </div>

      {/* Tabs & Viewed Products Section */}
      <div className="grid grid-cols-10 gap-4 p-4 rounded-md">
        <div className="col-span-7 p-4 bg-white border shadow-md rounded-md">
          <Tabs defaultActiveKey="1" className="font-bold">
            <Tabs.TabPane
              className="font-Mainfont font-normal"
              tab="Mô tả"
              key="1"
            >
              <p>{product.description || "Không có mô tả."}</p>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Nhận xét sản phẩm" key="2">
              {product.reviews?.length > 0 ? (
                product.reviews.map((review, index) => (
                  <div key={index} className="p-2 border-b">
                    <p className="font-semibold">{review.user}</p>
                    <p>{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">
                  Hiện tại sản phẩm chưa có đánh giá nào, bạn hãy trở thành
                  người đầu tiên đánh giá cho sản phẩm này. Gửi đánh giá của
                  bạn.
                </p>
              )}
            </Tabs.TabPane>
          </Tabs>
        </div>
        <div className="col-span-3  bg-white border shadow-md rounded-md p-4">
          <div className="flex justify-start items-center space-x-3 rounded-md bg-headerBg text-white p-2 m-1">
            <StarOutlined className="text-2xl" />
            <h2 className="text-md  font-semibold  ">Sản phẩm đã xem</h2>
          </div>

          <p>vlus hong biet</p>
          {/* Nội dung sản phẩm đã xem sẽ thêm sau */}
        </div>
      </div>
    </div>
  );
}
