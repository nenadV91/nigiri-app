import styles from "./index.module.css";

export default function HomeLeft() {
  return (
    <div className={styles.leftSide}>
      <h2 className={styles.mainTitle}>Nigiri</h2>
      <h3 className={styles.verticalText}>握り寿司</h3>
      <h3 className={`${styles.verticalText} ${styles.faded}`}>握り寿司</h3>
    </div>
  );
}
