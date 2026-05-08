import { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import BookingFlow from './BookingFlow';
import styles from './BookingWidget.module.css';

function todayIso() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export default function BookingWidget({ variant = 'bar' }) {
  const { bookingData, updateBooking } = useBooking();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);

  const minDate = todayIso();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!bookingData.checkIn || !bookingData.checkOut) {
      setError('Please pick check-in and check-out dates.');
      return;
    }
    if (bookingData.checkOut <= bookingData.checkIn) {
      setError('Check-out must be after check-in.');
      return;
    }
    setOpen(true);
  };

  return (
    <>
      <div className={`${styles.widget} ${variant === 'card' ? styles.card : styles.bar}`}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="checkIn">
              Check-in <span className={styles.required}>*</span>
            </label>
            <input
              id="checkIn"
              type="date"
              required
              min={minDate}
              value={bookingData.checkIn}
              onChange={(e) => updateBooking('checkIn', e.target.value)}
            />
          </div>

          <div className={styles.divider} aria-hidden="true" />

          <div className={styles.field}>
            <label htmlFor="checkOut">
              Check-out <span className={styles.required}>*</span>
            </label>
            <input
              id="checkOut"
              type="date"
              required
              min={bookingData.checkIn || minDate}
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
              onChange={(e) => updateBooking('adults', parseInt(e.target.value, 10))}
            >
              {Array.from({ length: 30 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.divider} aria-hidden="true" />

          <div className={styles.field}>
            <label htmlFor="children">Children</label>
            <select
              id="children"
              value={bookingData.children}
              onChange={(e) => updateBooking('children', parseInt(e.target.value, 10))}
            >
              {Array.from({ length: 11 }, (_, i) => i).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className={styles.btn}>
            Check Availability
          </button>
        </form>

        {error && <p className={styles.error}>{error}</p>}
      </div>

      <BookingFlow
        open={open}
        onClose={() => setOpen(false)}
        bookingData={bookingData}
      />
    </>
  );
}
