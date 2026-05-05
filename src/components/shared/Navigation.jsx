import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Navigation.module.css';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <button className={styles.menuBtn} onClick={toggleMenu}>
          {isOpen ? '✕' : '☰'}
        </button>

        <ul className={`${styles.navList} ${isOpen ? styles.active : ''}`}>
          <li>
            <Link to="/" onClick={closeMenu}>Home</Link>
          </li>
          <li>
            <Link to="/rooms" onClick={closeMenu}>Rooms</Link>
          </li>
          <li>
            <Link to="/services" onClick={closeMenu}>Services</Link>
          </li>
          <li>
            <Link to="/gallery" onClick={closeMenu}>Gallery</Link>
          </li>
          <li>
            <Link to="/about" onClick={closeMenu}>About</Link>
          </li>
          <li>
            <Link to="/contact" onClick={closeMenu}>Contact</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
