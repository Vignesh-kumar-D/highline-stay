-- 0001_initial.sql
-- D1 schema for OTP challenges and confirmed bookings.

CREATE TABLE IF NOT EXISTS otp_challenges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  purpose TEXT NOT NULL DEFAULT 'booking_inquiry',
  code_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  consumed_at TEXT,
  metadata_json TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_otp_challenges_email_created
  ON otp_challenges (email, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_otp_challenges_expires
  ON otp_challenges (expires_at);

CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  booking_ref TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  check_in TEXT NOT NULL,
  check_out TEXT NOT NULL,
  adults INTEGER NOT NULL CHECK (adults >= 1),
  children INTEGER NOT NULL DEFAULT 0 CHECK (children >= 0),
  status TEXT NOT NULL DEFAULT 'otp_verified',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings (email);
CREATE INDEX IF NOT EXISTS idx_bookings_stay_dates ON bookings (check_in, check_out);
