import styles from './RoomCard.module.css';

export default function RoomCard({ room, onSelect }) {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={room.images[0]} alt={room.name} className={styles.image} />
        <span className={styles.type}>{room.type}</span>
      </div>

      <div className={styles.content}>
        <h3 className={styles.name}>{room.name}</h3>
        <p className={styles.description}>{room.description}</p>

        <div className={styles.specs}>
          <div className={styles.spec}>
            <span>🛏️</span>
            <p>{room.bedrooms} Bed{room.bedrooms > 1 ? 's' : ''}</p>
          </div>
          <div className={styles.spec}>
            <span>🚿</span>
            <p>{room.bathrooms} Bath{room.bathrooms > 1 ? 's' : ''}</p>
          </div>
          <div className={styles.spec}>
            <span>👥</span>
            <p>{room.capacity} Guests</p>
          </div>
        </div>

        <div className={styles.amenities}>
          {room.amenities.slice(0, 3).map((amenity, idx) => (
            <span key={idx} className={styles.amenity}>{amenity}</span>
          ))}
          {room.amenities.length > 3 && (
            <span className={styles.more}>+{room.amenities.length - 3} more</span>
          )}
        </div>

        <div className={styles.footer}>
          <p className={styles.price}>{room.price}</p>
          <button className={styles.btn} onClick={() => onSelect(room)}>
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
