import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import styles from './HeroSlider.module.css';

export default function HeroSlider({ slides = [] }) {
  return (
    <section className={styles.hero}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        loop
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={1000}
        className={styles.swiper}
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx} className={styles.slide}>
            <div
              className={styles.image}
              style={{ backgroundImage: `url(${slide.image})` }}
              role="img"
              aria-label={slide.title}
            />
            <div className={styles.overlay} />
            <div className={styles.content}>
              <span className={styles.eyebrow}>{slide.eyebrow}</span>
              <h1 className={styles.title}>{slide.title}</h1>
              <p className={styles.description}>{slide.description}</p>
              {slide.cta && (
                <a
                  href={slide.cta.href || '#'}
                  className={styles.cta}
                  target={slide.cta.external ? '_blank' : undefined}
                  rel={slide.cta.external ? 'noopener noreferrer' : undefined}
                >
                  <span className={styles.ctaIcon} aria-hidden="true">▶</span>
                  <span>{slide.cta.label}</span>
                </a>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
