import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchComboDetails } from "../redux/slices/comboSlice";
import { fetchAddCarts, fetchCarts } from "../redux/slices/cartSlice";
import { useParams } from "react-router-dom";
import { InputNumber, Button, message, Skeleton, Row, Col, Modal } from "antd";
import { ProductType } from "../redux/constants";
import { memo } from "react";

// Type definitions
// const { Panel } = Collapse;

const ComboDetail = () => {
  const { comboId } = useParams();
  const dispatch = useDispatch();
  const { selectedCombo, loading } = useSelector((state) => state.combo);
  const { pageIndex, pageSize } = useSelector((state) => state.carts);
  const [numCart, setNumCart] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  useEffect(() => {
    console.log("Updated selectedCombo:", selectedCombo);
  }, [selectedCombo]);
  useEffect(() => {
    if (comboId) {
      dispatch(fetchComboDetails(comboId));
    }
    // Cleanup function if needed
    return () => {
      // Add cleanup logic if necessary
    };
  }, [dispatch, comboId]);

  const onChange = useCallback(
    (value) => {
      if (value > selectedCombo?.data?.quantity) {
        message.warning(`Only ${selectedCombo.data.quantity} items available`);
        setNumCart(selectedCombo.data.quantity);
        return;
      }
      setNumCart(value);
    },
    [selectedCombo]
  );

  const handleAddToCart = useCallback(async () => {
    if (!selectedCombo?.data?.quantity) {
      message.warning("Product is out of stock.");
      return;
    }

    try {
      setIsAdding(true);
      const result = await dispatch(
        fetchAddCarts({
          comboId,
          comboType: ProductType.DEVICE,
          quantity: numCart,
        })
      );

      if (fetchAddCarts.fulfilled.match(result)) {
        message.success("Product added to cart successfully!");
        dispatch(fetchCarts({ pageIndex, pageSize }));
      } else {
        throw new Error(result.payload?.message || "Failed to add to cart");
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      message.error(`Error adding to cart: ${error.message}`);
    } finally {
      setIsAdding(false);
    }
  }, [dispatch, comboId, numCart, selectedCombo, pageIndex, pageSize]);

  const handleImageClick = useCallback((imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalVisible(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalVisible(false);
    setSelectedImage(null);
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Skeleton active avatar paragraph={{ rows: 6 }} />
      </div>
    );
  }

  if (!selectedCombo || Object.keys(selectedCombo).length === 0) {
    console.log("No combo details available", selectedCombo);
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-800 mb-4">
            No combo details available.
          </p>
          <Button
            onClick={() => dispatch(fetchComboDetails(comboId))}
            loading={loading}
            disabled={loading}
            className="h-10 px-6 rounded font-semibold bg-blue-600 text-white hover:bg-blue-700"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const attachments = Array.isArray(selectedCombo.data.attachmentsList)
    ? selectedCombo.data.attachmentsList
    : [];
  const displayedAttachments = attachments.slice(0, 5);

  const relatedProducts = [
    // ... same dummy data as before
    {
      id: 1,
      name: "Combo A",
      price: 99.99,
      imageUrl:
        "https://i.pinimg.com/736x/22/7c/80/227c80570a076260040dddc88246d6a2.jpg",
    },
    {
      id: 2,
      name: "Combo B",
      price: 149.99,
      imageUrl:
        "https://i.pinimg.com/736x/0a/77/d8/0a77d85e0bbb28562072c1a37123c04e.jpg",
    },
    {
      id: 3,
      name: "Combo C",
      price: 79.99,
      imageUrl:
        "https://i.pinimg.com/736x/e1/27/c1/e127c1059e1c4a2cc3d49a62574d7ccd.jpg",
    },
    {
      id: 4,
      name: "Combo D",
      price: 199.99,
      imageUrl:
        "https://i.pinimg.com/736x/91/46/05/9146054c17cf25ddac1b3f2bd8ae0624.jpg",
    },
    {
      id: 5,
      name: "Combo E",
      price: 129.99,
      imageUrl:
        "https://i.pinimg.com/736x/34/7d/94/347d9463ac6f62fc8a0776b956cc6e05.jpg",
    },
    // ... other products
  ];

  return (
    <div className="min-h-screen py-8 px-4 bg-mainColer">
      <div className="container mx-auto max-w-7xl">
        {/* Main Content Container */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <Row gutter={[16, 16]}>
            {/* Left: Image Gallery */}
            <Col xs={24} md={8}>
              <div>
                <img
                  src={selectedCombo.data.imageUrl}
                  alt={selectedCombo.data.name}
                  className="w-full h-80 object-contain cursor-pointer rounded"
                  onClick={() => handleImageClick(selectedCombo.data.imageUrl)}
                />
                {attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {displayedAttachments.map((attachment, index) => (
                      <img
                        key={attachment.id}
                        src={attachment.imageUrl}
                        alt={`Attachment ${index + 1}`}
                        className="w-16 h-16 object-cover rounded border hover:border-textColer cursor-pointer"
                        onClick={() => handleImageClick(attachment.imageUrl)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </Col>

            {/* Middle: Product Info + Buy Box */}
            <Col xs={24} md={8}>
              <div>
                <h1 className="text-2xl font-bold text-headerBg mb-2">
                  {selectedCombo.data.name}
                </h1>
                <p className="text-sm text-gray-600 mb-4">
                  {selectedCombo.data.summary}
                </p>
                <div className="flex items-center mb-4">
                  <span className="text-3xl font-semibold text-red-600">
                    ${selectedCombo.data.price}
                  </span>
                  {selectedCombo.data.quantity > 0 ? (
                    <span className="ml-4 text-sm text-green-600">
                      In Stock ({selectedCombo.data.quantity})
                    </span>
                  ) : (
                    <span className="ml-4 text-sm text-red-600">
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Buy Box Section */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="mb-4">
                    <label className="block text-sm text-gray-700 mb-1">
                      Quantity:
                    </label>
                    <InputNumber
                      min={1}
                      max={10}
                      defaultValue={1}
                      onChange={onChange}
                      className="w-24 h-8"
                    />
                  </div>
                  <Button
                    onClick={handleAddToCart}
                    loading={isAdding}
                    className="w-full h-10 mb-2 rounded-md bg-headerBg text-white font-semibold hover:bg-opacity-90 border-none"
                  >
                    Add to Cart
                  </Button>
                  <Button className="w-full h-10 rounded-md bg-textColer text-white font-semibold hover:bg-opacity-90 border-none">
                    Buy Now
                  </Button>
                  <p className="text-xs text-gray-500 mt-4">
                    Serial: {selectedCombo.data.applicationSerialNumber}
                  </p>
                </div>
              </div>
            </Col>

            {/* Right: Commitment + Promotion */}
            <Col xs={24} md={8}>
              <div>
                <div className="text-sm text-gray-600 mb-4">
                  Sold by:{" "}
                  <span className="text-textColer">
                    {selectedCombo.data.storeNavigationName}
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="border border-headerBg rounded-md">
                    <h1 className="text-white bg-headerBg p-2 font-semibold">
                      Your Trust, Our Commitment.
                    </h1>
                    <div className="p-3 space-y-2">
                      <ul className="space-y-2">
                        <li className="flex space-x-2">
                          <img
                            width="20"
                            height="20"
                            src="//bizweb.dktcdn.net/100/522/662/themes/958202/assets/camket_1.png?1740416909712"
                            alt="Check products before selling"
                          />
                          <p className="text-gray-700">
                            Check products before selling
                          </p>
                        </li>
                        <li className="flex space-x-2">
                          <img
                            width="20"
                            height="20"
                            src="//bizweb.dktcdn.net/100/522/662/themes/958202/assets/camket_2.png?1740416909712"
                            alt="Dedicated advice"
                          />
                          <p className="text-gray-700">Dedicated advice</p>
                        </li>
                        <li className="flex space-x-2">
                          <img
                            width="20"
                            height="20"
                            src="//bizweb.dktcdn.net/100/522/662/themes/958202/assets/camket_3.png?1740416909712"
                            alt="Fast shipping"
                          />
                          <p className="text-gray-700">Fast shipping</p>
                        </li>
                        <li className="flex space-x-2">
                          <img
                            width="20"
                            height="20"
                            src="//bizweb.dktcdn.net/100/522/662/themes/958202/assets/camket_4.png?1740416909712"
                            alt="Responsible warranty"
                          />
                          <p className="text-gray-700">Responsible warranty</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="border border-headerBg rounded-md">
                    <h1 className="text-white bg-headerBg p-2 font-semibold">
                      Promotion
                    </h1>
                    <p className="p-3 indent-2 break-normal text-gray-700">
                      Free Standard Shipping (3-5 days) for prepaid orders over
                      2 million VND nationwide (excluding orders weighing over
                      500g).
                    </p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>

        {/* Collapsible Details Section */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-headerBg mb-6 tracking-wide">
            Combo Details
          </h2>

          {/* Combo Description */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Combo Description
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {selectedCombo.data.description}
            </p>
          </div>

          {/* Specifications */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Specifications
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {selectedCombo.data.specifications}
            </p>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Notes</h3>
            <p className="text-gray-700 leading-relaxed">
              {selectedCombo.data.notes}
            </p>
          </div>

          {/* Included Devices */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Included Devices
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {selectedCombo.data.deviceComboList.map((device) => (
                <div
                  key={device.deviceName}
                  className="p-4 bg-bgColer rounded-md border border-gray-200 hover:border-headerBg transition-colors flex flex-row items-start gap-4"
                >
                  {/* Thông tin bên trái */}
                  <div className="flex-1">
                    <p className="text-gray-800 font-semibold">
                      {device.deviceName}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {device.deviceSummary}
                    </p>
                    <p className="text-gray-700 text-sm mt-1">
                      Quantity:{" "}
                      <span className="text-headerBg font-medium">
                        {device.amount}
                      </span>
                    </p>
                  </div>

                  {/* Hình ảnh bên phải */}
                  {device.imageUrl && (
                    <img
                      src={device.imageUrl}
                      alt={device.deviceName}
                      className="w-32 h-32 object-cover rounded-md flex-shrink-0"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-headerBg mb-6 tracking-wide">
            Combo Details
          </h2>
          <Collapse
            bordered={false}
            expandIconPosition="right"
            className="mt-4"
            ghost
            expandIcon={({ isActive }) => (
              <span
                className={`text-headerBg transition-transform ${
                  isActive ? "rotate-180" : "rotate-0"
                }`}
              >
                ▼
              </span>
            )}
          >
            <Panel
              header={
                <span className="text-lg font-medium text-gray-800 hover:text-textColer transition-colors">
                  Combo Description
                </span>
              }
              key="1"
              className="bg-white rounded-md shadow-sm mb-2 hover:shadow-md transition-shadow"
            >
              <p className="text-gray-700 leading-relaxed">
                {selectedCombo.data.description}
              </p>
            </Panel>
            <Panel
              header={
                <span className="text-lg font-medium text-gray-800 hover:text-textColer transition-colors">
                  Specifications
                </span>
              }
              key="2"
              className="bg-white rounded-md shadow-sm mb-2 hover:shadow-md transition-shadow"
            >
              <p className="text-gray-700 leading-relaxed">
                {selectedCombo.data.specifications}
              </p>
            </Panel>
            <Panel
              header={
                <span className="text-lg font-medium text-gray-800 hover:text-textColer transition-colors">
                  Notes
                </span>
              }
              key="3"
              className="bg-white rounded-md shadow-sm mb-2 hover:shadow-md transition-shadow"
            >
              <p className="text-gray-700 leading-relaxed">
                {selectedCombo.data.notes}
              </p>
            </Panel>
            <Panel
              header={
                <span className="text-lg font-medium text-gray-800 hover:text-textColer transition-colors">
                  Included Devices
                </span>
              }
              key="4"
              className="bg-white rounded-md shadow-sm mb-2 hover:shadow-md transition-shadow"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {selectedCombo.data.deviceComboList.map((device) => (
                  <div
                    key={device.deviceName}
                    className="p-4 bg-bgColer rounded-md border border-gray-200 hover:border-headerBg transition-colors"
                  >
                    <p className="text-gray-800 font-semibold">
                      {device.deviceName}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {device.deviceSummary}
                    </p>
                    <p className="text-gray-700 text-sm mt-1">
                      Quantity:{" "}
                      <span className="text-headerBg font-medium">
                        {device.amount}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </Panel>
          </Collapse>
        </div> */}

        {/* Related Products Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-headerBg mb-4">
            Related Products
          </h2>
          <div className="overflow-x-auto flex gap-4 pb-4">
            {relatedProducts.map((product) => (
              <div
                key={product.id}
                className="min-w-[200px] bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-32 object-cover rounded mb-2"
                />
                <p className="text-sm font-medium text-textColer truncate">
                  {product.name}
                </p>
                <p className="text-sm text-headerBg">${product.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal for Enlarged Image */}
      <Modal
        visible={isModalVisible}
        footer={null}
        onCancel={handleModalClose}
        centered
        width={500}
        bodyStyle={{ padding: 0 }}
      >
        {selectedImage && (
          <img
            src={selectedImage}
            alt="Enlarged attachment"
            className="w-full h-auto object-contain"
          />
        )}
      </Modal>
    </div>
  );
};

export default memo(ComboDetail);
