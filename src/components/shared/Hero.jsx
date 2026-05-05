import styles from './Hero.module.css';

export default function Hero({ title, description, backgroundImage, children }) {
  return (
    <section 
      className={styles.hero}
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}}
    >
      <div className={styles.overlay}></div>
      <div className={styles.container}>
        <div className={styles.content}>
          {title && <h1 className={styles.title}>{title}</h1>}
          {description && <p className={styles.description}>{description}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}
