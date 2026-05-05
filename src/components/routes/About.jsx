import Hero from '../shared/Hero';
import ContactBar from '../shared/ContactBar';
import styles from './About.module.css';
import content from '../../data/content.json';

export default function About() {
  return (
    <>
      <Hero
        title="About Us"
        backgroundImage="https://highlineluxuriousstay.in/wp-content/uploads/2024/05/TFC05840-scaled-e1714918378207.jpg"
      />

      <ContactBar />

      <section className={styles.aboutSection}>
        <div className={styles.container}>
          <h2 className={styles.title}>Highline Luxurious Stay</h2>
          <p className={styles.subtitle}>{content.company.description}</p>

          <div className={styles.aboutContent}>
            <p>{content.about}</p>
          </div>
        </div>
      </section>

      <section className={styles.missionVisionSection}>
        <div className={styles.container}>
          <div className={styles.grid}>
            <div className={styles.card}>
              <h3>Mission</h3>
              <p>{content.mission}</p>
            </div>

            <div className={styles.card}>
              <h3>Vision</h3>
              <p>{content.vision}</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.valuesSection}>
        <div className={styles.container}>
          <h2 className={styles.title}>Our Core Values</h2>

          <div className={styles.valuesGrid}>
            {content.values.map((value, idx) => (
              <div key={idx} className={styles.valueCard}>
                <div className={styles.valueIcon}>{idx + 1}</div>
                <h4>{value}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.approachSection}>
        <div className={styles.container}>
          <h2 className={styles.title}>Our Approach</h2>

          <div className={styles.approachGrid}>
            <div className={styles.approachItem}>
              <h3>🌍 Environmental Responsibility</h3>
              <p>
                Every detail from location to construction was planned to complement, not compete with the natural environment. We maintain a delicate balance between comfort and sustainability.
              </p>
            </div>

            <div className={styles.approachItem}>
              <h3>😊 Genuine Hospitality</h3>
              <p>
                Our dedicated team ensures every guest receives warm, genuine hospitality and exceptional service. We believe in creating memorable experiences, not just providing accommodation.
              </p>
            </div>

            <div className={styles.approachItem}>
              <h3>⭐ Quality Excellence</h3>
              <p>
                We are consistently committed to maintaining the highest standards in every aspect of our service - from maintenance to guest care to sustainable practices.
              </p>
            </div>

            <div className={styles.approachItem}>
              <h3>🏔️ Natural Comfort</h3>
              <p>
                We offer guests natural comfort and solace from the hustle and bustle of life. Our cottages blend modern amenities with natural surroundings for the perfect retreat.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
