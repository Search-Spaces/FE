interface Window {
  naver: any;
}

export namespace naver {
  export namespace maps {
    export class Map {
      constructor(element: string | HTMLElement, options?: MapOptions);
      setCenter(location: LatLng): void;
      setZoom(level: number, useEffec?: boolean): void;
      getBounds(): LatLngBounds;
      getCenter(): LatLng;
      getZoom(): number;
    }

    // InfoWindow 클래스 추가
    export class InfoWindow {
      constructor(options?: InfoWindowOptions);
      setContent(content: string | HTMLElement): void;
      setPosition(position: LatLng): void;
      open(map: Map, anchor?: LatLng | Marker): void;
      close(): void;
      getMap(): Map | null;
    }

    // InfoWindow 옵션 인터페이스 추가
    export interface InfoWindowOptions {
      content?: string | HTMLElement;
      position?: LatLng;
      maxWidth?: number;
      backgroundColor?: string;
      borderColor?: string;
      borderWidth?: number;
      anchorSize?: Size;
      anchorSkew?: boolean;
      anchorColor?: string;
      pixelOffset?: Point;
      disableAnchor?: boolean;
    }
    class Marker {
      constructor(options: MarkerOptions);
      setMap(map: Map | null): void;
      setPosition(position: LatLng): void;
      getPosition(): LatLng;
    }

    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
    }

    class LatLngBounds {
      constructor(sw: LatLng, ne: LatLng);
      getCenter(): LatLng;
      getNE(): LatLng;
      getSW(): LatLng;
      extend(latlng: LatLng): this;
      hasLatLng(latlng: LatLng): boolean;
      toString(): string;
      union(bounds: LatLngBounds): LatLngBounds;
    }

    class Size {
      constructor(width: number, height: number);
    }

    class Point {
      constructor(x: number, y: number);
    }

    class Event {
      static addListener(
        instance: any,
        eventName: string,
        handler: Function,
      ): void;
      static removeListener(
        instance: any,
        eventName: string,
        handler: Function,
      ): void;
    }

    interface MapOptions {
      center: LatLng;
      zoom?: number;
      minZoom?: number;
      maxZoom?: number;
      zoomControl?: boolean;
      zoomControlOptions?: {
        position: any;
        style: any;
      };
    }

    interface MarkerOptions {
      position: LatLng;
      map?: Map;
      icon?: ImageIcon;
      title?: string;
      cursor?: string;
      clickable?: boolean;
      draggable?: boolean;
      visible?: boolean;
      zIndex?: number;
    }

    interface ImageIcon {
      url: string;
      size?: Size;
      origin?: Point;
      anchor?: Point;
      scaledSize?: Size;
    }
  }
}

declare global {
  interface Window {
    naver: typeof naver;
  }
}
