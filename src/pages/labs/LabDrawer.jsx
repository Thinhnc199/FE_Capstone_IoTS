// import { useState, useCallback } from "react";
// import { Drawer, List, Button, message } from "antd";
// import { useDispatch, useSelector } from "react-redux"; // Thêm useSelector để lấy pageIndex, pageSize
// import { fetchAddCarts, fetchCarts } from "./../../redux/slices/cartSlice"; // Thêm fetchCarts
// import { ProductType } from "./../../redux/constants";
// import PropTypes from "prop-types";
// import { Link } from "react-router-dom";
// import { ShopOutlined } from "@ant-design/icons";
// const LabDrawer = ({ visible, onClose, labs }) => {
//   const dispatch = useDispatch();
//   const [addingLabId, setAddingLabId] = useState(null);
//   const { pageIndex, pageSize } = useSelector((state) => state.carts); // Lấy pageIndex, pageSize từ Redux store

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
//           // Cập nhật lại giỏ hàng trong Redux store sau khi thêm thành công
//           dispatch(fetchCarts({ pageIndex, pageSize }));
//         } else {
//           const errorMessage = result.payload || "Failed to add lab to cart";
//           throw new Error(errorMessage);
//         }
//       } catch (error) {
//         console.error(`Error adding lab ${labId} to cart:`, error);
//         message.error(`Error adding to cart: ${error.message}`);
//       } finally {
//         setAddingLabId(null);
//       }
//     },
//     [dispatch, pageIndex, pageSize] // Thêm pageIndex, pageSize vào dependency array
//   );

//   return (
//     <Drawer
//       title="Related Labs"
//       placement="right"
//       onClose={onClose}
//       visible={visible}
//       width={400}
//     >
//       <List
//         dataSource={labs}
//         renderItem={(lab) => (
//           <List.Item
//             key={lab.id}
//             actions={[
//               <Button
//                 key={`add-to-cart-${lab.id}`}
//                 type="primary"
//                 size="small"
//                 onClick={() => handleAddLabToCart(lab.id)}
//                 loading={addingLabId === lab.id}
//               >
//                 Add to Cart
//               </Button>,
//             ]}
//           >
//             <List.Item.Meta
//               title={
//                 <Link to={`/customer/lab-details/${lab.id}`}>{lab.title}</Link>
//               }
//               description={
//                 <div>
//                   <p>Price: {lab.price} VND</p>
//                   <p>
//                     {" "}
//                     <ShopOutlined />:{lab.storeName}
//                   </p>
//                 </div>
//               }
//             />
//           </List.Item>
//         )}
//       />
//     </Drawer>
//   );
// };

// // PropTypes
// LabDrawer.propTypes = {
//   visible: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   labs: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.number.isRequired,
//       title: PropTypes.string.isRequired,
//       summary: PropTypes.string,
//       price: PropTypes.number.isRequired,
//       storeName: PropTypes.string,
//     })
//   ).isRequired,
// };

// export default LabDrawer;

import { useState, useCallback } from "react";
import { Modal, List, Button, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchAddCarts, fetchCarts } from "../../redux/slices/cartSlice";
import { ProductType } from "../../redux/constants";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { ShopOutlined } from "@ant-design/icons";

const LabModal = ({ visible, onClose, labs }) => {
  const dispatch = useDispatch();
  const [addingLabId, setAddingLabId] = useState(null);
  const { pageIndex, pageSize } = useSelector((state) => state.carts);

  const handleAddLabToCart = useCallback(
    async (labId) => {
      setAddingLabId(labId);
      try {
        console.log("Adding lab to cart:", {
          productId: labId,
          productType: ProductType.LAB,
          quantity: 1,
        });
        const result = await dispatch(
          fetchAddCarts({
            productId: labId,
            productType: ProductType.LAB,
            quantity: 1,
          })
        );
        console.log("fetchAddCarts result:", result);

        if (fetchAddCarts.fulfilled.match(result)) {
          message.success("Lab added to cart successfully!");
          dispatch(fetchCarts({ pageIndex, pageSize }));
        } else {
          const errorMessage = result.payload || "Failed to add lab to cart";
          throw new Error(errorMessage);
        }
      } catch (error) {
        console.error(`Error adding lab ${labId} to cart:`, error);
        message.error(`Error adding to cart: ${error.message}`);
      } finally {
        setAddingLabId(null);
      }
    },
    [dispatch, pageIndex, pageSize]
  );

  return (
    <Modal
      title="Related Labs"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      centered
    >
      <List
        dataSource={labs}
        renderItem={(lab) => (
          <List.Item
            key={lab.id}
            actions={[
              <Button
                key={`add-to-cart-${lab.id}`}
                type="primary"
                size="small"
                onClick={() => handleAddLabToCart(lab.id)}
                loading={addingLabId === lab.id}
              >
                Add to Cart
              </Button>,
            ]}
          >
            <List.Item.Meta
              avatar={
                <img
                  src={lab.imageUrl}
                  alt={lab.labName}
                  className="w-12 h-12 rounded-md"
                />
              }
              title={
                <Link to={`/customer/lab-details/${lab.id}`}>{lab.title}</Link>
              }
              description={
                <div>
                  <p>Price: {lab.price} VND</p>
                  <p>
                    <ShopOutlined />: {lab.storeName}
                  </p>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </Modal>
  );
};

// PropTypes
LabModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  labs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      summary: PropTypes.string,
      price: PropTypes.number.isRequired,
      storeName: PropTypes.string,
    })
  ).isRequired,
};

export default LabModal;
