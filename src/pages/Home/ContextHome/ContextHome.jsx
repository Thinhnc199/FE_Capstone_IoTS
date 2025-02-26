import Titles from "../../../components/common/Titles";
import CountdownTimer from "../components/CountdownTimer";
import ProductCard from "../components/ProductCard";
import { Carousel } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import "./ContextHome.css";
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
    <div className=" md:px-6 lg:px-10 py-6  ">
      {/* Phần Flash Sales */}
      <div></div>
      <div className="mb-8 p-4 rounded-md space-y-4 bgGradient">
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

      <div className="mb-8 p-4 rounded-md space-y-4 bgGradient">
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
    </div>
  );
}
