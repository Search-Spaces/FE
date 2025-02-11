//loginpage 컴포넌트
import { useState, useEffect } from 'react';
import router, { useRouter } from 'next/router';
import style from './login.module.css';
import { apiService } from '@/pages/api/api';
import styles from './login.module.css';
import Image from 'next/image';
declare global {
  interface Window {
    Kakao: any;
  }
}

function Login() {
  const router = useRouter();
  const { redirect } = router.query; // 리다이렉트 URL 가져오기
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log(email, password);
  };
  const handleSignup = () => {
    router.push('/signup');
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!window.Kakao?.isInitialized()) {
        if (window.Kakao) {
          window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID);

          console.log('카카오 SDK 초기화 성공');
        }
      }
    }
  }, []);

  const handleKakaoLogin = () => {
    // 네이버 로그인 인증 URL로 단순 리다이렉트
    window.location.href = 'https://searchspaces.store/oauth2/authorization';
  };

  // useEffect를 사용하여 로그인 상태 확인
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const memberInfo = await apiService.getMemberInfo();
        console.log('이미 로그인된 상태:', memberInfo);
        // 로그인된 상태면 원래 가려던 페이지나 기본 페이지로 이동
        router.push((redirect as string) || '/map');
      } catch (error) {
        console.log('로그인이 필요한 상태');
      }
    };

    checkLoginStatus();
  }, [redirect, router]);

  return (
    <div>
      <div className={styles.logoContainer}>
        <div className={styles.titleContainer}>
          <Image
            src="/title.png"
            alt="title"
            className={styles.titleImage}
            fill
          />
        </div>
      </div>
      <div className={style.loginSection}>
        <div className={style.loginInput}>
          <form className={style.loginForm}>
            <input
              className={style.inputForm}
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="이메일"
            />
            <input
              className={style.inputForm}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="비밀번호"
              type="password"
            />
          </form>
          <button onClick={handleLogin} className={style.loginButton}>
            로그인
          </button>
        </div>
        <button
          onClick={handleKakaoLogin}
          className={style.kakaoLogin}
        ></button>
      </div>
    </div>
  );
}
export default Login;
