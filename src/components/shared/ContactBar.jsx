import styles from './ContactBar.module.css';
import content from '../../data/content.json';

export default function ContactBar() {
  return (
    <div className={styles.contactBar}>
      <a
        href={`https://wa.me/${content.contact.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.btn}
        title="WhatsApp"
      >
        <span className={styles.icon}>💬</span>
        <span className={styles.label}>WhatsApp</span>
      </a>

      <a
        href={`tel:${content.contact.phone}`}
        className={styles.btn}
        title="Call"
      >
        <span className={styles.icon}>📞</span>
        <span className={styles.label}>Call</span>
      </a>
    </div>
  );
}
