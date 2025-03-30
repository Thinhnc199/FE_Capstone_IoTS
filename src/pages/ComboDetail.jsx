// import { useEffect, useState, useCallback } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchComboDetails, fetchCombos } from "../redux/slices/comboSlice";
// import { fetchAddCarts, fetchCarts } from "../redux/slices/cartSlice";
// import { useParams, useNavigate } from "react-router-dom";
// import { InputNumber, Button, message, Skeleton, Row, Col, Modal } from "antd";
// import { ProductType } from "../redux/constants";
// import { memo } from "react";
// import { getLabMemberPagination } from "../redux/slices/labSlice";
// import ComboCard from "./../pages/Home/components/ComboCard";
// import { ShoppingCartOutlined } from "@ant-design/icons";

// const ComboDetail = () => {
//   const { comboId } = useParams();
//   const dispatch = useDispatch();
//   const { selectedCombo, loading, combos } = useSelector(
//     (state) => state.combo
//   );
//   const { pageIndex, pageSize } = useSelector((state) => state.carts);
//   const { labs, loading: labLoading } = useSelector((state) => state.lab);
//   const [numCart, setNumCart] = useState(1);
//   const [isAdding, setIsAdding] = useState(false);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [addingLabId, setAddingLabId] = useState(null);

//   const navigate = useNavigate();

//   useEffect(() => {
//     if (comboId) {
//       dispatch(fetchComboDetails(comboId));
//       dispatch(
//         getLabMemberPagination({
//           comboId,
//           params: { pageIndex: 0, pageSize: 10, searchKeyword: "" },
//         })
//       );
//       dispatch(fetchCombos({ pageIndex: 1, pageSize: 10, searchKeyword: "" }));
//     }
//     return () => {};
//   }, [dispatch, comboId]);

//   const onChange = useCallback(
//     (value) => {
//       if (value > selectedCombo?.data?.quantity) {
//         message.warning(`Only ${selectedCombo.data.quantity} items available`);
//         setNumCart(selectedCombo.data.quantity);
//         return;
//       }
//       setNumCart(value);
//     },
//     [selectedCombo]
//   );

//   const handleAddToCart = useCallback(async () => {
//     if (!selectedCombo?.data?.quantity) {
//       message.warning("Combo is out of stock.");
//       return;
//     }

//     try {
//       setIsAdding(true);
//       const result = await dispatch(
//         fetchAddCarts({
//           productId: comboId,
//           productType: ProductType.COMBO,
//           quantity: numCart,
//         })
//       );

//       if (fetchAddCarts.fulfilled.match(result)) {
//         message.success("Combo added to cart successfully!");
//         dispatch(fetchCarts({ pageIndex, pageSize }));
//       } else {
//         throw new Error(result.payload || "Unknown error");
//       }
//     } catch (error) {
//       message.error(`Error adding to cart: ${error}`);
//     } finally {
//       setIsAdding(false);
//     }
//   }, [dispatch, comboId, numCart, selectedCombo, pageIndex, pageSize]);

//   const handleImageClick = useCallback((imageUrl) => {
//     setSelectedImage(imageUrl);
//     setIsModalVisible(true);
//   }, []);

//   const handleModalClose = useCallback(() => {
//     setIsModalVisible(false);
//     setSelectedImage(null);
//   }, []);

//   const handleDeviceClick = (iotDeviceId) => {
//     navigate(`/detail/${iotDeviceId}`);
//   };

//   const handleAddLabToCart = useCallback(
//     async (labId) => {
//       setAddingLabId(labId);
//       try {
//         console.log("Adding lab to cart:", {
//           productId: labId,
//           productType: ProductType.LAB,
//           quantity: 1,
//         });
//         const result = await dispatch(
//           fetchAddCarts({
//             productId: labId,
//             productType: ProductType.LAB,
//             quantity: 1,
//           })
//         );
//         console.log("fetchAddCarts result:", result);

//         if (fetchAddCarts.fulfilled.match(result)) {
//           message.success("Lab added to cart successfully!");
//           dispatch(fetchCarts({ pageIndex, pageSize }));
//         } else {
//           const errorMessage = result.payload || "Failed to add lab to cart";
//           throw new Error(errorMessage);
//         }
//       } catch (error) {
//         console.error(`Error adding lab ${labId} to cart:`, error);
//         message.error(`Error: ${error.message}`);
//       } finally {
//         setAddingLabId(null);
//       }
//     },
//     [dispatch, pageIndex, pageSize]
//   );

//   if (loading) {
//     return (
//       <div className="container mx-auto py-8 px-4">
//         <Skeleton active avatar paragraph={{ rows: 6 }} />
//       </div>
//     );
//   }

//   if (!selectedCombo || Object.keys(selectedCombo).length === 0) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gray-100">
//         <div className="text-center">
//           <p className="text-xl font-semibold text-gray-800 mb-4">
//             No combo details available.
//           </p>
//           <Button
//             onClick={() => dispatch(fetchComboDetails(comboId))}
//             loading={loading}
//             disabled={loading}
//             className="h-10 px-6 rounded font-semibold bg-blue-600 text-white hover:bg-blue-700"
//           >
//             Retry
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   const attachments = Array.isArray(selectedCombo.data.attachmentsList)
//     ? selectedCombo.data.attachmentsList
//     : [];
//   const displayedAttachments = attachments.slice(0, 5);

//   return (
//     <div className="min-h-screen py-8 px-4 bg-mainColer">
//       <div className="container mx-auto max-w-7xl">
//         <div className="bg-white rounded-lg shadow-sm p-6">
//         <div className="col-span-full">
//           <h1 className="text-2xl font-bold w-full">{selectedCombo.data.name}</h1>
//           <hr className="my-2 bg-black" />
//         </div>
//           <Row gutter={[16, 16]}>
//             <Col xs={24} md={8}>

//               <div>
//                 <img
//                   src={selectedCombo.data.imageUrl}
//                   alt={selectedCombo.data.name}
//                   className="w-full h-80 object-contain cursor-pointer rounded"
//                   onClick={() => handleImageClick(selectedCombo.data.imageUrl)}
//                 />
//                 {attachments.length > 0 && (
//                   <div className="flex flex-wrap gap-2 mt-4">
//                     {displayedAttachments.map((attachment, index) => (
//                       <img
//                         key={attachment.id}
//                         src={attachment.imageUrl}
//                         alt={`Attachment ${index + 1}`}
//                         className="w-16 h-16 object-cover rounded border hover:border-textColer cursor-pointer"
//                         onClick={() => handleImageClick(attachment.imageUrl)}
//                       />
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </Col>

//             <Col xs={24} md={8}>
//               <div>
//                 {/* <h1 className="text-2xl font-bold text-headerBg mb-2">
//                   {selectedCombo.data.name}
//                 </h1> */}
//                 <p className="text-sm text-gray-600 mb-4">
//                   {selectedCombo.data.summary}
//                 </p>
//                 <div className="flex items-center mb-4">
//                   <span className="text-3xl font-semibold text-red-600">
//                     {selectedCombo.data.price.toLocaleString()}₫
//                   </span>
//                   {selectedCombo.data.quantity > 0 ? (
//                     <span className="ml-4 text-sm text-green-600">
//                       In Stock ({selectedCombo.data.quantity})
//                     </span>
//                   ) : (
//                     <span className="ml-4 text-sm text-red-600">
//                       Out of Stock
//                     </span>
//                   )}
//                 </div>

//                 <div className="border-t border-gray-200 pt-4">
//                   <div className="mb-4">
//                     <label className="block text-sm text-gray-700 mb-1">
//                       Quantity:
//                     </label>
//                     <InputNumber
//                       min={1}
//                       max={10}
//                       defaultValue={1}
//                       onChange={onChange}
//                       className="w-24 h-8"
//                     />
//                   </div>
//                   <Button
//                     onClick={handleAddToCart}
//                     loading={isAdding}
//                     className="w-full h-10 mb-2 rounded-md bg-headerBg text-white font-semibold hover:bg-opacity-90 border-none"
//                   >
//                     Add to Cart
//                   </Button>
//                   <Button className="w-full h-10 rounded-md bg-textColer text-white font-semibold hover:bg-opacity-90 border-none">
//                     Buy Now
//                   </Button>
//                   <p className="text-xs text-gray-500 mt-4">
//                     Serial: {selectedCombo.data.applicationSerialNumber}
//                   </p>
//                 </div>
//               </div>
//             </Col>

//             <Col xs={24} md={8}>
//               <div>
//                 <div className="text-sm text-gray-600 mb-4">
//                   Sold by:{" "}
//                   <span className="text-textColer">
//                     {selectedCombo.data.storeNavigationName}
//                   </span>
//                 </div>
//                 <div className="space-y-4">
//                   <div className="border border-headerBg rounded-md">
//                     <h1 className="text-white bg-headerBg p-2 font-semibold">
//                       Your Trust, Our Commitment.
//                     </h1>
//                     <div className="p-3 space-y-2">
//                       <ul className="space-y-2">
//                         <li className="flex space-x-2">
//                           <img
//                             width="20"
//                             height="20"
//                             src="//bizweb.dktcdn.net/100/522/662/themes/958202/assets/camket_1.png?1740416909712"
//                             alt="Check products before selling"
//                           />
//                           <p className="text-gray-700">
//                             Check products before selling
//                           </p>
//                         </li>
//                         <li className="flex space-x-2">
//                           <img
//                             width="20"
//                             height="20"
//                             src="//bizweb.dktcdn.net/100/522/662/themes/958202/assets/camket_2.png?1740416909712"
//                             alt="Dedicated advice"
//                           />
//                           <p className="text-gray-700">Dedicated advice</p>
//                         </li>
//                         <li className="flex space-x-2">
//                           <img
//                             width="20"
//                             height="20"
//                             src="//bizweb.dktcdn.net/100/522/662/themes/958202/assets/camket_3.png?1740416909712"
//                             alt="Fast shipping"
//                           />
//                           <p className="text-gray-700">Fast shipping</p>
//                         </li>
//                         <li className="flex space-x-2">
//                           <img
//                             width="20"
//                             height="20"
//                             src="//bizweb.dktcdn.net/100/522/662/themes/958202/assets/camket_4.png?1740416909712"
//                             alt="Responsible warranty"
//                           />
//                           <p className="text-gray-700">Responsible warranty</p>
//                         </li>
//                       </ul>
//                     </div>
//                   </div>
//                   <div className="border border-headerBg rounded-md">
//                     <h1 className="text-white bg-headerBg p-2 font-semibold">
//                       Promotion
//                     </h1>
//                     <p className="p-3 indent-2 break-normal text-gray-700">
//                       Free Standard Shipping (3-5 days) for prepaid orders over
//                       2 million VND nationwide (excluding orders weighing over
//                       500g).
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </Col>
//           </Row>
//         </div>

//         <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
//           <h2 className="text-2xl font-semibold text-headerBg mb-6 tracking-wide">
//             Labs related to combo
//           </h2>
//           <div className="mb-6">
//             {labLoading ? (
//               <Skeleton active paragraph={{ rows: 3 }} />
//             ) : labs?.data?.data?.length > 0 ? (
//               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                 {labs.data.data.map((lab) => (
//                   <div
//                     key={lab.id}
//                     className="p-4 bg-bgColer rounded-md border border-gray-200 hover:border-headerBg transition-colors flex flex-row items-start gap-4"
//                   >
//                     {lab.imageUrl && (
//                       <img
//                         src={lab.imageUrl}
//                         alt={lab.title}
//                         className="w-32 h-32 object-cover rounded-md flex-shrink-0"
//                       />
//                     )}
//                     <div className="flex-1">
//                       <p className="text-gray-800 font-semibold">
//                         <a href={`/customer/lab-details/${lab.id}`}>
//                           {lab.title}
//                         </a>
//                       </p>
//                       <p className="text-gray-600 text-sm">
//                         Summary: {lab.summary}
//                       </p>
//                       <p className="text-gray-600 text-sm">
//                         Price: {lab.price} ₫
//                       </p>
//                       <p className="text-gray-700 text-sm mt-1">
//                         Store:{" "}
//                         <span className="text-headerBg font-medium">
//                           {lab.storeName}
//                         </span>
//                       </p>
//                     </div>
//                     <Button
//                       key={`add-to-cart-${lab.id}`}
//                       type="primary"
//                       size="large"
//                       onClick={() => handleAddLabToCart(lab.id)}
//                       loading={addingLabId === lab.id}
//                     >
//                       <ShoppingCartOutlined />
//                     </Button>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-gray-500">No labs included in this combo.</p>
//             )}
//           </div>
//         </div>

//         {/* Combo Details Section */}
//         <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
//           <h2 className="text-2xl font-semibold text-headerBg mb-6 tracking-wide">
//             Combo Details
//           </h2>

//           <div className="mb-6">
//             <h3 className="text-lg font-medium text-gray-800 mb-2">
//               Combo Description
//             </h3>
//             <p className="text-gray-700 leading-relaxed">
//               {selectedCombo.data.description}
//             </p>
//           </div>

//           <div className="mb-6">
//             <h3 className="text-lg font-medium text-gray-800 mb-2">
//               Specifications
//             </h3>
//             <p className="text-gray-700 leading-relaxed">
//               {selectedCombo.data.specifications}
//             </p>
//           </div>

//           <div className="mb-6">
//             <h3 className="text-lg font-medium text-gray-800 mb-2">Notes</h3>
//             <p className="text-gray-700 leading-relaxed">
//               {selectedCombo.data.notes}
//             </p>
//           </div>

//           <div className="mb-6">
//             <h3 className="text-lg font-medium text-gray-800 mb-4">
//               Included Devices
//             </h3>
//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//               {selectedCombo.data.deviceComboList.map((device) => (
//                 <div
//                   key={device.deviceName}
//                   onClick={() => handleDeviceClick(device.iotDeviceId)}
//                   className="p-4 bg-bgColer rounded-md border border-gray-200 hover:border-headerBg transition-colors flex flex-row items-start gap-4"
//                 >
//                   <div className="flex-1">
//                     <p className="text-gray-800 font-semibold">
//                       {device.deviceName}
//                     </p>
//                     <p className="text-gray-600 text-sm">
//                       {device.deviceSummary}
//                     </p>
//                     <p className="text-gray-700 text-sm mt-1">
//                       Quantity:{" "}
//                       <span className="text-headerBg font-medium">
//                         {device.amount}
//                       </span>
//                     </p>
//                   </div>
//                   {device.imageUrl && (
//                     <img
//                       src={device.imageUrl}
//                       alt={device.deviceName}
//                       className="w-32 h-32 object-cover rounded-md flex-shrink-0"
//                     />
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Related Combos Section */}
//         <div className="mt-8">
//           <h2 className="text-xl font-semibold text-headerBg mb-4">
//             Related Combos
//           </h2>
//           <div className="overflow-x-auto flex gap-4 pb-4">
//             {combos.length > 0 ? (
//               combos
//                 .filter((combo) => combo.isActive === 1)
//                 .slice(0, 10)
//                 .map((combo) => (
//                   <div key={combo.id} className="min-w-[250px]">
//                     <ComboCard combo={combo} />
//                   </div>
//                 ))
//             ) : (
//               <p className="text-gray-500">No related combos available.</p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Image Modal */}
//       <Modal
//         visible={isModalVisible}
//         footer={null}
//         onCancel={handleModalClose}
//         centered
//         width={500}
//         bodyStyle={{ padding: 0 }}
//       >
//         {selectedImage && (
//           <img
//             src={selectedImage}
//             alt="Enlarged attachment"
//             className="w-full h-auto object-contain"
//           />
//         )}
//       </Modal>
//     </div>
//   );
// };

// export default memo(ComboDetail);

import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchComboDetails, fetchCombos } from "../redux/slices/comboSlice";
import { fetchAddCarts, fetchCarts } from "../redux/slices/cartSlice";
import { fetchFeedbackHistory } from "../redux/slices/feedbackSlice"; // Thêm feedback action
import { useParams, useNavigate } from "react-router-dom";
import {
  InputNumber,
  Button,
  message,
  Skeleton,
  Row,
  Col,
  Modal,
  Tabs,
  Rate,
} from "antd";
import { ProductType } from "../redux/constants";
import { memo } from "react";
import { getLabMemberPagination } from "../redux/slices/labSlice";
import ComboCard from "./../pages/Home/components/ComboCard";
import { ShoppingCartOutlined } from "@ant-design/icons";

const ComboDetail = () => {
  const { comboId } = useParams();
  const dispatch = useDispatch();
  const { selectedCombo, loading, combos } = useSelector(
    (state) => state.combo
  );
  const { pageIndex, pageSize } = useSelector((state) => state.carts);
  const { labs, loading: labLoading } = useSelector((state) => state.lab);
  const feedback = useSelector((state) => state.feedback); // Lấy feedback state
  const [numCart, setNumCart] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [addingLabId, setAddingLabId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (comboId) {
      dispatch(fetchComboDetails(comboId));
      dispatch(
        getLabMemberPagination({
          comboId,
          params: { pageIndex: 0, pageSize: 10, searchKeyword: "" },
        })
      );
      dispatch(fetchCombos({ pageIndex: 1, pageSize: 10, searchKeyword: "" }));
      // Gọi API feedback cho combo
      dispatch(
        fetchFeedbackHistory({
          advancedFilter: {
            productId: parseInt(comboId),
            productType: ProductType.COMBO, // Sử dụng ProductType.COMBO
          },
          paginationRequest: {
            pageIndex: 0,
            pageSize: 10,
            searchKeyword: "",
          },
        })
      );
    }
    return () => {};
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
      message.warning("Combo is out of stock.");
      return;
    }
    try {
      setIsAdding(true);
      const result = await dispatch(
        fetchAddCarts({
          productId: comboId,
          productType: ProductType.COMBO,
          quantity: numCart,
        })
      );
      if (fetchAddCarts.fulfilled.match(result)) {
        message.success("Combo added to cart successfully!");
        dispatch(fetchCarts({ pageIndex, pageSize }));
      } else {
        throw new Error(result.payload || "Unknown error");
      }
    } catch (error) {
      message.error(`Error adding to cart: ${error}`);
    } finally {
      setIsAdding(false);
    }
  }, [dispatch, comboId, numCart, selectedCombo, pageIndex, pageSize]);

  const HandleBuynow = async () => {
    if (!selectedCombo?.data?.quantity) {
      message.warning("The product is out of stock.");
      return;
    }

    try {
      const result = await dispatch(
        fetchAddCarts({
          productId: comboId,
          productType: ProductType.COMBO,
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

  const handleImageClick = useCallback((imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalVisible(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalVisible(false);
    setSelectedImage(null);
  }, []);

  const handleDeviceClick = (iotDeviceId) => {
    navigate(`/detail/${iotDeviceId}`);
  };

  const handleAddLabToCart = useCallback(
    async (labId) => {
      setAddingLabId(labId);
      try {
        const result = await dispatch(
          fetchAddCarts({
            productId: labId,
            productType: ProductType.LAB,
            quantity: 1,
          })
        );
        if (fetchAddCarts.fulfilled.match(result)) {
          message.success("Lab added to cart successfully!");
          dispatch(fetchCarts({ pageIndex, pageSize }));
        } else {
          throw new Error(result.payload || "Failed to add lab to cart");
        }
      } catch (error) {
        message.error(`Error: ${error.message}`);
      } finally {
        setAddingLabId(null);
      }
    },
    [dispatch, pageIndex, pageSize]
  );

  if (loading || feedback.loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Skeleton active avatar paragraph={{ rows: 6 }} />
      </div>
    );
  }

  if (!selectedCombo || Object.keys(selectedCombo).length === 0) {
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

  return (
    <div className="min-h-screen py-8 px-4 bg-mainColer">
      <div className="container mx-auto max-w-7xl">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="col-span-full">
            <h1 className="text-2xl font-bold w-full">
              {selectedCombo.data.name}
            </h1>
            <hr className="my-2 bg-black" />
          </div>
          <Row gutter={[16, 16]}>
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

            <Col xs={24} md={8}>
              <div>
                {/* <h1 className="text-2xl font-bold text-headerBg mb-2">
                      {selectedCombo.data.name}
                    </h1> */}
                <p className="text-sm text-gray-600 mb-4">
                  {selectedCombo.data.summary}
                </p>
                <div className="flex items-center mb-4">
                  <span className="text-3xl font-semibold text-red-600">
                    {selectedCombo.data.price.toLocaleString()}₫
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
                  <Button
                    onClick={HandleBuynow}
                    className="w-full h-10 rounded-md bg-textColer text-white font-semibold hover:bg-opacity-90 border-none"
                  >
                    Buy Now
                  </Button>
                  <p className="text-xs text-gray-500 mt-4">
                    Serial: {selectedCombo.data.applicationSerialNumber}
                  </p>
                </div>
              </div>
            </Col>

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

        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-headerBg mb-6 tracking-wide">
            Labs related to combo
          </h2>
          <div className="mb-6">
            {labLoading ? (
              <Skeleton active paragraph={{ rows: 3 }} />
            ) : labs?.data?.data?.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {labs.data.data.map((lab) => (
                  <div
                    key={lab.id}
                    className="p-4 bg-bgColer rounded-md border border-gray-200 hover:border-headerBg transition-colors flex flex-row items-start gap-4"
                  >
                    {lab.imageUrl && (
                      <img
                        src={lab.imageUrl}
                        alt={lab.title}
                        className="w-32 h-32 object-cover rounded-md flex-shrink-0"
                      />
                    )}
                    <div className="flex-1">
                      <p className="text-gray-800 font-semibold">
                        <a href={`/customer/lab-details/${lab.id}`}>
                          {lab.title}
                        </a>
                      </p>
                      <p className="text-gray-600 text-sm">
                        Summary: {lab.summary}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Price: {lab.price} ₫
                      </p>
                      <p className="text-gray-700 text-sm mt-1">
                        Store:{" "}
                        <span className="text-headerBg font-medium">
                          {lab.storeName}
                        </span>
                      </p>
                    </div>
                    <Button
                      key={`add-to-cart-${lab.id}`}
                      type="primary"
                      size="large"
                      onClick={() => handleAddLabToCart(lab.id)}
                      loading={addingLabId === lab.id}
                    >
                      <ShoppingCartOutlined />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No labs included in this combo.</p>
            )}
          </div>
        </div>

        {/* Combo Details Section với Tabs */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <Tabs
            defaultActiveKey="1"
            items={[
              {
                key: "1",
                label: "Combo Details",
                children: (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">
                        Combo Description
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {selectedCombo.data.description ||
                          "No description available."}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">
                        Specifications
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {selectedCombo.data.specifications ||
                          "No specifications available."}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">
                        Notes
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {selectedCombo.data.notes || "No notes available."}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-4">
                        Included Devices
                      </h3>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {selectedCombo.data.deviceComboList.map((device) => (
                          <div
                            key={device.deviceName}
                            onClick={() =>
                              handleDeviceClick(device.iotDeviceId)
                            }
                            className="p-4 bg-bgColer rounded-md border border-gray-200 hover:border-headerBg transition-colors flex flex-row items-start gap-4"
                          >
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
                          <p className="text-xs text-gray-500 mb-2">
                            {new Date(review.createdDate).toLocaleString(
                              "en-EN",
                              {
                                dateStyle: "medium",
                                timeStyle: "short",
                              }
                            )}
                          </p>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {review.content || "No comment"}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500 italic mb-4">
                          There are currently no reviews for this combo. Be the
                          first to share your thoughts!
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

        {/* Related Combos Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-headerBg mb-4">
            Related Combos
          </h2>
          <div className="overflow-x-auto flex gap-4 pb-4">
            {combos.length > 0 ? (
              combos
                .filter((combo) => combo.isActive === 1)
                .slice(0, 10)
                .map((combo) => (
                  <div key={combo.id} className="min-w-[250px]">
                    <ComboCard combo={combo} />
                  </div>
                ))
            ) : (
              <p className="text-gray-500">No related combos available.</p>
            )}
          </div>
        </div>
      </div>

      {/* Image Modal */}
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
