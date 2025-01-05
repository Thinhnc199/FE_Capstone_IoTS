import Slider from "react-slick";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
    "Mechanical Keyboards",
    "Cables",
  ];

  // Banner images
  const banners = [
    {
      id: 1,
      image: "/images/banner01.jpg",
      alt: "Banner 1",
    },
    {
      id: 2,
      image: "/images/banner02.jpg",
      alt: "Banner 2",
    },
    {
      id: 3,
      image: "/images/banner03.jpg",
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
    <div className="container mx-auto flex bg-white py-8 space-x-8">
      {/* Left-side categories */}
      <div className="w-1/4 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Categories</h2>
        <ul className="space-y-4">
          {categories.map((category, index) => (
            <li
              key={index}
              className="text-lg font-medium text-gray-700 hover:text-[#007AFF] cursor-pointer flex justify-between items-center"
            >
              {category}
              <span>›</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Right-side carousel */}
      <div className="w-3/4 flex justify-center items-center">
        <div className="w-full max-w-3xl">
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
                  className="w-full max-h-[500px] object-contain rounded-lg shadow-lg"
                />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default Home;
