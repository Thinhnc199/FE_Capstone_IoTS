import Slider from "react-slick";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { RightOutlined } from "@ant-design/icons";
import ContextHome from "./ContextHome";
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

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    lazyLoad: "ondemand",
  };
  return (
    <div className="flex justify-center flex-col">
      <div className="container mx-auto grid grid-cols-10 pb-8 px-4 md:px-6 lg:px-10 gap-x-6 md:gap-x-8 lg:gap-x-10 items-start">
        {/* Left-side categories (3 phần) */}
        <div className="col-span-3 bg-white w-full p-6 md:p-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Categories
          </h2>
          <ul className="space-y-4">
            {categories.map((category, index) => (
              <li
                key={index}
                className="text-lg font-medium text-gray-700 hover:text-[#007AFF] cursor-pointer flex justify-between items-center"
              >
                {category}
                <RightOutlined className="text-gray-600 text-sm" />
              </li>
            ))}
          </ul>
        </div>
        {/* Right-side carousel (7 phần) */}
        <div className="col-span-7 flex justify-center items-center">
          <div className="w-full">
            <Slider {...sliderSettings}>
              {banners.map((banner) => (
                <div
                  key={banner.id}
                  className="w-full flex justify-center items-center"
                >
                  <LazyLoadImage
                    src={banner.image}
                    alt={banner.alt}
                    effect="blur"
                    className="w-full h-auto object-cover rounded-sm"
                  />
                </div>
              ))}
            </Slider>
          </div>
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
