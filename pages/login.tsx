//loginpage 컴포넌트
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import style from './login.module.css';
import Image from 'next/image';

declare global {
  interface Window {
    Kakao: any;
  }
}

function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
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


  useEffect(()=> {
    const handleKakaoCallback= async()=> {
      const code = router.query.code as string;

      if(code){
        try{
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/oauth2/authorization/kakao?code=${code}`,{
            method: 'GET',
            credentials: 'include',
          });
        
        }catch(error){
          console.error('카카오 로그인 콜백 처리 중 에러 발생:', error);
        }
      }
    };
    if (router.isReady&&router.query.code){
      handleKakaoCallback();
    }
  },[router.isReady,router.query.code])
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
