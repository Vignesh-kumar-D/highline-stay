import { useState } from 'react';
import Hero from '../shared/Hero';
import RoomCard from '../shared/RoomCard';
import ContactBar from '../shared/ContactBar';
import styles from './Rooms.module.css';
import rooms from '../../data/rooms.json';

export default function Rooms() {
  const [filter, setFilter] = useState('all');

  const filteredRooms = filter === 'all' 
    ? rooms 
    : rooms.filter(room => room.type === filter);

  const handleRoomSelect = (room) => {
    console.log('Room selected:', room);
  };

  return (
    <>
      <Hero
        title="Our Rooms"
        backgroundImage="https://highlineluxuriousstay.in/wp-content/uploads/2024/05/TFC05940-2-1024x683.jpg"
      />

      <ContactBar />

      <section className={styles.roomsSection}>
        <div className={styles.container}>
          <div className={styles.filterSection}>
            <h2 className={styles.filterTitle}>Filter by Type</h2>
            <div className={styles.filters}>
              <button
                className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
                onClick={() => setFilter('all')}
              >
                All Rooms
              </button>
              <button
                className={`${styles.filterBtn} ${filter === 'family' ? styles.active : ''}`}
                onClick={() => setFilter('family')}
              >
                Family Cottages
              </button>
              <button
                className={`${styles.filterBtn} ${filter === 'couples' ? styles.active : ''}`}
                onClick={() => setFilter('couples')}
              >
                Couple Cottages
              </button>
            </div>
          </div>

          <div className={styles.roomsGrid}>
            {filteredRooms.map(room => (
              <RoomCard
                key={room.id}
                room={room}
                onSelect={handleRoomSelect}
              />
            ))}
          </div>

          {filteredRooms.length === 0 && (
            <p className={styles.noResults}>No rooms found for selected filter.</p>
          )}
        </div>
      </section>
    </>
  );
}
