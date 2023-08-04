import styles from "./page.module.css";
import HomeLeft from "./components/HomeLeft";
import HomeRight from "./components/HomeRight";

export default function Home() {
  return (
    <main className={styles.main}>
      <HomeLeft />
      <HomeRight />
    </main>
  );
}
