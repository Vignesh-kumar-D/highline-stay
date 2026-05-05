import Hero from '../shared/Hero';
import styles from './Services.module.css';

const featureList = [
  { name: 'Gated Parking', icon: '🅿️' },
  { name: 'Water Heater', icon: '♨️' },
  { name: 'Off Road Jeep Ride For Breakfast', icon: '🚙' },
  { name: 'Free Wifi', icon: '📶' },
  { name: 'Smart TV', icon: '📺' },
  { name: 'Room Heater', icon: '🔥' },
  { name: 'Skylight Bedroom', icon: '🛏️' },
  { name: 'Shower', icon: '🚿' },
  { name: 'SkyLight Balcony', icon: '🌤️' },
  { name: 'Couple Swing', icon: '💑' },
  { name: 'Campfire', icon: '🔥' },
  { name: 'Toiletries', icon: '🧴' },
  { name: 'Jacuzzi', icon: '🛁' },
  { name: 'Hair Dryer', icon: '💨' },
  { name: 'Sitting Area', icon: '🛋️' },
  { name: 'Canopy Bed', icon: '🛏️' },
  { name: 'Kettles', icon: '🫖' },
  { name: 'Garden', icon: '🌿' },
];

export default function Services() {
  return (
    <>
      <Hero
        title="Services"
        backgroundImage="https://highlineluxuriousstay.in/wp-content/uploads/2024/05/TFC05852-2-1024x683.jpg"
      />

      <section className={styles.servicesSection}>
        <div className={styles.container}>
          <div className={styles.copyBlock}>
            <p>
              Head to visit the mesmerizing hills of Kodaikanal by staying in High line luxurious stay&apos;s budget friendly cottages. Immerse yourself in this beautiful nature by enjoying the modern conveniences in our cottage. Book our cottages with the best and most demanded package to relish your vacation to the fullest. Customer satisfaction is our ultimate goal. We provide the safest and cozy cottages that make you enjoy your memorable trip. At the high line luxurious stay, we have included all these amenities mentioned at the most affordable price. It will be great choice to choose our cottages and enjoy the family trip, friends group trip, couple honeymoon trip, etc.,
            </p>
            <p>
              In the High line luxurious stay, we provide a range of good cottages in Kodaikanal based on your budget if you&apos;re looking for affordable cottages in Kodaikanal. For those who wish to take advantage of all the amenities we offer while enjoying their vacation in Kodaikanal at a lower cost, our cottages are the ideal choice.
            </p>
            <p>
              We have made it our primary goal to provide you with the best value for your money because we understand how vital it is to acquire a reasonable price when booking cottages for holiday. No matter where you would want to stay or how much you want to spend, we will work hard to provide you with the ideal Kodaikanal cottages for you.
            </p>
            <p>
              Our main goal is to provide all travelers with high-quality cottages that come with outstanding services and additional amenities at a lower cost.
            </p>
          </div>

          <h2 className={styles.title}>Features Included</h2>

          <div className={styles.featuresGrid}>
            {featureList.map((feature) => (
              <div key={feature.name} className={styles.featureItem}>
                <span className={styles.featureIcon} aria-hidden="true">{feature.icon}</span>
                <span className={styles.featureText}>{feature.name}</span>
              </div>
            ))}
          </div>

          <p className={styles.closingText}>
            These features are exclusively planned to satisfy the customers staying in our Kodaikanal cottage packages. Book us for budget friendly home stay cottages with excellent service offered. Looking for a family friendly and peaceful atmosphere in Kodaikanal? The High line luxurious stay cottages are the best choice. Choose Us and spend your time memorably with our cottages.
          </p>
        </div>
      </section>
    </>
  );
}
