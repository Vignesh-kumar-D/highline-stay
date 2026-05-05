import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import styles from './Carousel.module.css';

export default function Carousel({ images, autoplay = true, title }) {
  return (
    <div className={styles.carouselContainer}>
      {title && <h2 className={styles.title}>{title}</h2>}
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={autoplay ? { delay: 5000, disableOnInteraction: false } : false}
        loop
        className={styles.swiper}
      >
        {images.map((image, idx) => (
          <SwiperSlide key={idx}>
            <img src={image} alt={`Slide ${idx + 1}`} className={styles.image} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
