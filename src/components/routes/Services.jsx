import Hero from '../shared/Hero';
import ContactBar from '../shared/ContactBar';
import styles from './Services.module.css';
import services from '../../data/services.json';

export default function Services() {
  return (
    <>
      <Hero
        title="Our Services & Amenities"
        backgroundImage="https://highlineluxuriousstay.in/wp-content/uploads/2024/05/TFC05852-2-1024x683.jpg"
      />

      <ContactBar />

      <section className={styles.servicesSection}>
        <div className={styles.container}>
          <h2 className={styles.title}>Premium Amenities</h2>
          <p className={styles.subtitle}>
            Experience luxury with our world-class facilities and services
          </p>

          <div className={styles.servicesGrid}>
            {services.map(service => (
              <div key={service.id} className={styles.serviceCard}>
                <div className={styles.icon}>{service.icon}</div>
                <h3 className={styles.name}>{service.name}</h3>
                <p className={styles.description}>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.featuresSection}>
        <div className={styles.container}>
          <h2 className={styles.title}>Why Choose Us?</h2>

          <div className={styles.featuresGrid}>
            <div className={styles.featureItem}>
              <h3>Sustainability</h3>
              <p>We believe in eco-friendly practices that complement the natural environment while providing comfort to our guests.</p>
            </div>

            <div className={styles.featureItem}>
              <h3>Location</h3>
              <p>Just 20 minutes from the city center, surrounded by breathtaking mountain views and serene natural landscapes.</p>
            </div>

            <div className={styles.featureItem}>
              <h3>Hospitality</h3>
              <p>Our dedicated team ensures every guest receives genuine, warm hospitality and exceptional service.</p>
            </div>

            <div className={styles.featureItem}>
              <h3>Comfort</h3>
              <p>Modern amenities combined with natural beauty for the perfect balance of luxury and nature.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
