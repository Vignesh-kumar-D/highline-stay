import { useState } from 'react';
import Hero from '../shared/Hero';
import Carousel from '../shared/Carousel';
import ContactBar from '../shared/ContactBar';
import styles from './Gallery.module.css';

export default function Gallery() {
  const galleryImages = [
    'https://highlineluxuriousstay.in/wp-content/uploads/2024/05/TFC05656-1-1024x683.jpg',
    'https://highlineluxuriousstay.in/wp-content/uploads/2024/05/TFC05661-1-1024x683.jpg',
    'https://highlineluxuriousstay.in/wp-content/uploads/2024/05/TFC05940-2-1024x683.jpg',
    'https://highlineluxuriousstay.in/wp-content/uploads/2024/05/TFC05852-2-1024x683.jpg',
    'https://highlineluxuriousstay.in/wp-content/uploads/2024/05/TFC05390-3-1024x683.jpg',
    'https://highlineluxuriousstay.in/wp-content/uploads/2024/05/New-Project-1-1024x534.jpg'
  ];

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'rooms', name: 'Rooms' },
    { id: 'views', name: 'Views' },
    { id: 'amenities', name: 'Amenities' }
  ];

  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <>
      <Hero
        title="Gallery"
        description="Explore the beauty of Highline Luxurious Stay"
        backgroundImage={galleryImages[0]}
      />

      <ContactBar />

      <section className={styles.gallerySection}>
        <div className={styles.container}>
          <h2 className={styles.title}>Gallery</h2>

          <div className={styles.categoryFilter}>
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`${styles.categoryBtn} ${selectedCategory === cat.id ? styles.active : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className={styles.carouselContainer}>
            <Carousel
              images={galleryImages}
              autoplay={true}
            />
          </div>

          <div className={styles.galleryGrid}>
            {galleryImages.map((image, idx) => (
              <div key={idx} className={styles.galleryItem}>
                <img src={image} alt={`Gallery ${idx + 1}`} />
                <div className={styles.overlay}>
                  <button className={styles.viewBtn}>View</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
