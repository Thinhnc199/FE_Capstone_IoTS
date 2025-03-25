// import { useState, useCallback } from "react";
// import { Drawer, List, Button, message } from "antd";
// import { useDispatch } from "react-redux";
// import { fetchAddCarts } from "./../../redux/slices/cartSlice";
// import { ProductType } from "./../../redux/constants";
// import PropTypes from "prop-types";
// import { Link } from "react-router-dom";

// const LabDrawer = ({ visible, onClose, labs }) => {
//   const dispatch = useDispatch();
//   const [addingLabId, setAddingLabId] = useState(null); // Theo dõi lab đang được thêm để hiển thị loading

//   // Xử lý thêm một lab vào giỏ hàng
//   const handleAddLabToCart = useCallback(
//     async (labId) => {
//       setAddingLabId(labId); // Đặt trạng thái loading cho lab đang được thêm
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
//             quantity: 1, // Giả sử mỗi lab chỉ thêm 1
//           })
//         );
//         console.log("fetchAddCarts result:", result);

//         if (fetchAddCarts.fulfilled.match(result)) {
//           message.success("Lab added to cart successfully!");
//         } else {
//           // Lấy thông điệp lỗi từ payload của rejected action
//           const errorMessage = result.payload || "Failed to add lab to cart";
//           throw new Error(errorMessage);
//         }
//       } catch (error) {
//         console.error(`Error adding lab ${labId} to cart:`, error);
//         // Hiển thị thông điệp lỗi từ API
//         message.error(`Error adding to cart: ${error.message}`);
//       } finally {
//         setAddingLabId(null); // Reset trạng thái loading
//       }
//     },
//     [dispatch]
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
//                 <Link to={`/customer/lab-details/${lab.id}`}>
//                   {lab.title}
//                 </Link>
//               }
//               description={
//                 <div>
//                   <p>Price: ${lab.price}</p>
//                   <p>Store: {lab.storeName}</p>
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
import { Drawer, List, Button, message } from "antd";
import { useDispatch, useSelector } from "react-redux"; // Thêm useSelector để lấy pageIndex, pageSize
import { fetchAddCarts, fetchCarts } from "./../../redux/slices/cartSlice"; // Thêm fetchCarts
import { ProductType } from "./../../redux/constants";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { ShopOutlined } from "@ant-design/icons";
const LabDrawer = ({ visible, onClose, labs }) => {
  const dispatch = useDispatch();
  const [addingLabId, setAddingLabId] = useState(null);
  const { pageIndex, pageSize } = useSelector((state) => state.carts); // Lấy pageIndex, pageSize từ Redux store

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
          // Cập nhật lại giỏ hàng trong Redux store sau khi thêm thành công
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
    [dispatch, pageIndex, pageSize] // Thêm pageIndex, pageSize vào dependency array
  );

  return (
    <Drawer
      title="Related Labs"
      placement="right"
      onClose={onClose}
      visible={visible}
      width={400}
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
              title={
                <Link to={`/customer/lab-details/${lab.id}`}>{lab.title}</Link>
              }
              description={
                <div>
                  <p>Price: {lab.price} VND</p>
                  <p>
                    {" "}
                    <ShopOutlined />:{lab.storeName}
                  </p>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </Drawer>
  );
};

// PropTypes
LabDrawer.propTypes = {
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

export default LabDrawer;
