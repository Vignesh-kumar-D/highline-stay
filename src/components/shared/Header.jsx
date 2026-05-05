import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import styles from './Header.module.css';

const links = [
  { to: '/', label: 'Home' },
  { to: '/rooms', label: 'Rooms' },
  { to: '/services', label: 'Services' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = () => setOpen(false);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand} onClick={close}>
          <span className={styles.brandMark}>HL</span>
          <span className={styles.brandText}>
            <span className={styles.brandTitle}>Highline</span>
            <span className={styles.brandSub}>Luxurious Stay</span>
          </span>
        </Link>

        <button
          className={styles.menuBtn}
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={() => setOpen(v => !v)}
        >
          <span className={`${styles.bar} ${open ? styles.barOpen1 : ''}`} />
          <span className={`${styles.bar} ${open ? styles.barOpen2 : ''}`} />
          <span className={`${styles.bar} ${open ? styles.barOpen3 : ''}`} />
        </button>

        <nav className={`${styles.nav} ${open ? styles.navOpen : ''}`}>
          <ul className={styles.navList}>
            {links.map(link => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  onClick={close}
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.active : ''}`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <a
            href="#book"
            className={styles.bookBtn}
            onClick={close}
          >
            Book Now
          </a>
        </nav>
      </div>
    </header>
  );
}
