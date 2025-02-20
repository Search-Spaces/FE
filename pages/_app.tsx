import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Nav from '../components/Navigation';
import Layout from '../layouts/layout';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Script from 'next/script';

export default function App({ Component, pageProps }: AppProps) {
  // console.log('NAVER_CLIENT_ID:', process.env.NEXT_PUBLIC_NAVER_CLIENT_ID);
  const router = useRouter();
  const hideNav =
    router.pathname === '/main' ||
    router.pathname === '/login' ||
    router.pathname === '/';

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (url === '/map' && window.location.pathname === '/map') {
        window.location.reload();
      }
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  return (
    <>
      <Script
        strategy="beforeInteractive"
        src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}&submodules=geocoder`}
      />
      <Layout>
        {!hideNav && <Nav />}
        <main style={{ flex: 1 }}>
          <Component {...pageProps} />
        </main>
      </Layout>
    </>
  );
}
