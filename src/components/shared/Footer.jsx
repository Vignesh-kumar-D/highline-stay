import { Link } from 'react-router-dom';
import styles from './Footer.module.css';
import content from '../../data/content.json';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.section}>
            <h4>About Us</h4>
            <p>{content.company.tagline}</p>
          </div>

          <div className={styles.section}>
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/rooms">Rooms</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/gallery">Gallery</Link></li>
            </ul>
          </div>

          <div className={styles.section}>
            <h4>Contact Info</h4>
            <p>📍 {content.contact.location}</p>
            <p>📞 <a href={`tel:${content.contact.phone}`}>{content.contact.phone}</a></p>
            <p>💬 <a href={`https://wa.me/${content.contact.whatsapp}`} target="_blank" rel="noopener noreferrer">WhatsApp</a></p>
          </div>

          <div className={styles.section}>
            <h4>Follow Us</h4>
            <div className={styles.socials}>
              <a href="#" className={styles.socialLink}>Facebook</a>
              <a href="#" className={styles.socialLink}>Instagram</a>
              <a href="#" className={styles.socialLink}>Twitter</a>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>&copy; 2024 Highline Luxurious Stay. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
