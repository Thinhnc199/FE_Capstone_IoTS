// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchCombos } from "../../../redux/slices/comboSlice";
// import { HeartOutlined, EyeOutlined } from "@ant-design/icons";
// import { TypeDevice } from "../../../redux/constants";
// import { Card, Button, Spin, Badge, Rate } from "antd";
// import { Link } from "react-router-dom";

// const ComboList = () => {
//   const dispatch = useDispatch();
//   const { combos, loading } = useSelector((state) => state.combo);

//   useEffect(() => {
//     dispatch(fetchCombos({ pageIndex: 1, pageSize: 18, searchKeyword: "" }));
//   }, [dispatch]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <Spin size="large" />
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto py-10 px-5">
//       <h1 className="text-center text-2xl font-semibold mb-6">Combo List</h1>
//       <div className="grid grid-cols-6 gap-6">
//         {combos
//           .filter((combo) => combo.isActive === 1)
//           .map((combo) => (
//             <Link to={`/detail-combo/${combo.id}`} key={combo.id}>
//               <Card
//                 hoverable
//                 cover={
//                   <div className="relative flex-shrink-0">
//                     {combo.deviceType === TypeDevice.NEWPRICE ? (
//                       <Badge.Ribbon text="New" color="red">
//                         <img
//                           alt={combo.name}
//                           src={combo.imageUrl || "/placeholder.jpg"}
//                           className="w-full h-48 rounded-t-lg scale-100 transition-all duration-300 group-hover:scale-90 p-3"
//                         />
//                       </Badge.Ribbon>
//                     ) : (
//                       <Badge.Ribbon text=" " color="red">
//                         <img
//                           alt={combo.name}
//                           src={combo.imageUrl || "/placeholder.jpg"}
//                           className="w-full h-48 rounded-t-lg scale-100 transition-all duration-300 group-hover:scale-90 p-3"
//                         />
//                       </Badge.Ribbon>
//                     )}
//                     <div className="absolute top-2 left-2 flex space-x-2">
//                       <Button
//                         shape="circle"
//                         className="bg-white p-2 rounded-full shadow-md"
//                         icon={<HeartOutlined />}
//                       />
//                       <Button
//                         shape="circle"
//                         className="bg-white p-2 rounded-full shadow-md"
//                         icon={<EyeOutlined />}
//                       />
//                     </div>
//                   </div>
//                 }
//                 className="shadow-lg rounded-xl border border-gray-200"
//               >
//                 <h2 className="text-lg font-semibold mb-2">{combo.name}</h2>
//                 <p className="text-blue-500 font-semibold">
//                   {combo.price.toLocaleString()} VND
//                 </p>
//                 <div className="flex items-center">
//                   <Rate disabled allowHalf defaultValue={combo.rating} />
//                 </div>
//                 <div className="mt-4 flex gap-2">
//                   <Button type="primary" className="bg-blue-500">
//                     Buy Now
//                   </Button>
//                   <Button>Add to Cart</Button>
//                 </div>
//               </Card>
//             </Link>
//           ))}
//       </div>
//     </div>
//   );
// };

// export default ComboList;


import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCombos } from "../../../redux/slices/comboSlice";
import { HeartOutlined, EyeOutlined } from "@ant-design/icons";
import { TypeDevice } from "../../../redux/constants";
import { Card, Button, Skeleton, Badge, Rate } from "antd";
import { Link } from "react-router-dom";

const ComboList = () => {
  const dispatch = useDispatch();
  const { combos, loading } = useSelector((state) => state.combo);

  useEffect(() => {
    dispatch(fetchCombos({ pageIndex: 1, pageSize: 18, searchKeyword: "" }));
    // dispatch(fetchCombos({ pageIndex: 1, pageSize: 12, searchKeyword: "" }));
  }, [dispatch]);

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-6 bg-mainColer">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} active avatar paragraph={{ rows: 2 }} className="w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-6 bg-mainColer">
      <h1 className="text-center text-3xl md:text-4xl font-bold text-headerBg mb-10">
        Combo List
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 ">
        {combos
          .filter((combo) => combo.isActive === 1)
          .map((combo) => (
            <Link to={`/detail-combo/${combo.id}`} key={combo.id}>
              <Card
                hoverable
                cover={
                  <div className="relative group">
                    {combo.deviceType === TypeDevice.NEWPRICE ? (
                      <Badge.Ribbon text="New" color="red" className="text-textColer">
                        <img
                          alt={combo.name}
                          src={combo.imageUrl || "/placeholder.jpg"}
                          className="w-full h-48 object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-95 p-3"
                        />
                      </Badge.Ribbon>
                    ) : (
                      <img
                        alt={combo.name}
                        src={combo.imageUrl || "/placeholder.jpg"}
                        className="w-full h-48 object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-95 p-3"
                      />
                    )}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        shape="circle"
                        className="bg-white p-2 shadow-md hover:bg-bgColer"
                        icon={<HeartOutlined className="text-textColer" />}
                        aria-label="Add to wishlist"
                      />
                      <Button
                        shape="circle"
                        className="bg-white p-2 shadow-md hover:bg-bgColer"
                        icon={<EyeOutlined className="text-textColer" />}
                        aria-label="Quick view"
                      />
                    </div>
                  </div>
                }
                className="shadow-lg rounded-xl border border-gray-200 bg-white hover:shadow-xl transition-shadow duration-300"
              >
                <h2 className="text-lg font-semibold text-textColer mb-2 truncate">
                  {combo.name}
                </h2>
                <p className="text-red-600 font-semibold text-xl">
                 $ {combo.price.toLocaleString()} 
                </p>
                <div className="flex items-center mt-2">
                  <Rate
                    disabled
                    allowHalf
                    defaultValue={combo.rating}
                    className="text-sm text-textColer"
                  />
                </div>
                <div className="mt-4 flex gap-3">
                  <Button
                    className="flex-1 h-10 font-semibold rounded-full bg-headerBg text-white hover:bg-opacity-90 transition"
                    aria-label="Buy now"
                  >
                    Buy Now
                  </Button>
                  <Button
                    className="flex-1 h-10 font-semibold rounded-full border border-headerBg text-headerBg hover:bg-bgColer transition"
                    aria-label="Add to cart"
                  >
                    Add to Cart
                  </Button>
                </div>
              </Card>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default ComboList;