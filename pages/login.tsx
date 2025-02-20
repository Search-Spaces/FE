import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import style from './login.module.css';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { log } from 'console';
import { getCookie, setCookie, deleteCookie, getCookies } from 'cookies-next';
// import { cookies } from 'next/headers';
// import { cookies } from 'next/headers';

declare global {
  interface Window {
    Kakao: any;
  }
}

function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const cookie = getCookies({cookie});
  // console.log('cookie',cookie);

  const handleLogin = () => {
    console.log(email, password);
  };
  // const handleSignup = () => {
  //   router.push('/signup');
  // };

  const handleKakaoLogin = () => {
    console.log('카카오 로그인 시작...');
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/oauth2/authorization/kakao`;
  };

  useEffect(() => {
    const handleKakaoCallback = async () => {
      const code = router.query.code as string;
      if (code) {
        try {
          // 1. 카카오 인증 및 토큰 발급 (이때 HttpOnly 쿠키로 토큰이 자동 저장됨)
          const authResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/oauth2/authorization/kakao?code=${code}`,
            {
              method: 'GET',
              credentials: 'include',
            },
          );

          if (authResponse.ok) {
            // 2. /map 엔드포인트로 요청 (쿠키가 자동으로 포함됨)
            const checkAuthResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/map`,
              {
                method: 'GET',
                credentials: 'include',
              },
            );

            if (checkAuthResponse.ok) {
              router.push('/map');
            } else {
              console.error('인증 실패');
              router.push('/login');
            }
          }
        } catch (error) {
          console.error('카카오 로그인 콜백 처리 중 에러 발생:', error);
          router.push('/login');
        }
      }
    };

    if (router.isReady && router.query.code) {
      handleKakaoCallback();
    }
  }, [router.isReady, router.query.code]);
  return (
    <div>
      <div className={style.logoContainer}>
        <div className={style.titleContainer}>
          <Image
            src="/title.png"
            alt="title"
            className={style.titleImage}
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
