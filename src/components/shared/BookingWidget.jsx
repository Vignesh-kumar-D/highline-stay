import { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import styles from './BookingWidget.module.css';

export default function BookingWidget() {
  const { bookingData, updateBooking } = useBooking();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock submission - in real app, would send to backend
    console.log('Booking submitted:', bookingData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className={styles.widget}>
      <h3 className={styles.title}>Check Availability</h3>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label>Check-in *</label>
            <input
              type="date"
              required
              value={bookingData.checkIn}
              onChange={(e) => updateBooking('checkIn', e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label>Check-out *</label>
            <input
              type="date"
              required
              value={bookingData.checkOut}
              onChange={(e) => updateBooking('checkOut', e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label>Adults</label>
            <select
              value={bookingData.adults}
              onChange={(e) => updateBooking('adults', parseInt(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label>Children</label>
            <select
              value={bookingData.children}
              onChange={(e) => updateBooking('children', parseInt(e.target.value))}
            >
              {[0, 1, 2, 3, 4, 5].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" className={styles.btn}>
          {submitted ? '✓ Request Sent' : 'Check Availability'}
        </button>
      </form>
    </div>
  );
}
