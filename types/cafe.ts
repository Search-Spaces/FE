export interface Cafe {
  id: number;
  title: string; // 또는 title
  content: string;
  address: string;
  type: string;
  businessHours: string;
  holidays: string;
  url: string;
  latitude: number;
  longitude: number;
}

export interface CafeImage {
  url: string;
  description: string;
}

export interface CafeDetail {
  id: number;
  title: string;
  content: string;
  address: string;
  type: 'CAFE';
  latitude: number;
  longitude: number;
  phoneNumber: string;
  businessHours: string;
  holidays: string;
  url: string;
  copyright: boolean;
  approval: boolean;
  likeCount: number;
  reviewCount: number;
  userLiked: boolean;
  createEmail: string;
  distance: number;
  images: CafeImage[];
  open: boolean;
}
