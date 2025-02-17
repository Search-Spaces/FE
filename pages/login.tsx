//loginpage 컴포넌트
import { useState, useEffect } from 'react';
import router, { useRouter } from 'next/router';
import style from './login.module.css';
import { apiService } from '@/pages/api/api';
import styles from './login.module.css';
import Image from 'next/image';
import Cookies from 'js-cookie';

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { token } = router.query;

  //받아온 토큰 저장
  const saveToken = (token: string) => {
    Cookies.set('token', token, { expires: 1 });
  };

  //쿠키에 저장된 토큰 가져오기
  const getToken = () => {
    return Cookies.get('kakaotoken');
  };
  useEffect(() => {
    if (token) {
      saveToken(token as string);
      console.log('저장된 토큰', getToken);
      router.push('/map');
    }
  }, [token, router]);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // 현재 URL과 쿼리 파라미터 확인
        console.log('=== 로그인 상태 체크 시작 ===');
        console.log('현재 URL:', window.location.href);
        console.log('쿼리 파라미터:', router.query);

        // 응답 헤더에서 access 토큰 확인
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/member/reissue`,
          {
            method: 'POST',
            credentials: 'include', // 쿠키 포함
          },
        );

        // 응답 헤더 전체 확인
        console.log('=== 응답 헤더 정보 ===');
        response.headers.forEach((value, key) => {
          console.log(`${key}: ${value}`);
        });

        // access 토큰 확인 및 저장
        const accessToken = response.headers.get('access');
        console.log('Access Token from header:', accessToken);

        if (accessToken) {
          Cookies.set('accessToken', accessToken, {
            expires: 1,
            path: '/',
            secure: true,
            sameSite: 'strict',
          });

          // 저장된 토큰 확인
          console.log('=== 저장된 토큰 정보 ===');
          console.log('저장된 Access Token:', Cookies.get('accessToken'));

          // 모든 쿠키 확인
          console.log('=== 모든 쿠키 정보 ===');
          console.log('현재 저장된 모든 쿠키:', document.cookie);

          // 3초 후 리다이렉트 (로그 확인을 위해)
          setTimeout(() => {
            router.push('/map');
          }, 3000);
        }
      } catch (error) {
        console.error('토큰 확인 중 에러 발생:', error);
      }
    };

    // 로그인 성공 시 체크 실행
    if (router.isReady && window.location.href.includes('loginSuccess')) {
      checkLoginStatus();
    }
  }, [router.isReady, router.query]);

  const handleLogin = () => {
    console.log(email, password);
  };
  const handleSignup = () => {
    router.push('/signup');
  };

  const handleKakaoLogin = () => {
    console.log('카카오 로그인 시작...');
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/oauth2/authorization/kakao`;
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
