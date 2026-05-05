import { useState } from 'react';
import Hero from '../shared/Hero';
import ContactBar from '../shared/ContactBar';
import styles from './Contact.module.css';
import content from '../../data/content.json';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <>
      <Hero
        title="Contact Us"
        backgroundImage="https://highlineluxuriousstay.in/wp-content/uploads/2024/05/TFC05661-1-1024x683.jpg"
      />

      <ContactBar />

      <section className={styles.contactSection}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {/* Contact Form */}
            <div className={styles.formContainer}>
              <h2 className={styles.title}>Send us a Message</h2>

              {submitted && (
                <div className={styles.successMessage}>
                  ✓ Thank you! We'll get back to you soon.
                </div>
              )}

              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label>Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your name"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Your email"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Your phone number"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="Message subject"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Your message"
                    rows="6"
                  ></textarea>
                </div>

                <button type="submit" className={styles.submitBtn}>
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className={styles.infoContainer}>
              <h2 className={styles.title}>Get in Touch</h2>

              <div className={styles.infoBox}>
                <h3>📍 Location</h3>
                <p>{content.contact.location}</p>
                <p className={styles.smallText}>{content.contact.distanceFromCity}</p>
              </div>

              <div className={styles.infoBox}>
                <h3>📞 Phone</h3>
                <a href={`tel:${content.contact.phone}`} className={styles.infoLink}>
                  {content.contact.phone}
                </a>
              </div>

              <div className={styles.infoBox}>
                <h3>💬 WhatsApp</h3>
                <a 
                  href={`https://wa.me/${content.contact.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.infoLink}
                >
                  Chat with us on WhatsApp
                </a>
              </div>

              <div className={styles.infoBox}>
                <h3>⏰ Availability</h3>
                <p>Available 24/7 for inquiries</p>
              </div>

              <div className={styles.quickLinks}>
                <h3>Quick Links</h3>
                <ul>
                  <li>
                    <a href={`tel:${content.contact.phone}`}>Call us</a>
                  </li>
                  <li>
                    <a href={`https://wa.me/${content.contact.whatsapp}`} target="_blank" rel="noopener noreferrer">
                      Message on WhatsApp
                    </a>
                  </li>
                  <li>
                    <a href="/">Back to Home</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
