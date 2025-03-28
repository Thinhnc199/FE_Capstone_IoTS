// import Titles from "../../../components/common/Titles";
// import CountdownTimer from "../components/CountdownTimer";
// import ProductCard from "../components/ProductCard";
// import { Carousel, Divider } from "antd";
// import { LeftOutlined, RightOutlined } from "@ant-design/icons";
// import { useDispatch, useSelector } from "react-redux";
// import { useEffect } from "react";
// import { fetchProducts } from "../../../redux/slices/productSlice";
// import "./ContextHome.css";
// import { Link } from "react-router-dom";

// export default function ContextHome() {
//   const dispatch = useDispatch();
//   const {
//     items,
//     pageIndex,
//     pageSize,
//     searchKeyword,
//     startFilterDate,
//     endFilterDate,
//   } = useSelector((state) => state.products);

//   useEffect(() => {
//     dispatch(
//       fetchProducts({
//         pageIndex,
//         pageSize,
//         searchKeyword,
//         startFilterDate,
//         endFilterDate,
//       })
//     );
//   }, [
//     dispatch,
//     pageIndex,
//     pageSize,
//     searchKeyword,
//     startFilterDate,
//     endFilterDate,
//   ]);

//   const slidesToShow =
//     items && items.length > 0 ? Math.min(items.length, 4) : 1;

//   const carouselSettings = {
//     arrows: true,
//     infinite: false,
//     slidesToShow,
//     slidesToScroll: Math.min(slidesToShow, 4),
//     prevArrow: <LeftOutlined className="text-3xl text-red-500" />,
//     nextArrow: <RightOutlined className="text-3xl text-red-500" />,
//     dots: false,
//   };

//   return (
//     <div className="md:px-6 lg:px-10">
//       <div className="flex justify-center items-center pb-6">
//         <Divider
//           style={{ borderColor: "#007AFF" }}
//           className="font-semibold uppercase"
//         >
//           Recommend Products
//         </Divider>
//       </div>

//       {/* Flash Sales */}
//       <div className="mb-8 p-4 rounded-md space-y-4 bgGradient">
//         <Titles
//           titleText="Today"
//           colorText="text-headerBg"
//           strongText="font-semibold"
//         />
//         <div className="gap-4 items-end flex justify-start space-x-20">
//           <p className="text-2xl md:text-3xl font-semibold">Flash Sales</p>
//           <CountdownTimer />
//         </div>

//         {items.length > 0 ? (
//           <Carousel {...carouselSettings}>
//             {items.map((product) => (
//               <div key={product.id} className="px-2">
//                 {" "}
//                 {/* Thêm padding giữa các card */}
//                 <ProductCard product={product} />
//               </div>
//             ))}
//           </Carousel>
//         ) : (
//           <p className="text-center text-gray-500">No new products available</p>
//         )}
//       </div>

//       <hr className="p-4" />

//       {/* Another Flash Sales Section */}
//       <div className="mb-8 p-4 rounded-md space-y-4 bg-white">
//         <Titles
//           titleText="Today"
//           colorText="text-headerBg"
//           strongText="font-semibold"
//         />
//         <div className="gap-4 items-end flex justify-between space-x-20">
//           <p className="text-2xl md:text-3xl font-semibold">Flash Sales</p>
//           <Link
//             to="/view-all"
//             className="text-blue-700 text-xl text-shadow drop-shadow-[0_2px_2px_rgba(0,122,255,0.5)] px-4"
//           >
//             View all
//           </Link>
//         </div>
//         {items.length > 0 ? (
//           <Carousel {...carouselSettings}>
//             {items.map((product) => (
//               <div key={product.id} className="px-2">
//                 {" "}
//                 {/* Thêm padding giữa các card */}
//                 <ProductCard product={product} />
//               </div>
//             ))}
//           </Carousel>
//         ) : (
//           <p className="text-center text-gray-500">No new products available</p>
//         )}
//       </div>
//     </div>
//   );
// }

import Titles from "../../../components/common/Titles";
import CountdownTimer from "../components/CountdownTimer";
import ProductCard from "../components/ProductCard";
import ComboCard from "../components/ComboCard";
import { Carousel, Divider } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchProducts } from "../../../redux/slices/productSlice";
import { fetchCombos } from "../../../redux/slices/comboSlice";
import "./ContextHome.css";
import { Link } from "react-router-dom";

export default function ContextHome() {
  const dispatch = useDispatch();
  const {
    items,
    pageIndex,
    pageSize,
    searchKeyword,
    startFilterDate,
    endFilterDate,
  } = useSelector((state) => state.products);
  const { combos, loading: comboLoading } = useSelector((state) => state.combo);

  useEffect(() => {
    dispatch(
      fetchProducts({
        pageIndex,
        pageSize,
        searchKeyword,
        startFilterDate,
        endFilterDate,
      })
    );
    dispatch(fetchCombos({ pageIndex: 1, pageSize: 4, searchKeyword: "" }));
  }, [
    dispatch,
    pageIndex,
    pageSize,
    searchKeyword,
    startFilterDate,
    endFilterDate,
  ]);

  const slidesToShow =
    items && items.length > 0 ? Math.min(items.length, 4) : 1;
  const comboSlidesToShow =
    combos && combos.length > 0 ? Math.min(combos.length, 4) : 1;

  const carouselSettings = {
    arrows: true,
    infinite: false,
    slidesToShow,
    slidesToScroll: Math.min(slidesToShow, 4),
    prevArrow: <LeftOutlined className="text-3xl text-red-500" />,
    nextArrow: <RightOutlined className="text-3xl text-red-500" />,
    dots: false,
  };

  const comboCarouselSettings = {
    arrows: true,
    infinite: false,
    slidesToShow: comboSlidesToShow,
    slidesToScroll: Math.min(comboSlidesToShow, 4),
    prevArrow: <LeftOutlined className="text-3xl text-red-500" />,
    nextArrow: <RightOutlined className="text-3xl text-red-500" />,
    dots: false,
  };

  return (
    <div className="md:px-6 lg:px-10">
      <div className="flex justify-center items-center pb-0">
        <Divider
          style={{ borderColor: "#007AFF" }}
          className="font-semibold uppercase"
        >
          Recommend Products
        </Divider>
      </div>

      <div className="mb-8 p-4 rounded-md space-y-4 bgGradient">
        <Titles
          titleText="Today"
          colorText="text-headerBg"
          strongText="font-semibold"
        />
        <div className="gap-4 items-end flex justify-start space-x-20">
          <p className="text-2xl md:text-3xl font-semibold">Flash Sales</p>
          <CountdownTimer />
        </div>
        {items.length > 0 ? (
          <Carousel {...carouselSettings}>
            {items.map((product) => (
              <div key={product.id} className="px-2">
                <ProductCard product={product} />
              </div>
            ))}
          </Carousel>
        ) : (
          <p className="text-center text-gray-500">No new products available</p>
        )}
      </div>

      <hr className="p-4" />

      <div className="mb-8 p-4 rounded-md space-y-4 bg-white">
        <Titles
          titleText="Today"
          colorText="text-headerBg"
          strongText="font-semibold"
        />
        <div className="gap-4 items-end flex justify-between space-x-20">
          <p className="text-2xl md:text-3xl font-semibold">Flash Sales</p>
          <Link
            to="/view-all"
            className="text-blue-700 text-xl text-shadow drop-shadow-[0_2px_2px_rgba(0,122,255,0.5)] px-4"
          >
            View all
          </Link>
        </div>
        {items.length > 0 ? (
          <Carousel {...carouselSettings}>
            {items.map((product) => (
              <div key={product.id} className="px-2">
                <ProductCard product={product} />
              </div>
            ))}
          </Carousel>
        ) : (
          <p className="text-center text-gray-500">No new products available</p>
        )}
      </div>

      <div className="mb-8 p-4 rounded-md space-y-4 bg-white">
        <Titles
          titleText="Hot"
          colorText="text-headerBg"
          strongText="font-semibold"
        />
        <div className="gap-4 items-end flex justify-between space-x-20">
          <p className="text-2xl md:text-3xl font-semibold">Combo Deals</p>
          <Link
            to="/combos"
            className="text-blue-700 text-xl text-shadow drop-shadow-[0_2px_2px_rgba(0,122,255,0.5)] px-4"
          >
            View all combos
          </Link>
        </div>
        {comboLoading ? (
          <p className="text-center text-gray-500">Loading combos...</p>
        ) : combos.length > 0 ? (
          <Carousel {...comboCarouselSettings}>
            {combos
              .filter((combo) => combo.isActive === 1)
              .slice(0, 4)
              .map((combo) => (
                <div key={combo.id} className="px-2">
                  <ComboCard combo={combo} />
                </div>
              ))}
          </Carousel>
        ) : (
          <p className="text-center text-gray-500">No combos available</p>
        )}
      </div>
    </div>
  );
}
