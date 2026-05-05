import { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import styles from './BookingWidget.module.css';

export default function BookingWidget({ variant = 'bar' }) {
  const { bookingData, updateBooking } = useBooking();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className={`${styles.widget} ${variant === 'card' ? styles.card : styles.bar}`}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="checkIn">Check-in <span className={styles.required}>*</span></label>
          <input
            id="checkIn"
            type="date"
            required
            value={bookingData.checkIn}
            onChange={(e) => updateBooking('checkIn', e.target.value)}
          />
        </div>

        <div className={styles.divider} aria-hidden="true" />

        <div className={styles.field}>
          <label htmlFor="checkOut">Check-out <span className={styles.required}>*</span></label>
          <input
            id="checkOut"
            type="date"
            required
            value={bookingData.checkOut}
            onChange={(e) => updateBooking('checkOut', e.target.value)}
          />
        </div>

        <div className={styles.divider} aria-hidden="true" />

        <div className={styles.field}>
          <label htmlFor="adults">Adults</label>
          <select
            id="adults"
            value={bookingData.adults}
            onChange={(e) => updateBooking('adults', parseInt(e.target.value))}
          >
            {Array.from({ length: 30 }, (_, i) => i + 1).map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        <div className={styles.divider} aria-hidden="true" />

        <div className={styles.field}>
          <label htmlFor="children">Children</label>
          <select
            id="children"
            value={bookingData.children}
            onChange={(e) => updateBooking('children', parseInt(e.target.value))}
          >
            {Array.from({ length: 11 }, (_, i) => i).map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        <button type="submit" className={styles.btn}>
          {submitted ? 'Sent ✓' : 'Check Availability'}
        </button>
      </form>
    </div>
  );
}
