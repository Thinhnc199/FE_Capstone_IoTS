import "react-lazy-load-image-component/src/effects/blur.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ContextHome from "./ContextHome/ContextHome";
import { Carousel, Skeleton } from "antd";
import { motion } from "framer-motion";
import { useState } from "react";

const Home = () => {
  const banners = [
    {
      id: 1,
      image:
        "https://firebasestorage.googleapis.com/v0/b/iot-trading-system-firebase.firebasestorage.app/o/image%2Fd426ced6-6d15-48c7-bafe-410e4369c220.png.png?alt=media&token=bc7d6a94-9812-43e8-b105-7a0277d07962",
      alt: "Banner 1",
      title: "IoT Solutions",
      description: "Transforming businesses with smart IoT technology.",
    },
    {
      id: 2,
      image:
        "https://firebasestorage.googleapis.com/v0/b/iot-trading-system-firebase.firebasestorage.app/o/image%2F57815bbf-b9d9-4e92-9a85-22c0bc4ae0d2.png.png?alt=media&token=3deb448c-5429-4b8c-a613-6b1e4e515708",
      alt: "Banner 2",
    },
    {
      id: 3,
      image:
        "https://firebasestorage.googleapis.com/v0/b/iot-trading-system-firebase.firebasestorage.app/o/image%2Fd426ced6-6d15-48c7-bafe-410e4369c220.png.png?alt=media&token=bc7d6a94-9812-43e8-b105-7a0277d07962",
      alt: "Banner 3",
    },
  ];

  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="flex justify-center flex-col bg-[#f1f9fc]">
      <div className="w-full">
        <Carousel
          autoplaySpeed={5000}
          dots={false}
          infinite={false}
          arrows={true}
          autoplay={true}
        >
          {banners.map((banner, index) => (
            <div key={banner.id} className="relative w-full h-auto">
              {/* Skeleton từ Ant Design */}
              {!imageLoaded && (
                <div className="absolute top-0 left-0 w-full h-full">
                  <Skeleton.Image active className="w-full h-auto" />
                </div>
              )}

              {/* Ảnh chính */}
              <img
                src={banner.image}
                alt={banner.alt}
                className={`w-full h-auto transition-opacity duration-700 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setImageLoaded(true)}
              />

              {/* Chỉ hiển thị chữ với banner đầu tiên */}
              {index === 0 && (
                <div className="absolute top-1/3 left-8 text-white">
                  {/* Tiêu đề xuất hiện trước */}
                  <motion.h1
                    initial={{ x: -200, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1.5 }}
                    className="text-4xl font-bold py-4"
                  >
                    {banner.title}
                  </motion.h1>

                  {/* Mô tả xuất hiện sau 0.8s */}
                  <motion.p
                    initial={{ x: -200, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1.5, delay: 0.8 }}
                    className="text-lg"
                  >
                    {banner.description}
                  </motion.p>
                </div>
              )}
            </div>
          ))}
        </Carousel>
      </div>

      <div className="container mx-auto">
        <ContextHome />
      </div>
    </div>
  );
};

export default Home;
