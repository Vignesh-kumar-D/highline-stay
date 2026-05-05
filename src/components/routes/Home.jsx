import HeroSlider from '../shared/HeroSlider';
import BookingWidget from '../shared/BookingWidget';
import Carousel from '../shared/Carousel';
import RoomCard from '../shared/RoomCard';
import FAQItem from '../shared/FAQItem';
import styles from './Home.module.css';
import rooms from '../../data/rooms.json';
import faq from '../../data/faq.json';
import services from '../../data/services.json';

const heroSlides = [
  {
    eyebrow: 'Welcome To',
    title: 'Highline Luxurious Stay',
    description:
      'Unwind in our most comfortable cottages in Kodaikanal with stunning mountain views and serene surroundings.',
    image:
      'https://highlineluxuriousstay.in/wp-content/uploads/2024/05/TFC05840-scaled-e1714918378207.jpg',
    cta: { label: 'Watch Full Video', href: '#video' },
  },
  {
    eyebrow: 'Boutique Hill Retreat',
    title: 'Luxury Cottages in Kodai',
    description:
      'Enjoy the serenity of Kodaikanal with friends, family, or as couples in our beautifully appointed cottages.',
    image:
      'https://highlineluxuriousstay.in/wp-content/uploads/2024/05/TFC05656-1-1024x683.jpg',
    cta: { label: 'Watch Full Video', href: '#video' },
  },
  {
    eyebrow: 'Nature & Comfort',
    title: 'Memorable Mountain Stays',
    description:
      'Wake up to misty hills, sip tea on a private balcony, and reconnect with nature without giving up modern comfort.',
    image:
      'https://highlineluxuriousstay.in/wp-content/uploads/2024/05/TFC05940-2-1024x683.jpg',
    cta: { label: 'Explore Cottages', href: '/rooms' },
  },
];

export default function Home() {
  const handleRoomSelect = (room) => {
    console.log('Room selected:', room);
  };

  return (
    <>
      <HeroSlider slides={heroSlides} />

      <div id="book" className={styles.bookingWrap}>
        <BookingWidget variant="bar" />
      </div>

      {/* Welcome / Intro */}
      <section className={styles.introSection}>
        <div className={styles.container}>
          <span className={styles.eyebrow}>Highline Luxurious Stay</span>
          <h2 className={styles.sectionTitle}>
            Luxury cottages in the hills of Kodaikanal
          </h2>
          <p className={styles.lead}>
            Looking for the best luxurious cottages in Kodaikanal at an affordable price?
            Our exclusive private cottages come with thoughtful amenities and locations
            that offer different scenic views and experiences. Reach us in about 20 minutes
            from the city or the lake by cab or your own vehicle.
          </p>
        </div>
      </section>

      {/* Experience / Amenities */}
      <section className={styles.experienceSection}>
        <div className={styles.container}>
          <span className={styles.eyebrow}>Glossy Luxury Stay</span>
          <h2 className={styles.sectionTitle}>Explore the Experience</h2>
          <p className={styles.sectionSubtitle}>
            What makes our Kodai cottages truly special — every detail is curated
            for comfort, romance, and quiet escape.
          </p>

          <div className={styles.servicesGrid}>
            {services.map(service => (
              <div key={service.id} className={styles.serviceCard}>
                <div className={styles.serviceIcon}>{service.icon}</div>
                <h4 className={styles.serviceName}>{service.name}</h4>
                <p className={styles.serviceDesc}>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className={styles.philosophySection}>
        <div className={styles.container}>
          <div className={styles.philosophyGrid}>
            <div className={styles.philosophyImage}>
              <img
                src="https://highlineluxuriousstay.in/wp-content/uploads/2024/05/TFC05852-2-1024x683.jpg"
                alt="Cottage exterior with mountain view"
                loading="lazy"
              />
            </div>
            <div className={styles.philosophyContent}>
              <span className={styles.eyebrow}>Our Philosophy</span>
              <h2 className={styles.sectionTitle}>Built around the landscape</h2>
              <p>
                Our growth philosophy is articulated in our vision, mission, and core
                values. We aim for a careful balance between great guest experiences,
                sustainable operations, our team, and respect for the environment around us.
              </p>
              <p>
                Every detail — from the location to the construction of the cottages —
                was planned to complement the original surroundings rather than compete
                with them. The result is natural comfort and a genuine break from the
                bustle of everyday life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Rooms */}
      <section className={styles.roomsSection}>
        <div className={styles.container}>
          <span className={styles.eyebrow}>Our Rooms</span>
          <h2 className={styles.sectionTitle}>Cottages for every kind of stay</h2>
          <p className={styles.sectionSubtitle}>
            From cozy retreats for couples to spacious family cottages — choose the
            stay that fits your story.
          </p>

          <div className={styles.roomsGrid}>
            {rooms.slice(0, 2).map(room => (
              <RoomCard
                key={room.id}
                room={room}
                onSelect={handleRoomSelect}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Gallery preview */}
      <section className={styles.gallerySection}>
        <div className={styles.container}>
          <span className={styles.eyebrow}>Gallery Showcase</span>
          <h2 className={styles.sectionTitle}>A glimpse of the stay</h2>
          <Carousel
            images={[
              'https://highlineluxuriousstay.in/wp-content/uploads/2024/05/TFC05656-1-1024x683.jpg',
              'https://highlineluxuriousstay.in/wp-content/uploads/2024/05/TFC05661-1-1024x683.jpg',
              'https://highlineluxuriousstay.in/wp-content/uploads/2024/05/TFC05940-2-1024x683.jpg',
              'https://highlineluxuriousstay.in/wp-content/uploads/2024/05/TFC05852-2-1024x683.jpg',
            ]}
          />
        </div>
      </section>

      {/* Pricing */}
      <section className={styles.pricingSection}>
        <div className={styles.container}>
          <span className={styles.eyebrow}>Cottages In Kodaikanal With Price</span>
          <h2 className={styles.sectionTitle}>Transparent, friendly pricing</h2>
          <p className={styles.sectionSubtitle}>
            Final rates may vary by season and length of stay. Reach out for current
            offers and group discounts.
          </p>

          <div className={styles.pricingGrid}>
            {rooms.map(room => (
              <div key={room.id} className={styles.priceCard}>
                <div className={styles.priceImage}>
                  <img src={room.images[0]} alt={room.name} loading="lazy" />
                </div>
                <div className={styles.priceBody}>
                  <h4>{room.name}</h4>
                  <p className={styles.priceMeta}>
                    {room.bedrooms} BR · {room.bathrooms} Bath · Up to {room.capacity} guests
                  </p>
                  <p className={styles.priceValue}>{room.price}</p>
                  <a href="#book" className={styles.priceBtn}>Book Now</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.faqSection}>
        <div className={styles.container}>
          <span className={styles.eyebrow}>FAQs</span>
          <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>

          <div className={styles.faqList}>
            {faq.map(item => (
              <FAQItem
                key={item.id}
                question={item.question}
                answer={item.answer}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
