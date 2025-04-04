import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchProductDetails } from "../redux/slices/productSlice";
import { Tabs, InputNumber, Button, message, Spin, Rate } from "antd";
import { StarOutlined, ShopOutlined, MessageOutlined } from "@ant-design/icons";
import { fetchAddCarts, fetchCarts } from "../redux/slices/cartSlice";
import { fetchFeedbackHistory } from "../redux/slices/feedbackSlice";
import { ProductType } from "../redux/constants";
import ErrorProduct from "./ErrorProduct";
import BreadcrumbNav from "../components/common/BreadcrumbNav";
export default function DetailProducts() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const productDetail = useSelector((state) => state.products.ProductsDetail);
  const product = productDetail.data;
  const navigate = useNavigate();
  const [allImages, setAllImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [numCart, setNumCart] = useState(1);
  const { pageIndex, pageSize } = useSelector((state) => state.carts);
  const feedback = useSelector((state) => state.feedback);
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  useEffect(() => {
    dispatch(fetchProductDetails({ id }));
  }, [dispatch, id]);
  // useEffect(() => {
  //   dispatch(fetchCarts({ pageIndex, pageSize }));
  // }, [dispatch, id]);

  // Gọi API feedback history
  useEffect(() => {
    const payload = {
      advancedFilter: {
        productId: parseInt(id),
        productType: 1,
      },
      paginationRequest: {
        pageIndex: 0,
        pageSize: 10,
        searchKeyword: "",
      },
    };
    dispatch(fetchFeedbackHistory(payload));
  }, [dispatch, id]);

  useEffect(() => {
    if (product) {
      const images = [
        product.imageUrl,
        ...(product.attachments?.map((img) => img.imageUrl) || []),
      ].filter(Boolean); // Loại bỏ giá trị null/undefined
      setAllImages(images);
      setSelectedImage(images[0]); // Lấy ảnh đầu tiên làm ảnh chính
    }
  }, [product]);

  const onChange = (value) => {
    setNumCart(value);
  };
  // Utility function
  function calculateMonthsSince(dateString) {
    const createdDate = new Date(dateString);
    const currentDate = new Date();

    const yearsDifference =
      currentDate.getFullYear() - createdDate.getFullYear();
    const monthsDifference = currentDate.getMonth() - createdDate.getMonth();

    // Total months difference
    return yearsDifference * 12 + monthsDifference;
  }

  // Inside the component
  const joinedMonths = calculateMonthsSince(product?.storeInfo?.createdDate);
  const HandleAddToCart = async () => {
    if (product.quantity <= 0) {
      message.warning("The product is out of stock.");
      return;
    }

    try {
      const result = await dispatch(
        fetchAddCarts({
          productId: id,
          productType: ProductType.DEVICE,
          quantity: numCart,
        })
      );

      if (fetchAddCarts.fulfilled.match(result)) {
        message.success("Product has been added to cart!");
        dispatch(fetchCarts({ pageIndex, pageSize }));
      } else {
        throw new Error(result.payload || "Unknown error");
      }
    } catch (error) {
      message.error(`Error adding to cart: ${error.message}`);
    }
  };
  const HandleBuynow = async () => {
    if (product.quantity <= 0) {
      message.warning("The product is out of stock.");
      return;
    }

    try {
      const result = await dispatch(
        fetchAddCarts({
          productId: id,
          productType: ProductType.DEVICE,
          quantity: numCart,
        })
      );

      if (fetchAddCarts.fulfilled.match(result)) {
        dispatch(fetchCarts({ pageIndex, pageSize }));
        navigate("/cart");
      } else {
        throw new Error(result.payload || "Unknown error");
      }
    } catch (error) {
      message.error(`Error adding to cart: ${error.message}`);
    }
  };

  if (productDetail.loading || feedback.loading)
    return (
      <Spin
        size="large"
        className="flex justify-center items-center h-screen"
      />
    );
  if (!product) return <ErrorProduct />;

  const isNew = product.deviceType === 1;

  return (
    <div className="container mx-auto p-8  ">
      <div className=" max-w-6xl mb-4 ">
        <BreadcrumbNav
          items={[
            { label: "Home", path: "/" },
            { label: "Shop", path: "/view-all" },
            { label: "Product Details" },
          ]}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 bg-white border rounded-md shadow-md p-4   ">
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
            {allImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`attachment-${index}`}
                className={`w-16 h-16 object-cover cursor-pointer border rounded ${
                  selectedImage === img ? "border-blue-500" : ""
                }`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="col-span-2 ">
          <div className="grid grid-cols-2 md:grid-cols-2 gap-1  text-md font-medium">
            <div className="flex space-x-2">
              <p>Available:</p>
              {/* <p className="text-headerBg">{isNew ? "New" : "Secondhand"}</p> */}
              <p className="text-headerBg">{product.quantity}</p>
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
              <p className="text-headerBg">{product.category.label || "N/A"}</p>
            </div>
            <div className="flex space-x-2">
              <p>Brand:</p>
              <p className="text-headerBg">{product.manufacturer || "N/A"}</p>
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
            {/* <Button
              onClick={HandleAddToCart}
              className="h-10 w-full bg-yellow-500 text-white font-semibold uppercase hover:scale-101"
            >
              Add to cart
            </Button> */}
            <div className="flex justify-between items-center space-x-2 ">
              <Button
                onClick={HandleAddToCart}
                className="h-10 w-[50%] bg-yellow-500 text-white font-semibold uppercase hover:scale-101"
              >
                Add to cart
              </Button>
              <Button
                onClick={HandleBuynow}
                className="w-[50%] h-10 bg-headerBg text-white font-semibold uppercase hover:scale-101"
              >
                Buy Now
              </Button>
              {/* <Button className="w-[50%] h-10 bg-headerBg text-white font-semibold uppercase hover:scale-101">
                Add course
              </Button> */}
            </div>
          </div>
        </div>
        {/* cam ket */}
        <div className="col-span-2 space-y-2">
          <div className="border border-headerBg rounded-md ">
            <h1 className="text-white bg-headerBg p-2 font-semibold ">
              Your Trust, Our Commitment.
            </h1>
            <div className="">
              <ul className=" p-3 space-y-2">
                <li className=" flex space-x-2">
                  <img
                    width="20"
                    height="20"
                    src="//bizweb.dktcdn.net/100/522/662/themes/958202/assets/camket_1.png?1740416909712"
                    alt="Kiểm tra sản phẩm trước khi bán"
                  />
                  {/* <p> Kiểm tra sản phẩm trước khi bán </p> */}
                  <p> Check products before selling </p>
                </li>
                <li className=" flex space-x-2">
                  <img
                    width="20"
                    height="20"
                    src="//bizweb.dktcdn.net/100/522/662/themes/958202/assets/camket_2.png?1740416909712"
                    alt="Tư vấn tận tâm"
                  />
                  {/* <p>Tư vấn tận tâm </p> */}
                  <p>Dedicated advice </p>
                </li>
                <li className=" flex space-x-2">
                  <img
                    width="20"
                    height="20"
                    src="//bizweb.dktcdn.net/100/522/662/themes/958202/assets/camket_3.png?1740416909712"
                    alt="Vận chuyển nhanh chóng"
                  />
                  {/* <p>Vận chuyển nhanh chóng</p> */}
                  <p>Fast shipping</p>
                </li>
                <li className=" flex space-x-2">
                  <img
                    width="20"
                    height="20"
                    src="//bizweb.dktcdn.net/100/522/662/themes/958202/assets/camket_4.png?1740416909712"
                    alt="Bảo hành trách nhiệm"
                  />
                  {/* <p> Bảo hành trách nhiệm</p> */}
                  <p>Responsible warranty</p>
                </li>
              </ul>
            </div>
          </div>
          <div className="border border-headerBg rounded-md ">
            <h1 className="text-white bg-headerBg p-2 font-semibold">
              Promotion
            </h1>

            <p className="p-3 indent-2 break-normal">
              Free Standard Shipping (3-5 days) for prepaid orders over 2
              million VND nationwide (excluding orders weighing over 500g).
            </p>
          </div>
        </div>
      </div>
      {/* shop info */}

      <div className="flex items-center bg-white border rounded-md shadow-md p-4 my-4">
        {product?.storeInfo ? (
          <>
            {/* Avatar của shop */}
            <div className="flex-shrink-0 mr-4">
              <Link to={`/shop-infomation/${product.storeInfo.id}`}>
                <img
                  src={product.storeInfo.imageUrl}
                  alt={product.storeInfo.name}
                  className="w-16 h-16 rounded-full object-cover border-gray-300 border"
                />
              </Link>
            </div>

            <div className="flex-shrink-0">
              <h1 className="text-lg font-medium">{product.storeInfo.name}</h1>

              <div className="flex gap-2 mt-2 flex-none">
                <button className=" px-4 py-2 border border-blue-500 bg-blue-100 text-blue-600 rounded-sm hover:bg-gray-100 transition-colors text-sm">
                  <MessageOutlined className="mr-2" />
                  Chat Now
                </button>
                <Link to={`/shop-infomation/${product.storeInfo.id}`}>
                  <button className="px-4 py-2 border border-gray-300 text-gray-600 rounded-sm hover:bg-gray-100 transition-colors text-sm">
                    <ShopOutlined className="mr-2" />
                    View Shop
                  </button>
                </Link>
              </div>
            </div>

            <div className="h-20 w-px bg-gray-300 mx-4"></div>

            <div className="grid grid-cols-2 gap-4 w-full">
              {/* Cột 1 */}
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                  <span className="text-gray-500">Evaluates:</span>
                  <span className="text-blue-600">
                    {product.storeInfo.numberOfFeedbacks}
                  </span>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="text-gray-500">Products:</span>
                  <span className="text-blue-600">
                    {product.storeInfo.storeNumberOfProducts || "N/A"}
                  </span>
                </div>
              </div>

              {/* Cột 2 */}
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                  <span className="text-gray-500">Joined:</span>
                  <span className="text-blue-600">
                    {joinedMonths} month ago
                  </span>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="text-gray-500">None:</span>
                  <span className="text-blue-600">none</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <p>No shop information available.</p>
        )}
      </div>
      {/* Tabs & Viewed Products Section */}
      <div className="grid grid-cols-10 gap-4 p-4 -mx-4 rounded-md ">
        <div className="col-span-7 p-4 bg-white border shadow-md rounded-md">
          <Tabs
            defaultActiveKey="1"
            className="font-bold"
            items={[
              {
                key: "1",
                label: "Product Details",
                children: (
                  <div className="space-y-4 font-normal">
                    {/* Summary - Chỉ hiển thị nếu có dữ liệu */}
                    {product.summary && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Summary</h3>
                        <p className="text-gray-700">{product.summary}</p>
                      </div>
                    )}

                    {/* Description - Chỉ hiển thị nếu có dữ liệu */}
                    {product.description && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Description
                        </h3>
                        <p className="text-gray-700 whitespace-pre-line">
                          {product.description}
                        </p>
                      </div>
                    )}

                    {/* Basic Info - Chỉ hiển thị nếu có ít nhất một trường dữ liệu */}
                    {(product.weight ||
                      product.warrantyMonth ||
                      product.category?.label ||
                      product.model) && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Basic Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          {/* Mỗi trường chỉ hiển thị nếu có giá trị */}
                          {product.weight !== undefined &&
                            product.weight !== null && (
                              <div>
                                <p className="text-gray-500">Weight</p>
                                <p className="font-medium">
                                  {product.weight} kg
                                </p>
                              </div>
                            )}

                          {product.warrantyMonth !== undefined &&
                            product.warrantyMonth !== null && (
                              <div>
                                <p className="text-gray-500">Warranty</p>
                                <p className="font-medium">
                                  {product.warrantyMonth} months
                                </p>
                              </div>
                            )}

                          {product.category?.label && (
                            <div>
                              <p className="text-gray-500">Category</p>
                              <p className="font-medium">
                                {product.category.label}
                              </p>
                            </div>
                          )}

                          {product.model && (
                            <div>
                              <p className="text-gray-500">Model</p>
                              <p className="font-medium">{product.model}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Specifications - Chỉ hiển thị nếu có dữ liệu */}
                    {product.specifications && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Specifications
                        </h3>
                        <p className="text-gray-700 whitespace-pre-line">
                          {product.specifications}
                        </p>
                      </div>
                    )}

                    {/* Device Specifications - Chỉ hiển thị nếu có dữ liệu */}
                    {product.deviceSpecificationsList?.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Technical Specifications
                        </h3>
                        {product.deviceSpecificationsList.map(
                          (specGroup, index) => (
                            <div key={index} className="mb-6">
                              {/* Chỉ hiển thị tên nhóm nếu có */}
                              {specGroup.name && (
                                <h4 className="font-medium mb-2">
                                  {specGroup.name}
                                </h4>
                              )}

                              {/* Chỉ hiển thị bảng nếu có items */}
                              {specGroup.deviceSpecificationItemsList?.length >
                                0 && (
                                <div className="overflow-x-auto">
                                  <table className="min-w-full border">
                                    <thead className="bg-gray-50">
                                      <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                                          Property
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                                          Value
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                      {specGroup.deviceSpecificationItemsList.map(
                                        (item, itemIndex) => (
                                          <tr key={itemIndex}>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-700 border">
                                              {item.specificationProperty ||
                                                "N/A"}
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 border">
                                              {item.specificationValue || "N/A"}
                                            </td>
                                          </tr>
                                        )
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                ),
              },
              {
                key: "2",
                label: "Reviews",
                children: (
                  <div className="space-y-4">
                    {feedback.feedbackHistory?.length > 0 ? (
                      feedback.feedbackHistory.map((review, index) => (
                        <div
                          key={index}
                          className="p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors rounded-md"
                        >
                          {/* Header: Tên người dùng và Rating */}
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-semibold text-gray-800">
                              {`Anonymous ${review.createdBy}`}
                            </p>
                            <Rate
                              disabled
                              defaultValue={review.rating}
                              className="text-sm"
                            />
                          </div>

                          {/* Thời gian tạo */}
                          <p className="text-xs text-gray-500 mb-2">
                            {new Date(review.createdDate).toLocaleString(
                              "en-EN",
                              {
                                dateStyle: "medium",
                                timeStyle: "short",
                              }
                            )}
                          </p>

                          {/* Nội dung feedback */}
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {review.content || "No comment"}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500 italic mb-4">
                          There are currently no reviews for this product. Be
                          the first to share your thoughts!
                        </p>
                        {/* <Button
                          type="primary"
                          className="bg-blue-500 hover:bg-blue-600"
                          onClick={() => {
                            message.info("Review submission feature coming soon!");
                          }}
                        >
                          Submit Your Review
                        </Button> */}
                      </div>
                    )}
                  </div>
                ),
              },
            ]}
          />
        </div>
        <div className="col-span-3 bg-white border shadow-md rounded-md p-4">
          <div className="flex justify-start items-center space-x-3 rounded-md bg-headerBg text-white p-2 m-1">
            <StarOutlined className="text-2xl" />
            <h2 className="text-md font-semibold">Viewed products</h2>
          </div>
          <p>none</p>
        </div>
      </div>
    </div>
  );
}
