import styles from './main.module.css';
import { useRouter } from 'next/router';
import Image from 'next/image';
const Main = () => {
  const router = useRouter();
  const onClickLogin = () => {
    router.push('/login');
  };
  const onClickGuest = () => {
    router.push('/map');
  };
  return (
    <div className={styles.container}>
      <div className={styles.logoContainer}>
        <div className={styles.titleContainer}>
          <Image
            src="/title.png"
            alt="title"
            className={styles.titleImage}
            fill
          />
        </div>
        <div className={styles.doormarkContainer}>
          <Image
            src="/doormark.png"
            alt="title"
            className={styles.doormarkImage}
            fill
          />
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.loginButton} onClick={onClickLogin}>
          로그인하기
        </button>
        <button className={styles.startButton} onClick={onClickGuest}>
          게스트로 둘러보기
        </button>
      </div>
    </div>
  );
};

export default Main;
