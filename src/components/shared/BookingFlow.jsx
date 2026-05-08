import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendOtp, verifyOtp } from '../../api/bookingApi';
import styles from './BookingFlow.module.css';

const RESEND_COOLDOWN_SECONDS = 45;

function formatDateLabel(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function BookingFlow({ open, onClose, bookingData }) {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const [devCode, setDevCode] = useState(null);
  const [cooldown, setCooldown] = useState(0);
  const [bookingRef, setBookingRef] = useState(null);
  const navigate = useNavigate();
  const dialogRef = useRef(null);

  useEffect(() => {
    if (open) {
      setStep('email');
      setEmail('');
      setCode('');
      setError(null);
      setInfo(null);
      setDevCode(null);
      setBookingRef(null);
      setCooldown(0);
    }
  }, [open]);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const id = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  async function handleSendOtp(e) {
    e?.preventDefault?.();
    if (loading || cooldown > 0) return;

    setError(null);
    setInfo(null);
    setDevCode(null);
    setLoading(true);

    try {
      const res = await sendOtp({
        email,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        adults: bookingData.adults,
        children: bookingData.children,
      });
      setStep('otp');
      setCooldown(RESEND_COOLDOWN_SECONDS);
      if (res.testMode && res.devCode) {
        setDevCode(res.devCode);
        setInfo(
          res.emailSent
            ? `Verification code sent to ${email}.`
            : `Test mode: showing the code below (email not actually sent).`
        );
      } else {
        setInfo(`Verification code sent to ${email}. It expires in ${res.expiresInMinutes ?? 10} min.`);
      }
    } catch (err) {
      setError(err.message || 'Failed to send code. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e) {
    e?.preventDefault?.();
    if (loading) return;
    setError(null);
    setLoading(true);
    try {
      const res = await verifyOtp(email, code);
      setBookingRef(res.bookingRef);
      setStep('success');
    } catch (err) {
      setError(err.message || 'Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleViewBooking() {
    if (!bookingRef) return;
    onClose?.();
    navigate(`/booking/${bookingRef}`);
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-flow-title"
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.closeBtn} aria-label="Close" onClick={onClose}>
          ×
        </button>

        <div className={styles.summary}>
          <span className={styles.eyebrow}>Booking Inquiry</span>
          <div className={styles.summaryRow}>
            <div>
              <div className={styles.summaryLabel}>Check-in</div>
              <div className={styles.summaryValue}>{formatDateLabel(bookingData.checkIn) || '-'}</div>
            </div>
            <div>
              <div className={styles.summaryLabel}>Check-out</div>
              <div className={styles.summaryValue}>{formatDateLabel(bookingData.checkOut) || '-'}</div>
            </div>
            <div>
              <div className={styles.summaryLabel}>Guests</div>
              <div className={styles.summaryValue}>
                {bookingData.adults} adult{bookingData.adults > 1 ? 's' : ''}
                {bookingData.children > 0
                  ? `, ${bookingData.children} child${bookingData.children > 1 ? 'ren' : ''}`
                  : ''}
              </div>
            </div>
          </div>
        </div>

        {step === 'email' && (
          <form className={styles.form} onSubmit={handleSendOtp}>
            <h2 id="booking-flow-title" className={styles.title}>
              Confirm your email
            </h2>
            <p className={styles.lead}>
              We will email a 6-digit verification code so we can confirm your booking inquiry.
            </p>

            <label className={styles.field}>
              <span>Email</span>
              <input
                type="email"
                required
                autoFocus
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            {error && <p className={styles.error}>{error}</p>}

            <button type="submit" className={styles.primaryBtn} disabled={loading || !email}>
              {loading ? 'Sending…' : 'Send verification code'}
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form className={styles.form} onSubmit={handleVerify}>
            <h2 id="booking-flow-title" className={styles.title}>
              Enter the 6-digit code
            </h2>
            {info && <p className={styles.info}>{info}</p>}
            {devCode && (
              <p className={styles.devCode}>
                Test code: <strong>{devCode}</strong>
              </p>
            )}

            <label className={styles.field}>
              <span>Verification code</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="\d{6}"
                maxLength={6}
                required
                autoFocus
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              />
            </label>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.actionsRow}>
              <button
                type="button"
                className={styles.linkBtn}
                onClick={handleSendOtp}
                disabled={cooldown > 0 || loading}
              >
                {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
              </button>

              <button
                type="submit"
                className={styles.primaryBtn}
                disabled={loading || code.length !== 6}
              >
                {loading ? 'Verifying…' : 'Verify & confirm'}
              </button>
            </div>

            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={() => {
                setStep('email');
                setError(null);
                setInfo(null);
              }}
              disabled={loading}
            >
              Use a different email
            </button>
          </form>
        )}

        {step === 'success' && (
          <div className={styles.successWrap}>
            <div className={styles.successBadge}>✓</div>
            <h2 id="booking-flow-title" className={styles.title}>
              Booking inquiry confirmed
            </h2>
            <p className={styles.lead}>
              Your reference number is below. We've also kept your dates and guest counts on file.
            </p>
            <div className={styles.refBox}>
              <span className={styles.refLabel}>Reference</span>
              <span className={styles.refValue}>{bookingRef}</span>
            </div>
            <div className={styles.actionsRow}>
              <button type="button" className={styles.secondaryBtn} onClick={onClose}>
                Close
              </button>
              <button type="button" className={styles.primaryBtn} onClick={handleViewBooking}>
                View booking
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
