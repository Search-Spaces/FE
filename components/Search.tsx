import style from './Search.module.css';
import React, { useState, useCallback, KeyboardEvent, useRef } from 'react';
import { Cafe } from '../types/cafe';
import { apiService } from '../pages/api/api';
import axios from 'axios';

interface SearchProps {
  cafeList: Cafe[];
  onSearchResult: (result: Cafe[], keyword: string) => void;
  bounds: {
    userLocation: [number, number];
    topLeftLat: number;
    topLeftLng: number;
    bottomRightLat: number;
    bottomRightLng: number;
  };
}

export default function Search({
  cafeList,
  onSearchResult,
  bounds,
}: SearchProps) {
  const [keyword, setKeyword] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback(
    async (keyword: string) => {
      //검색어 비어있는데 검색 버튼 누르면 포커스 효과만 주기
      if (!keyword.trim()) {
        searchInputRef.current?.focus();
        return;
      }
      setIsSearching(true);
      setSearchError(null);

      try {
        const result = await apiService.searchCafes(keyword, bounds);
        onSearchResult(result, keyword);
        // 검색 결과가 없는 경우
        if (!result || result.length === 0) {
          setSearchError('검색하신 카페를 찾을 수 없습니다.');
        }
      } catch (error) {
        // 404 에러인 경우 사용자 친화적 메시지 표시
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          setSearchError('검색하신 카페를 찾을 수 없습니다.');
          onSearchResult([], keyword); // 검색 결과로 빈 배열 전달
        } else {
          setSearchError('검색 중 오류가 발생했습니다.');
        }
      } finally {
        setIsSearching(false);
      }
    },
    [bounds, onSearchResult],
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(keyword);
    }
  };

  return (
    <div className={style.searchContainer}>
      <input
        ref={searchInputRef}
        type="text"
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
        placeholder="카페 검색..."
        className={style.searchInput}
        onKeyDown={handleKeyDown}
      />
      {/* <button
        onClick={() => handleSearch(keyword)}
        className={style.searchButton}
      >
        검색
      </button> */}

      {/* 에러 메시지 표시 */}
      {searchError && <div className={style.searchError}>{searchError}</div>}
    </div>
  );
}
