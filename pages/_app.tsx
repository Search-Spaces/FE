import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Nav from '../components/Navigation';
import Layout from '../layouts/layout';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  // console.log('NAVER_CLIENT_ID:', process.env.NEXT_PUBLIC_NAVER_CLIENT_ID);
  const router = useRouter();
  const hideNav = router.pathname === '/main' || router.pathname === '/login';

  useEffect(() => {
    if (router.pathname === '/') {
      router.replace('/main');
    }
  }, []);

  return (
    <>
      {/* <Component {...pageProps} /> */}
      <Layout>
        {!hideNav && <Nav />}
        <main style={{ flex: 1 }}>
          <Component {...pageProps} />
        </main>
      </Layout>
    </>
  );
}
