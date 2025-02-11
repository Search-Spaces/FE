import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      // const { code, state } = router.query;
      if (code) {
        console.log('인증 코드 확인:', code);
        console.log('인증 상태 확인:', state);

        //마이페이지로 이동
        router.push('/mypage');
      }
    }
  }, [router.query]);

  console.log('현재 쿼리 파라미터:', router.query);

  return <div>로그인 처리 중...</div>;
}
