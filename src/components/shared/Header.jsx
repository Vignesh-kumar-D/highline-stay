import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <h1>Highline Luxurious Stay</h1>
          <p className={styles.tagline}>Luxury Cottages in Kodaikanal</p>
        </div>
      </div>
    </header>
  );
}
