import axios from 'axios';

const BASE_URL = '';

// 기본 axios 인스턴스 생성
export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // credentials 설정만 유지
});

export const apiService = {
  // 카페 목록 조회
  getCafes: async (params: {
    userLocation: [number, number];
    topLeftLat: number;
    topLeftLng: number;
    bottomRightLat: number;
    bottomRightLng: number;
    postId?: number;
    limit?: number;
    keyword?: string;
    postType?: 'CAFE';
    isOpen?: boolean;
    orderBy?: 'DISTANCE';
  }) => {
    const response = await api.get('/post/cursorList', {
      params: {
        ...params,
        postType: 'CAFE',
        orderBy: 'DISTANCE',
      },
    });
    return response.data;
  },

  // 카페 검색
  searchCafes: async (
    keyword: string,
    params: {
      userLocation: [number, number];
      topLeftLat: number;
      topLeftLng: number;
      bottomRightLat: number;
      bottomRightLng: number;
      postId?: number;
      limit?: number;
      postType?: 'CAFE';
      isOpen?: boolean;
      orderBy?: 'DISTANCE';
    },
  ) => {
    try {
      // userLocation을 문자열로 변환
      const apiParams = {
        ...params,
        userLocation: params.userLocation.join(','),
        postType: 'CAFE',
        orderBy: 'DISTANCE',
      };

      // URL 경로 수정
      const response = await api.get('/post/cursorList', {
        params: apiParams,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('요청 파라미터:', error.config?.params);
        console.error('응답 데이터:', error.response?.data);

        if (error.response) {
          console.error('서버 응답 에러:', {
            status: error.response.status,
            data: error.response.data,
            headers: error.response.headers,
          });
        } else if (error.request) {
          console.error('응답 없음:', error.request);
        } else {
          console.error('요청 설정 에러:', error.message);
        }
      } else {
        // AxiosError가 아닌 일반 에러의 경우
        console.error('일반 에러:', error);
      }
      throw error;
    }
  },

  // 회원 정보 조회
  getMemberInfo: async () => {
    try {
      const response = await api.get('/api/member');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          // 401 Unauthorized 에러 시 로그인 페이지로 리다이렉트
          console.error('인증되지 않은 사용자');
          throw new Error('unauthorized');
        }
      }
      throw error;
    }
  },

  // 카카오 로그인
  kakaoLogin: async (kakaoUserData: {
    kakaoId: number;
    email: string;
    nickname: string;
    profileImage: string;
  }) => {
    try {
      const response = await api.post('/api/auth/kakao', kakaoUserData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('카카오 로그인 요청 실패:', error.response?.data);
      }
      throw error;
    }
  },
  // 좋아요 Top 10 카페 조회
  getTop10Cafes: async () => {
    const response = await api.get('/post/get/top10');
    return response.data;
  },
  // 공간 등록
  createSpace: async (spaceData: any) => {
    const response = await api.post('/post/create', spaceData);
    return response.data;
  },

  // 카페 상세 정보 조회
  getCafeDetail: async (postId: number) => {
    try {
      const response = await api.get('/post/get/postInfo', {
        params: {
          postId,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('카페 상세 정보 조회 실패:', error.response?.data);
        throw error;
      }
      throw error;
    }
  },
};
