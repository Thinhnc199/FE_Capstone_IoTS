import Titles from "../../components/common/Titles";
import CountdownTimer from "./components/CountdownTimer";
import ProductCard from "./components/ProductCard";
import { Carousel } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
export default function ContextHome() {
  const carouselSettings = {
    arrows: true,
    infinite: false,
    slidesToShow: 4, // Số lượng sản phẩm hiển thị trong mỗi slide
    slidesToScroll: 1, // Số lượng sản phẩm cuộn mỗi lần
    prevArrow: <LeftOutlined className="text-3xl text-gray-500" />,
    nextArrow: <RightOutlined className="text-3xl text-gray-500" />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
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
    <div className="px-4 md:px-6 lg:px-10 py-6">
      {/* Phần Flash Sales */}
      <div className="mb-8 bg-white">
        <Titles titleText="Today" colorText="text-headerBg" />
        <div className=" gap-4 items-end flex justify-start space-x-20">
          <p className="text-2xl md:text-3xl font-semibold">Flash Sales</p>
          <CountdownTimer />
        </div>
        {/* <div className="flex flex-wrap gap-4 py-4"> */}
        <Carousel {...carouselSettings}>
          {" "}
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
        </Carousel>
        {/* </div> */}
      </div>

      <div className="mb-8 bg-white">
        <Titles titleText="Category" colorText="text-headerBg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <p className="text-2xl md:text-3xl font-semibold">
            Browse By Category
          </p>
        </div>
        <ProductCard />
      </div>
    </div>
  );
}
