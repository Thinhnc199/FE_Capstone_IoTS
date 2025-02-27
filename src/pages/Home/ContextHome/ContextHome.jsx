import Titles from "../../../components/common/Titles";
import CountdownTimer from "../components/CountdownTimer";
import ProductCard from "../components/ProductCard";
import { Carousel } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchProducts } from "../../../redux/slices/productSlice";
import "./ContextHome.css";

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

  useEffect(() => {
    dispatch(
      fetchProducts({
        pageIndex,
        pageSize,
        searchKeyword: searchKeyword,
        startFilterDate: startFilterDate,
        endFilterDate: endFilterDate,
      })
    );
  }, [
    dispatch,
    pageIndex,
    pageSize,
    searchKeyword,
    startFilterDate,
    endFilterDate,
  ]);

  const carouselSettings = {
    arrows: true,
    infinite: false,
    slidesToShow: Math.min(items.length, 4),
    slidesToScroll: 4,
    prevArrow: <LeftOutlined className="text-3xl text-red-500" />,
    nextArrow: <RightOutlined className="text-3xl text-red-500 " />,
    // centerMode: true,
    dots: false,
  };
  console.log("p", items);

  return (
    <div className=" md:px-6 lg:px-10   ">
      <div className="flex justify-center items-center pb-6">
        <p className=" font-semibold uppercase text-2xl">Recomment products</p>
      </div>
      {/* Phần Flash Sales */}
      <div className="mb-8 p-4 rounded-md space-y-4 bgGradient">
        <Titles titleText="Today" colorText="text-headerBg" />
        <div className=" gap-4 items-end flex justify-start space-x-20">
          <p className="text-2xl md:text-3xl font-semibold ">Flash Sales</p>
          <CountdownTimer />
        </div>

        <Carousel {...carouselSettings}>
          {items && items.length > 0 ? (
            items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p>No products available</p>
          )}
        </Carousel>
      </div>
      <hr className="p-4" />

      {/* Browse By Category */}
      <div className="mb-8 p-4 rounded-md space-y-4 bg-white ">
        <Titles titleText="Categories" colorText="text-headerBg" />
        <div className=" gap-4 items-end flex justify-start space-x-20">
          <p className="text-2xl md:text-3xl font-semibold">
            Browse By Category
          </p>
        </div>

        <div className="flex justify-center items-center gap-2 font-Mainfont">
          {" "}
          <div className="flex flex-col items-center p-4 border border-gray-300 rounded-lg bg-white ">
            <img
              height={50}
              alt="Icon representing Arduino"
              className="mb-2"
              src="https://storage.googleapis.com/a1aa/image/C2R_Nk4VjLzJP_aWhl61gNy7J2ZZ5i3JgrjwTlQOBe4.jpg"
            />
            <span>Arduino</span>
          </div>
          <div className="flex flex-col items-center p-4 border border-gray-300 rounded-lg bg-white ">
            <img
              alt="Icon representing Arduino"
              className="mb-2"
              src="https://storage.googleapis.com/a1aa/image/C2R_Nk4VjLzJP_aWhl61gNy7J2ZZ5i3JgrjwTlQOBe4.jpg"
            />
            <span>Arduino</span>
          </div>
          <div className="flex flex-col items-center p-4 border border-gray-300 rounded-lg bg-white ">
            <img
              alt="Icon representing Arduino"
              className="mb-2"
              src="https://storage.googleapis.com/a1aa/image/C2R_Nk4VjLzJP_aWhl61gNy7J2ZZ5i3JgrjwTlQOBe4.jpg"
            />
            <span>Arduino</span>
          </div>
          <div className="flex flex-col items-center p-4 border border-gray-300 rounded-lg bg-white ">
            <img
              alt="Icon representing Arduino"
              className="mb-2"
              src="https://storage.googleapis.com/a1aa/image/C2R_Nk4VjLzJP_aWhl61gNy7J2ZZ5i3JgrjwTlQOBe4.jpg"
            />
            <span>Arduino</span>
          </div>
          <div className="flex flex-col items-center p-4 border border-gray-300 rounded-lg bg-white ">
            <img
              alt="Icon representing Arduino"
              className="mb-2"
              src="https://storage.googleapis.com/a1aa/image/C2R_Nk4VjLzJP_aWhl61gNy7J2ZZ5i3JgrjwTlQOBe4.jpg"
            />
            <span>Arduino</span>
          </div>
        </div>
      </div>

      {/* Browse By Category */}
      <div className="mb-8 p-4 rounded-md space-y-4 bg-white ">
        <Titles titleText="Today" colorText="text-headerBg" />
        <div className=" gap-4 items-end flex justify-between space-x-20">
          <p className="text-2xl md:text-3xl font-semibold">Flash Sales</p>
          <a className="text-blue-700 text-xl text-shadow drop-shadow-[0_2px_2px_rgba(0,122,255,0.5)] px-4">
            View all
          </a>
        </div>
        <Carousel {...carouselSettings}>
          {items && items.length > 0 ? (
            items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p>No products available</p>
          )}
        </Carousel>
      </div>
    </div>
  );
}
