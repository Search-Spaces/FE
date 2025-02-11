import { useEffect, useRef } from 'react';
import type { naver } from '../types/naver';

interface MarkerProps {
  map: naver.maps.Map;
  position: {
    lat: number;
    lng: number;
  };
  icon?: {
    url: string;
    size?: naver.maps.Size;
    origin?: naver.maps.Point;
    anchor?: naver.maps.Point;
  };
  onClick?: (marker: naver.maps.Marker) => void;
}

const NaverMarker = ({ map, position, icon, onClick }: MarkerProps) => {
  const markerRef = useRef<naver.maps.Marker | null>(null);

  useEffect(() => {
    if (!window.naver || !window.naver.maps) return;

    try {
      const markerPosition = new window.naver.maps.LatLng(
        position.lat,
        position.lng,
      );

      const marker = new window.naver.maps.Marker({
        position: markerPosition,
        map: map,
        icon: icon && {
          url: icon.url,
          size: icon.size,
          origin: icon.origin,
          anchor: icon.anchor,
        },
      });

      if (onClick) {
        window.naver.maps.Event.addListener(marker, 'click', () => {
          onClick(marker);
        });
      }

      markerRef.current = marker;

      return () => {
        if (markerRef.current) {
          markerRef.current.setMap(null);
        }
      };
    } catch (error) {
      console.error('마커 생성 중 오류:', error);
    }
  }, [map, position.lat, position.lng, icon, onClick]);

  return null;
};

export default NaverMarker;
