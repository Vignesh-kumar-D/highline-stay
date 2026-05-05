import { Link } from 'react-router-dom';
import styles from './Footer.module.css';
import content from '../../data/content.json';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.section}>
            <Link to="/" className={styles.brand}>
              <span className={styles.brandMark}>HL</span>
              <span>
                <span className={styles.brandTitle}>Highline</span>
                <span className={styles.brandSub}>Luxurious Stay</span>
              </span>
            </Link>
            <p className={styles.about}>{content.company.tagline}</p>
          </div>

          <div className={styles.section}>
            <h4>Explore</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/rooms">Rooms</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/gallery">Gallery</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className={styles.section}>
            <h4>Get in touch</h4>
            <p>{content.contact.location}</p>
            <p>
              <a href={`tel:${content.contact.phone}`}>{content.contact.phone}</a>
            </p>
            <p>
              <a
                href={`https://wa.me/${content.contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp us
              </a>
            </p>
          </div>

          <div className={styles.section}>
            <h4>Follow</h4>
            <div className={styles.socials}>
              <a href="#" className={styles.socialLink} aria-label="Facebook">Facebook</a>
              <a href="#" className={styles.socialLink} aria-label="Instagram">Instagram</a>
              <a href="#" className={styles.socialLink} aria-label="Twitter">Twitter</a>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© {new Date().getFullYear()} Highline Luxurious Stay. All rights reserved.</p>
          <p className={styles.note}>Also visit Into the Wild Adventure Stay.</p>
        </div>
      </div>
    </footer>
  );
}
