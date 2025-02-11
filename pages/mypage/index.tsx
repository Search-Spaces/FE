import styles from './mypage.module.css';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { CafeDetail } from '@/types/cafe';
import CafeDetailModal from './modals/CafeDetailModal';
import cafedata from '../../public/cafedata.json' assert { type: 'json' };
import EditProfile from './modals/EditProfile';
import userdata from '../../public/userdata.json' assert { type: 'json' };
import { apiService } from '@/pages/api/api';
import Cookies from 'js-cookie';
import { useUserStore } from '@/store/user';

interface DataItem {
  id: number;
  title: string;
  content: string;
  address: string;
  type: string;
  latitude: number;
  longitude: number;
  phoneNumber: string;
  businessHours: string;
  holidays: string;
  url: string;
  copyright: boolean;
  approval: boolean;
  isOpen: boolean;
  images: string[];
}

interface MemberInfo {
  email: number;
  nickname: string;
  profileImage: string;
}

const Mypage = () => {
  const router = useRouter();
  const { fetchUserInfo, userInfo, isLoggedIn } = useUserStore();
  const { modal, id } = router.query;
  const [viewType, setViewType] = useState<'grid' | 'list'>('list');
  const [contentType, setContentType] = useState<'mySpace' | 'myReview'>(
    'mySpace',
  );
  const [cafeDetail, setCafeDetail] = useState<CafeDetail | null>(null);

  useEffect(() => {
    // URL의 쿼리 파라미터에서 토큰 확인
    const { accessToken, refreshToken } = router.query;

    console.log('Tokens from query:', { accessToken, refreshToken }); // 토큰 확인

    if (accessToken && refreshToken) {
      // 토큰을 쿠키에 저장
      Cookies.set('accessToken', accessToken as string, { expires: 1 });
      Cookies.set('refreshToken', refreshToken as string, { expires: 7 });

      console.log('Cookies after setting:', {
        access: Cookies.get('accessToken'),
        refresh: Cookies.get('refreshToken'),
      }); // 쿠키 저장 확인

      // 사용자 정보 가져오기
      fetchUserInfo();

      // 쿼리 파라미터 제거
      router.replace('/mypage');
    } else if (!isLoggedIn) {
      // 토큰이 없고 로그인되지 않은 상태면 사용자 정보 가져오기 시도
      fetchUserInfo().catch(() => {
        router.push('/login');
      });
    }
  }, [router.query, fetchUserInfo, isLoggedIn]);

  const openModal = (id: number) => {
    router.push(`/mypage?modal=cafe-detail&id=${id}`, undefined, {
      shallow: true,
    });
    console.log('modal open');
  };
  const closeModal = () => {
    router.push('/mypage'), undefined, { shallow: true };
    console.log('modal close');
  };

  const typedData = cafedata as unknown as DataItem[];
  console.log(typeof typedData);

  const handleViewList = () => {
    setViewType('list');
  };
  const handleViewGrid = () => {
    setViewType('grid');
  };
  const handleMySpace = () => {
    setContentType('mySpace');
  };
  const handleMyReview = () => {
    setContentType('myReview');
  };

  return (
    <>
      <div className={styles.mypageContainer}>
        <div className={styles.profileContainer}>
          <div className={styles.profileImgContainer}>
            <button></button>
          </div>
          <div className={styles.profileInfoContainer}>
            <div className={styles.nickname}>{userInfo?.nickname}</div>
            <div>{userInfo?.email}</div>
            <button className={styles.editBtn}>회원정보 수정하기</button>
          </div>
        </div>
      </div>
      <div className={styles.content}>
        {/* <h3>콘텐츠 렌더링할 자리</h3> */}
        <div className={styles.mypageMenu}>
          <div className={styles.mySpaceBtnContainer}>
            <button
              className={
                contentType == 'mySpace' ? styles.mySpaceBtn : styles.myContent
              }
              onClick={handleMySpace}
            >
              {' '}
              내가 등록한 공간
            </button>
            <button
              className={
                contentType == 'myReview'
                  ? styles.myReviewBtn
                  : styles.myContent
              }
              onClick={handleMyReview}
            >
              내 리뷰
            </button>
          </div>

          <div className={styles.sortBtnContainer}>
            <button
              className={
                viewType === 'list' ? styles.listViewOn : styles.listViewOff
              }
              onClick={handleViewList}
            ></button>
            <button
              className={
                viewType === 'grid' ? styles.gridViewOn : styles.gridViewOff
              }
              onClick={handleViewGrid}
            ></button>
          </div>
        </div>
        <div className={styles.contentContainer}>
          {typedData.map((item: DataItem) => (
            <div
              key={item.id}
              className={
                viewType === 'list'
                  ? styles.listViewContainer
                  : styles.gridViewContainer
              }
              onClick={() => openModal(item.id)}
            >
              <div
                className={
                  viewType === 'list'
                    ? styles.contentListItem
                    : styles.contentGridItem
                }
              >
                <h3>{item.title}</h3>
                {item.address}
                <div className={styles.contentItemImgContainer}>
                  {item.images.map((image, index) => (
                    <Image
                      key={index}
                      src={image}
                      alt="contentImg"
                      width={100}
                      height={100}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <CafeDetailModal
          isOpen={modal === 'cafe-detail'}
          onClose={closeModal}
          cafeDetail={cafeDetail}
        />
      </div>
    </>
  );
};

export default Mypage;
