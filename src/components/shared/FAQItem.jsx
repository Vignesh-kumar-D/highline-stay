import { useState } from 'react';
import styles from './FAQItem.module.css';

export default function FAQItem({ question, answer, isOpen: initialOpen = false }) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  return (
    <div className={styles.item}>
      <button
        className={`${styles.question} ${isOpen ? styles.active : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={styles.icon}>{isOpen ? '−' : '+'}</span>
        <span className={styles.text}>{question}</span>
      </button>

      {isOpen && (
        <div className={styles.answer}>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}
