import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Image from 'next/image';
import styles from './view.module.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useEffect, useState } from 'react';
import { apiService } from './api/api';
// 임시 데이터 (실제로는 API에서 받아올 데이터)
const topCafes = [
  {
    id: 1,
    name: '스타벅스 강남점',
    address: '서울 강남구 테헤란로 123',
    rating: 4.5,
    image: '/스타벅스시흥사거리.jpg',
    likeCount: 100,
  },
  {
    id: 2,
    name: '스타벅스 서울역',
    address: '서울 강남구 테헤란로 123',
    rating: 4.5,
    image: '/스타벅스시흥사거리.jpg',
    likeCount: 90,
  },
  {
    id: 3,
    name: '스타벅스 남영역점',
    address: '서울 강남구 테헤란로 123',
    rating: 4.5,
    iimage: '/스타벅스시흥사거리.jpg',
    likeCount: 80,
  },
  {
    id: 4,
    name: '스타벅스 숙대입구점',
    address: '서울 강남구 테헤란로 123',
    rating: 4.5,
    image: '/cafe1.jpg',
    likeCount: 10,
  },
  {
    id: 5,
    name: '스타벅스 숙대입구점',
    address: '서울 강남구 테헤란로 123',
    rating: 4.5,
    image: '/cafe1.jpg',
    likeCount: 1,
  },
  // ... 더미 데이터 추가
];

// 더미 데이터 추가
const dummyData = [
  {
    id: 1,
    title: '스타벅스 강남점',
    content: '24시간 영업하는 스타벅스입니다.',
    address: '서울 강남구 테헤란로 123',
    likeCount: 156,
    reviewCount: 42,
    userLiked: true,
    createEmail: 'user@example.com',
    distance: 0.5,
    images: [
      {
        url: '/cafe1.jpg',
        description: '카페 전경',
      },
    ],
    open: true,
  },
  {
    id: 2,
    title: '블루보틀 삼청동점',
    content: '분위기 좋은 블루보틀입니다.',
    address: '서울 종로구 삼청로 123',
    likeCount: 142,
    images: [
      {
        url: '/cafe2.jpg',
        description: '카페 내부',
      },
    ],
    open: true,
  },
  // ... 8개 더 추가하면 좋습니다
];

interface CafeImage {
  url: string;
  description: string;
}

interface Cafe {
  id: number;
  title: string;
  address: string;
  images: CafeImage[];
  likeCount: number;
}
export default function View() {
  const [topCafes, setTopCafes] = useState<Cafe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopCafes = async () => {
      try {
        const data = await apiService.getTop10Cafes();
        console.log('Top 10 카페 데이터:', data);
        setTopCafes(data);
      } catch (error) {
        console.error('Top 10 카페 데이터 로딩 실패:', error);
        // API 호출 실패 시 더미 데이터 사용
        setTopCafes(dummyData);
      } finally {
        setLoading(false);
      }
    };

    fetchTopCafes();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h2>이번주 핫 플레이스</h2>
      {/* top10 스와이퍼 */}
      <div className={styles.swiperContainer}>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 4,
            },
          }}
        >
          {topCafes.map(cafe => (
            <SwiperSlide key={cafe.id} className={styles.swiperSlide}>
              <div className={styles.cafeImage}>
                <Image
                  src={cafe.images[0].url}
                  alt={cafe.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className={styles.cafeInfo}>
                <h3 className={styles.cafeName}>{cafe.title}</h3>
                <p className={styles.cafeAddress}>{cafe.address}</p>
                <div className={styles.cafelikeCount}>♥️ {cafe.likeCount}</div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      {/* 카페 리스트 */}
    </div>
  );
}
