import "react-lazy-load-image-component/src/effects/blur.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { RightOutlined } from "@ant-design/icons";
import ContextHome from "./ContextHome/ContextHome";
import { Carousel } from "antd";
const Home = () => {
  // Product categories
  const categories = [
    "Development Boards",
    "Components & Parts",
    "LCDs & Displays",
    "Raspberry Pi",
    "RP2040 / Pico",
    "Arduino",
    "Accessories",
  ];

  // Banner images
  const banners = [
    {
      id: 1,
      image: "/src/assets/imgs/BgSlice.png",
      alt: "Banner 1",
    },
    {
      id: 2,
      image: "/src/assets/imgs/BgSlice2.png",
      alt: "Banner 2",
    },
    {
      id: 3,
      image: "/src/assets/imgs/BgSlice.png",
      alt: "Banner 3",
    },
  ];

  return (
    <div className="flex justify-center flex-col bg-[#f1f9fc] py-6">
      <div className="container mx-auto grid grid-cols-10 pb-8 px-4 md:px-6 lg:px-10 gap-x-6 md:gap-x-8 lg:gap-x-10 items-start ">
        {/* Left-side categories (3 phần) */}
        <div className="col-span-3 bg-white w-full p-6 md:p-8 rounded-sm shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Categories
          </h2>
          <ul className="space-y-4">
            {categories.map((category, index) => (
              <li
                key={index}
                className="text-lg font-Mainfont font-medium text-gray-700 hover:text-[#007AFF] cursor-pointer flex justify-between items-center"
              >
                {category}
                <RightOutlined className="text-gray-600 text-sm" />
              </li>
            ))}
          </ul>
        </div>

        <div className="w-full col-span-7 rounded-md">
          <Carousel className="rounded-md" autoplaySpeed={5000} dots={true}>
            {banners.map((banner) => (
              <div
                id={banner.id}
                key={banner.id}
                className="w-full h-auto rounded-md"
              >
                <img src={banner.image} alt="img" className="rounded-md" />
              </div>
            ))}
          </Carousel>
        </div>
      </div>
      <div className=" container mx-auto">
        {" "}
        <ContextHome />
      </div>
    </div>
  );
};

export default Home;
