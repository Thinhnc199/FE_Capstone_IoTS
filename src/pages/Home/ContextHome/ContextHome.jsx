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
    dispatch(fetchCombos({ pageIndex: 1, pageSize: 8, searchKeyword: "" }));
  }, [
    dispatch,
    pageIndex,
    pageSize,
    searchKeyword,
    startFilterDate,
    endFilterDate,
  ]);

  const responsiveCarouselSettings = {
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 5,
    slidesToScroll: 2,
    initialSlide: 2,
    prevArrow: (
      <LeftOutlined className="text-xl sm:text-2xl md:text-3xl text-red-500" />
    ),
    nextArrow: (
      <RightOutlined className="text-xl sm:text-2xl md:text-3xl text-red-500" />
    ),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const responsiveComboSettings = {
    ...responsiveCarouselSettings,
    slidesToShow: Math.min(combos?.length || 0, 5),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
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

      <div className="mb-8 p-2 sm:p-4 rounded-md space-y-4 bgGradient">
        <Titles
          titleText="Today"
          colorText="text-headerBg"
          strongText="font-semibold"
        />
        <div className="gap-4 items-end flex flex-col sm:flex-row justify-start sm:space-x-20">
          <p className="text-xl sm:text-2xl md:text-3xl font-semibold">
            Flash Sales
          </p>
          <CountdownTimer />
        </div>
        {items.length > 0 ? (
          <Carousel {...responsiveCarouselSettings}>
            {items.map((product) => (
              <div key={product.id} className="px-1 sm:px-2">
                <ProductCard product={product} />
              </div>
            ))}
          </Carousel>
        ) : (
          <p className="text-center text-gray-500">No new products available</p>
        )}
      </div>

      <div className="container mx-auto p-2 sm:p-4 bg-white  my-4 sm:my-6 rounded-md">
        <Titles
          titleText="New Arrivals "
          colorText="text-headerBg"
          strongText="font-semibold"
        />
        <div className="gap-4 items-end flex flex-col sm:flex-row justify-between sm:space-x-20">
          <p className="text-xl sm:text-2xl md:text-3xl font-semibold">
            Iot Items
          </p>
          <Link
            to="/view-all"
            className="text-blue-700 text-base sm:text-lg md:text-xl text-shadow drop-shadow-[0_2px_2px_rgba(0,122,255,0.5)] px-2 sm:px-4"
          >
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4 my-2 sm:my-4">
          {items && items.length > 0 ? (
            items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="col-span-full text-center">No products available</p>
          )}
        </div>
      </div>
      {/* Combos Section */}
      {/* <div className="container mx-auto p-2 sm:p-4 bg-white  my-4 sm:my-6 rounded-md">
        <Titles
          titleText="Hot"
          colorText="text-headerBg"
          strongText="font-semibold"
        />
        <div className="gap-4 items-end flex flex-col sm:flex-row justify-between sm:space-x-20">
          <p className="text-xl sm:text-2xl md:text-3xl font-semibold">
            Combos
          </p>
          <Link
            to="/view-all"
            className="text-blue-700 text-base sm:text-lg md:text-xl text-shadow drop-shadow-[0_2px_2px_rgba(0,122,255,0.5)] px-2 sm:px-4"
          >
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4 my-2 sm:my-4">
          {items && items.length > 0 ? (
            items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="col-span-full text-center">No products available</p>
          )}
        </div>
      </div> */}

      <div className="mb-8 p-2 sm:p-4 rounded-md space-y-4 bg-white">
        <Titles
          titleText="Hot"
          colorText="text-headerBg"
          strongText="font-semibold"
        />
        <div className="gap-4 items-end flex flex-col sm:flex-row justify-between sm:space-x-20">
          <p className="text-xl sm:text-2xl md:text-3xl font-semibold">
            Combos
          </p>
          <Link
            to="/combos"
            className="text-blue-700 text-base sm:text-lg md:text-xl text-shadow drop-shadow-[0_2px_2px_rgba(0,122,255,0.5)] px-2 sm:px-4"
          >
            View all combos
          </Link>
        </div>
        {comboLoading ? (
          <p className="text-center text-gray-500">Loading combos...</p>
        ) : combos?.length > 0 ? (
          <Carousel {...responsiveComboSettings}>
            {combos
              .filter((combo) => combo.isActive === 1)
              .slice(0, 4)
              .map((combo) => (
                <div key={combo.id} className="px-1 sm:px-2">
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
