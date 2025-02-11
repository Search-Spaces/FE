import style from './Navigation.module.css';
import Link from 'next/link';
import Image from 'next/image';
import mypage from '../public/mypage-logo.svg';
import MainLogo from '../public/kr_logo.svg';
import Map from '../public/map.svg';
import Map_active from '../public/map_active.svg';
import AddSpace from '../public/addSpace.svg';
import AddSpace_active from '@/public/addSpace_active.svg';
import Scrap from '../public/scrap.svg';
import Scrap_active from '../public/scrap_active.svg';
import { useNavigationStore } from '@/store/navigationStore';
import Search from '../public/search.svg';
import Search_active from '../public/search_active.svg';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useUserStore } from '@/store/user';
import { apiService } from '@/pages/api/api';
import Cookies from 'js-cookie';

const Navigation = () => {
  const router = useRouter();
  const [activeLink, setActiveLink] = useState('');
  const { activeMenu, setActiveMenu } = useNavigationStore();
  const { isLoggedIn, userInfo } = useUserStore();

  const handleLinkClick = async (link: string) => {
    if (link === '/mypage') {
      try {
        const memberInfo = await apiService.getMemberInfo();
        console.log('현재 로그인된 회원 정보:', memberInfo);

        setActiveLink(link);
        setActiveMenu(link);
        router.push(link);
      } catch (error: any) {
        console.error('회원 정보 조회 실패:', error);
        if (error.message === 'unauthorized') {
          router.push('/login');
        } else if (error.message === 'network_error') {
          alert('서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.');
        } else {
          alert('오류가 발생했습니다. 다시 시도해주세요.');
          router.push('/login');
        }
      }
      return;
    }

    if (link === '/addspace') {
      router.push('/map?from=addspace');
      return;
    }

    setActiveLink(link);
    setActiveMenu(link);
    router.push(link);
  };

  const handleMypageClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (isLoggedIn && userInfo) {
      console.log('로그인 상태:', isLoggedIn);
      console.log('사용자 정보:', userInfo);
      console.log('저장된 토큰:', {
        accessToken: Cookies.get('accessToken'),
        refreshToken: Cookies.get('refreshToken'),
      });
      router.push('/mypage');
    } else {
      console.log('로그인이 필요합니다');
      router.push('/login');
    }
  };

  return (
    <>
      <div className={style.container}>
        <nav className={style.nav}>
          <Link
            href="/"
            className={`${style.link} ${activeLink === '/' ? style.active : ''}`}
            onClick={() => handleLinkClick('/')}
          >
            <Image src={MainLogo} alt="홈페이지 메뉴" width={50} height={50} />
          </Link>
          <Link
            href="/map"
            className={`${style.link} ${activeLink === '/map' ? style.active : ''}`}
            onClick={() => handleLinkClick('/map')}
          >
            <Image
              src={activeLink === '/map' ? Map_active : Map}
              alt="지도 보기 메뉴"
              width={30}
              height={30}
            />
            <span className={style.span}>지도보기</span>
          </Link>
          <Link
            href="/view"
            className={`${style.link} ${activeLink === '/view' ? style.active : ''}`}
            onClick={() => handleLinkClick('/view')}
          >
            <Image
              src={activeLink === '/view' ? Search_active : Search}
              alt="공간 탐색 보기 메뉴"
              width={45}
              height={40}
            />
            <span className={style.span}>공간 탐색</span>
          </Link>
          <Link
            href="/favorite"
            className={`${style.link} ${activeLink === '/favorite' ? style.active : ''}`}
            onClick={() => handleLinkClick('/favorite')}
          >
            <Image
              src={activeLink === '/favorite' ? Scrap_active : Scrap}
              alt="찜한공간 보기 메뉴"
              width={30}
              height={30}
            />
            <span className={style.span}>찜한 공간</span>
          </Link>
          <Link
            href="/map?from=addspace"
            className={`${style.link} ${activeLink === '/addspace' ? style.active : ''}`}
            onClick={() => handleLinkClick('/map?from=addspace')}
          >
            <Image
              src={activeLink === '/addspace' ? AddSpace_active : AddSpace}
              alt="공간등록 페이지 메뉴"
              width={30}
              height={30}
            />
            <span className={style.span}>공간 등록</span>
          </Link>
          <Link
            href="/mypage"
            className={`${style.link} ${activeLink === '/mypage' ? style.active : ''}`}
            onClick={handleMypageClick}
          >
            <Image
              src={activeLink === '/mypage' ? mypage : mypage}
              alt="마이페이지 메뉴"
              width={30}
              height={30}
            />
            <span className={style.span}>마이페이지</span>
          </Link>
        </nav>
      </div>
    </>
  );
};
export default Navigation;
