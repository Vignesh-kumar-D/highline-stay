import Hero from '../shared/Hero';
import BookingWidget from '../shared/BookingWidget';
import Carousel from '../shared/Carousel';
import RoomCard from '../shared/RoomCard';
import FAQItem from '../shared/FAQItem';
import ContactBar from '../shared/ContactBar';
import styles from './Home.module.css';
import rooms from '../../data/rooms.json';
import faq from '../../data/faq.json';
import services from '../../data/services.json';

export default function Home() {
  const handleRoomSelect = (room) => {
    console.log('Room selected:', room);
    // Navigate to room details or open modal
  };

  const heroBgImage = 'https://highlineluxuriousstay.in/wp-content/uploads/2024/05/TFC05840-scaled-e1714918378207.jpg';

  return (
    <>
      <Hero
        title="Welcome to Highline Luxurious Stay"
        description="Relax yourself at the most comfortable luxury cottages in Kodaikanal with stunning mountain views"
        backgroundImage={heroBgImage}
      >
        <BookingWidget />
      </Hero>

      <ContactBar />

      {/* Experience Section */}
      <section className={styles.experienceSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Explore the Experience</h2>
          <p className={styles.sectionSubtitle}>
            What makes Highline Luxurious Stay's Kodai cottages special
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

      {/* Featured Rooms Section */}
      <section className={styles.roomsSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Our Rooms</h2>
          <p className={styles.sectionSubtitle}>
            Choose from our variety of cottages for unforgettable stays
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

      {/* Gallery Preview */}
      <section className={styles.gallerySection}>
        <div className={styles.container}>
          <Carousel
            title="Gallery Showcase"
            images={[
              'https://highlineluxuriousstay.in/wp-content/uploads/2024/05/TFC05656-1-1024x683.jpg',
              'https://highlineluxuriousstay.in/wp-content/uploads/2024/05/TFC05661-1-1024x683.jpg',
              'https://highlineluxuriousstay.in/wp-content/uploads/2024/05/TFC05940-2-1024x683.jpg',
              'https://highlineluxuriousstay.in/wp-content/uploads/2024/05/TFC05852-2-1024x683.jpg'
            ]}
          />
        </div>
      </section>

      {/* About Section */}
      <section className={styles.aboutSection}>
        <div className={styles.container}>
          <div className={styles.aboutContent}>
            <h2>About Highline Luxurious Stay</h2>
            <p>
              We are committed to provide guests with natural comfort and solace from the hustle and bustle of life. Our vision is to be the most preferred luxury cottage destination in Kodaikanal.
            </p>
            <div className={styles.valuesGrid}>
              <div className={styles.valueItem}>
                <h4>Mission</h4>
                <p>Providing exceptional stays that reconnect guests with nature.</p>
              </div>
              <div className={styles.valueItem}>
                <h4>Vision</h4>
                <p>To be the most preferred luxury destination in Kodaikanal.</p>
              </div>
              <div className={styles.valueItem}>
                <h4>Excellence</h4>
                <p>Quality and sustainability in every detail of our service.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faqSection}>
        <div className={styles.container}>
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
