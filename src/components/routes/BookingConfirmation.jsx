import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Hero from '../shared/Hero';
import { getBooking } from '../../api/bookingApi';
import styles from './BookingConfirmation.module.css';

function formatDate(iso) {
  if (!iso) return '-';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function nights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const a = new Date(checkIn);
  const b = new Date(checkOut);
  const ms = b - a;
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
}

export default function BookingConfirmation() {
  const { bookingRef } = useParams();
  const [state, setState] = useState({ loading: true, error: null, booking: null });

  useEffect(() => {
    let cancelled = false;
    setState({ loading: true, error: null, booking: null });

    getBooking(bookingRef)
      .then((res) => {
        if (cancelled) return;
        setState({ loading: false, error: null, booking: res.booking });
      })
      .catch((err) => {
        if (cancelled) return;
        setState({
          loading: false,
          error: err.message || 'Could not load booking.',
          booking: null,
        });
      });

    return () => {
      cancelled = true;
    };
  }, [bookingRef]);

  return (
    <>
      <Hero
        title="Your Booking"
        description="Reference, dates and guest details"
        backgroundImage="https://highlineluxuriousstay.in/wp-content/uploads/2024/05/TFC05656-1-1024x683.jpg"
      />

      <section className={styles.section}>
        <div className={styles.container}>
          {state.loading && <p className={styles.loading}>Loading your booking…</p>}

          {state.error && (
            <div className={styles.errorBox}>
              <h2>We couldn't find that booking</h2>
              <p>{state.error}</p>
              <Link to="/" className={styles.linkBtn}>
                Back to home
              </Link>
            </div>
          )}

          {state.booking && (
            <div className={styles.card}>
              <span className={styles.eyebrow}>Booking Reference</span>
              <h1 className={styles.refValue}>{state.booking.bookingRef}</h1>
              <p className={styles.status}>
                Status: <strong>{state.booking.status.replace(/_/g, ' ')}</strong>
              </p>

              <div className={styles.grid}>
                <div className={styles.cell}>
                  <div className={styles.label}>Check-in</div>
                  <div className={styles.value}>{formatDate(state.booking.checkIn)}</div>
                </div>
                <div className={styles.cell}>
                  <div className={styles.label}>Check-out</div>
                  <div className={styles.value}>{formatDate(state.booking.checkOut)}</div>
                </div>
                <div className={styles.cell}>
                  <div className={styles.label}>Nights</div>
                  <div className={styles.value}>
                    {nights(state.booking.checkIn, state.booking.checkOut)}
                  </div>
                </div>
                <div className={styles.cell}>
                  <div className={styles.label}>Guests</div>
                  <div className={styles.value}>
                    {state.booking.adults} adult{state.booking.adults > 1 ? 's' : ''}
                    {state.booking.children > 0
                      ? `, ${state.booking.children} child${state.booking.children > 1 ? 'ren' : ''}`
                      : ''}
                  </div>
                </div>
                <div className={styles.cell}>
                  <div className={styles.label}>Email</div>
                  <div className={styles.value}>{state.booking.email}</div>
                </div>
                <div className={styles.cell}>
                  <div className={styles.label}>Created</div>
                  <div className={styles.value}>{formatDate(state.booking.createdAt)}</div>
                </div>
              </div>

              <p className={styles.note}>
                Save this reference number. We'll use it for any updates, cancellation, or payment
                follow-up.
              </p>

              <div className={styles.actions}>
                <Link to="/" className={styles.secondaryBtn}>
                  Back to home
                </Link>
                <a
                  href={`mailto:dvigneshkumar3@gmail.com?subject=Booking%20${state.booking.bookingRef}`}
                  className={styles.primaryBtn}
                >
                  Contact us
                </a>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
