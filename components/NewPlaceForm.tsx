import styles from './NewPlaceForm.module.css';
import Postcode from 'react-daum-postcode';
import React, { useState, useRef, useEffect } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import dayjs, { Dayjs } from 'dayjs';
import TimeSelector from './TimeSelector';
import type { naver } from '@/types/naver';
import Image from 'next/image';
// import TimePicker from 'react-time-picker';
// import 'react-time-picker/dist/TimePicker.css';
// import 'react-clock/dist/Clock.css';

interface DayTime {
  open: Dayjs | null;
  close: Dayjs | null;
  isOpen: boolean;
}
interface NewPlaceFormProps {
  initialLocation?: { lat: number; lng: number };
  onClose?: () => void;
}
type SpaceType = 'CAFE' | 'OTHER' | null;
const NewPlaceForm = ({ initialLocation, onClose }: NewPlaceFormProps) => {
  const [is24HoursOpen, setIs24HoursOpen] = useState(false);
  const [address, setAddress] = useState('');
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const [openTime, setOpenTime] = useState<string | null>(null);
  const [closeTime, setCloseTime] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState('');
  const [spaceType, setSpaceType] = useState<SpaceType>(null);
  const maxLength = 50;

  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, '0'),
  );
  const minutes = Array.from({ length: 6 }, (_, i) =>
    (i * 10).toString().padStart(2, '0'),
  );

  interface DayTime {
    open: Dayjs | null;
    close: Dayjs | null;
    isOpen: boolean;
  }

  const [businessHours, setBusinessHours] = useState<{
    [key: string]: DayTime;
  }>({
    monday: { open: null, close: null, isOpen: false },
    tuesday: { open: null, close: null, isOpen: false },
    wednesday: { open: null, close: null, isOpen: false },
    thursday: { open: null, close: null, isOpen: false },
    friday: { open: null, close: null, isOpen: false },
    saturday: { open: null, close: null, isOpen: false },
    sunday: { open: null, close: null, isOpen: false },
  });

  const [holidays, setHolidays] = useState<string[]>([]);

  // 운영시간을 문자열로 변환하는 함수
  const formatBusinessHours = (): string => {
    const days = [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ];
    const koreanDays = ['월', '화', '수', '목', '금', '토', '일'];

    const formattedHours = days
      .map((day, index) => {
        const dayTime = businessHours[day];
        if (!dayTime.isOpen) return null;

        const openTime = dayTime.open?.format('HH:mm');
        const closeTime = dayTime.close?.format('HH:mm');

        if (!openTime || !closeTime) return null;

        return `${koreanDays[index]} ${openTime}~${closeTime}`;
      })
      .filter(Boolean) // null 값 제거
      .join(', ');

    console.log('변환된 운영시간:', formattedHours); // 콘솔에 출력
    return formattedHours || '연중무휴';
  };

  // 기존의 다른 handleTimeChange 함수를 제거하고 이 함수만 사용
  const handleTimeChange = (
    day: string,
    type: 'open' | 'close',
    time: Dayjs | null,
  ) => {
    setBusinessHours(prev => ({
      ...prev,
      [day]: { ...prev[day], [type]: time },
    }));
  };

  // 요일별 영업여부 토글 함수
  const toggleDayOpen = (day: string) => {
    setBusinessHours(prev => ({
      ...prev,
      [day]: { ...prev[day], isOpen: !prev[day].isOpen },
    }));
  };

  // 휴무일 토글 함수
  const toggleHoliday = (day: string) => {
    setHolidays(prev => {
      if (prev.includes(day)) {
        return prev.filter(d => d !== day);
      } else {
        return [...prev, day];
      }
    });
  };

  // 휴무일을 문자열로 변환하는 함수
  const formatHolidays = (): string => {
    const koreanDays = {
      monday: '월',
      tuesday: '화',
      wednesday: '수',
      thursday: '목',
      friday: '금',
      saturday: '토',
      sunday: '일',
    };

    return holidays.length > 0
      ? holidays
          .map(day => koreanDays[day as keyof typeof koreanDays])
          .join(', ') + '요일 휴무'
      : '연중무휴';
  };

  useEffect(() => {
    // 운영시간이 변경될 때마다 문자열로 변환된 결과를 콘솔에 출력
    console.log('현재 운영시간:', formatBusinessHours());
  }, [businessHours]);

  useEffect(() => {
    console.log('useEffect 실행됨, initialLocation:', initialLocation);

    const loadNaverGeocoding = () => {
      console.log('loadNaverGeocoding 함수 실행됨');

      if (!initialLocation) {
        console.log('initialLocation이 없음');
        return;
      }

      if (!window.naver?.maps?.Service) {
        console.log('네이버 지도 Service 객체가 없음');
        return;
      }

      try {
        console.log('reverseGeocode 호출 시도');
        const coordString = `${initialLocation.lng},${initialLocation.lat}`;
        console.log('좌표 문자열:', coordString);

        window.naver.maps.Service.reverseGeocode(
          {
            coords: coordString,
          },
          function (status, response) {
            console.log('Geocoding 콜백 함수 실행됨');
            console.log('상태:', status);
            console.log('응답:', response);

            if (status !== window.naver.maps.Service.Status.OK) {
              console.error('Geocoding 실패:', status);
              return;
            }

            var result = response.v2;
            var items = result.results;
            var address = result.address;

            console.log('결과:', {
              result: result,
              items: items,
              address: address,
            });

            if (address) {
              const fullAddress = address.jibunAddress || address.roadAddress;
              console.log('최종 주소:', fullAddress);
              setAddress(fullAddress);
            }
          },
        );
      } catch (error) {
        console.error('Geocoding 에러:', error);
      }
    };

    // 네이버 지도 API가 이미 로드되어 있는지 확인
    if (window.naver?.maps?.Service) {
      console.log('네이버 지도 Service 객체 존재, 즉시 실행');
      loadNaverGeocoding();
    } else {
      console.log('네이버 지도 Service 객체 없음, 1초 후 재시도');
      const timer = setTimeout(loadNaverGeocoding, 1000);
      return () => clearTimeout(timer);
    }
  }, [initialLocation]);

  const handleAddressChange = (data: any) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress +=
          extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }

    setAddress(fullAddress);
    setIsAddressModalOpen(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) {
      return;
    }

    const newFiles = Array.from(files);
    const newUrls = newFiles.map(file => URL.createObjectURL(file));

    setImages(prev => [...prev, ...newFiles]);
    setImageUrls(prev => [...prev, ...newUrls]);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imageUrls[index]); // 메모리 해제
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 공간 이름 검증
    const spaceName = (
      document.querySelector(
        'input[placeholder="업체 명칭을 입력해주세요"]',
      ) as HTMLInputElement
    )?.value;
    if (!spaceName?.trim()) {
      alert('공간 이름을 입력해주세요.');
      return;
    }

    // 한줄 소개 검증
    if (!description?.trim()) {
      alert('한줄 소개를 입력해주세요.');
      return;
    }

    // 운영시간 검증
    const hasBusinessHours = Object.values(businessHours).some(
      day => day.isOpen && day.open && day.close,
    );
    if (!hasBusinessHours) {
      alert('최소 하나의 요일에 대한 운영시간을 입력해주세요.');
      return;
    }

    // 이미지 검증 (기존 코드)
    if (images.length < 2) {
      alert('최소 2장 이상의 사진을 첨부해주세요.');
      return;
    }

    // 모든 검증을 통과하면 제출 로직 실행
    // ... 나머지 제출 로직
  };

  // 업종 선택 핸들러
  const handleSpaceTypeSelect = (type: SpaceType) => {
    setSpaceType(type);
  };

  return (
    <div className={styles.newPlaceFormContainer}>
      <fieldset className={styles.spaceInfo}>
        <legend aria-label="공간정보"></legend>
        <label className={styles.spaceInfoLabel}>공간이름</label>
        <input
          type="text"
          className={styles.spaceInfoInput}
          placeholder="업체 명칭을 입력해주세요"
        />
        <label className={styles.spaceInfoLabel}>주소</label>
        <div className={styles.addressContainer}>
          <input
            type="text"
            className={styles.spaceInfoInput}
            placeholder="주소를 입력해주세요"
            value={address}
            readOnly={!isEditing}
            onClick={() => isEditing && setIsAddressModalOpen(true)}
          />
          <button
            type="button"
            className={styles.addressEditBtn}
            onClick={() => {
              if (isEditing) {
                setIsAddressModalOpen(true);
              } else {
                setIsEditing(true);
              }
            }}
            aria-label="주소 수정 버튼"
          >
            {isEditing ? '검색' : '수정'}
          </button>
        </div>
        {isAddressModalOpen && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <h3>주소 검색</h3>
                <button
                  onClick={() => setIsAddressModalOpen(false)}
                  className={styles.addressModalcloseBtn}
                >
                  ✕
                </button>
              </div>
              <Postcode
                onComplete={handleAddressChange}
                style={{ height: 400 }}
              />
            </div>
          </div>
        )}
        <div className={styles.contactContainer}>
          <div className={styles.contactItem}>
            <label className={styles.spaceInfoLabel}>전화번호</label>
            <input
              type="tel"
              className={styles.spaceInfoInput}
              placeholder="전화번호를 입력하세요"
            />
          </div>
          <div className={styles.contactItem}>
            <label className={styles.spaceInfoLabel}>웹사이트</label>
            <input
              type="url"
              className={styles.spaceInfoInput}
              placeholder="웹사이트 주소를 입력하세요"
            />
          </div>
        </div>
        <label className={styles.spaceInfoLabel}>한줄 소개</label>
        <div className={styles.descriptionContainer}>
          <input
            type="text"
            className={styles.spaceContentInput}
            placeholder="어떤 공간인지 간단히 설명해주세요"
            value={description}
            onChange={e => setDescription(e.target.value)}
            maxLength={maxLength}
          />
          <span className={styles.characterCount}>
            {description.length}/{maxLength}
          </span>
        </div>
        <label className={styles.spaceInfoLabel}>운영시간</label>
        <div className={styles.timeSelectorContainer}>
          <input
            type="checkbox"
            checked={businessHours.monday.isOpen}
            onChange={() => toggleDayOpen('monday')}
          />
          <label className={styles.timeSelectorLabel}>월요일</label>
          <TimeSelector
            isOpen={businessHours.monday.isOpen}
            openTime={businessHours.monday.open}
            closeTime={businessHours.monday.close}
            onTimeChange={(type, time) =>
              handleTimeChange('monday', type, time)
            }
          />
        </div>
        <div className={styles.timeSelectorContainer}>
          <input
            type="checkbox"
            checked={businessHours.tuesday.isOpen}
            onChange={() => toggleDayOpen('tuesday')}
          />
          <label className={styles.timeSelectorLabel}>화요일</label>
          <TimeSelector
            isOpen={businessHours.tuesday.isOpen}
            openTime={businessHours.tuesday.open}
            closeTime={businessHours.tuesday.close}
            onTimeChange={(type, time) =>
              handleTimeChange('tuesday', type, time)
            }
          />
        </div>
        <div className={styles.timeSelectorContainer}>
          <input
            type="checkbox"
            checked={businessHours.wednesday.isOpen}
            onChange={() => toggleDayOpen('wednesday')}
          />
          <label className={styles.timeSelectorLabel}>수요일</label>
          <TimeSelector
            isOpen={businessHours.wednesday.isOpen}
            openTime={businessHours.wednesday.open}
            closeTime={businessHours.wednesday.close}
            onTimeChange={(type, time) =>
              handleTimeChange('wednesday', type, time)
            }
          />
        </div>
        <div className={styles.timeSelectorContainer}>
          <input
            type="checkbox"
            checked={businessHours.thursday.isOpen}
            onChange={() => toggleDayOpen('thursday')}
          />
          <label className={styles.timeSelectorLabel}>목요일</label>
          <TimeSelector
            isOpen={businessHours.thursday.isOpen}
            openTime={businessHours.thursday.open}
            closeTime={businessHours.thursday.close}
            onTimeChange={(type, time) =>
              handleTimeChange('thursday', type, time)
            }
          />
        </div>
        <div className={styles.timeSelectorContainer}>
          <input
            type="checkbox"
            checked={businessHours.friday.isOpen}
            onChange={() => toggleDayOpen('friday')}
          />
          <label className={styles.timeSelectorLabel}>금요일</label>
          <TimeSelector
            isOpen={businessHours.friday.isOpen}
            openTime={businessHours.friday.open}
            closeTime={businessHours.friday.close}
            onTimeChange={(type, time) =>
              handleTimeChange('friday', type, time)
            }
          />
        </div>
        <div className={styles.timeSelectorContainer}>
          <input
            type="checkbox"
            checked={businessHours.saturday.isOpen}
            onChange={() => toggleDayOpen('saturday')}
          />
          <label className={styles.timeSelectorLabel}>토요일</label>
          <TimeSelector
            isOpen={businessHours.saturday.isOpen}
            openTime={businessHours.saturday.open}
            closeTime={businessHours.saturday.close}
            onTimeChange={(type, time) =>
              handleTimeChange('saturday', type, time)
            }
          />
        </div>
        <div className={styles.timeSelectorContainer}>
          <input
            type="checkbox"
            checked={businessHours.sunday.isOpen}
            onChange={() => toggleDayOpen('sunday')}
          />
          <label className={styles.timeSelectorLabel}>일요일</label>
          <TimeSelector
            isOpen={businessHours.sunday.isOpen}
            openTime={businessHours.sunday.open}
            closeTime={businessHours.sunday.close}
            onTimeChange={(type, time) =>
              handleTimeChange('sunday', type, time)
            }
          />
        </div>
        <div className={styles.holidaySection}>
          <label className={styles.spaceInfoLabel}>휴무일</label>
          <div className={styles.holidayContainer}>
            {Object.entries({
              monday: '월',
              tuesday: '화',
              wednesday: '수',
              thursday: '목',
              friday: '금',
              saturday: '토',
              sunday: '일',
            }).map(([day, label]) => (
              <label key={day} className={styles.holidayLabel}>
                <input
                  type="checkbox"
                  checked={holidays.includes(day)}
                  onChange={() => toggleHoliday(day)}
                  className={styles.holidayCheckbox}
                />
                {label}
              </label>
            ))}
          </div>
        </div>
        {/*공간 사진 첨부 */}
        <label className={styles.spaceInfoLabel}>공간 사진</label>
        <div className={styles.imageUploadSection}>
          <div className={styles.imagePreviewContainer}>
            {imageUrls.map((url, index) => (
              <div key={url} className={styles.imagePreview}>
                <Image
                  src={url}
                  alt={`공간 사진 ${index + 1}`}
                  width={100}
                  height={100}
                  style={{ objectFit: 'cover' }}
                  priority={index === 0}
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className={styles.removeImageBtn}
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={styles.addImageBtn}
            >
              + 사진 추가
            </button>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            multiple
            className={styles.hiddenInput}
          />
          <p className={styles.imageGuide}>
            * 최소 2장 이상의 사진을 첨부해주세요 ({images.length}장 선택됨)
          </p>
        </div>
      </fieldset>

      <div className={styles.buttonContainer}>
        <label className={styles.spaceInfoLabel}>업종구분</label>
        <div>
          <button
            className={`${styles.selectCafeBtn} ${spaceType === 'CAFE' ? styles.selected : ''}`}
            onClick={() => handleSpaceTypeSelect('CAFE')}
            type="button"
            aria-label="카페 선택"
          >
            카페
          </button>
          <button
            className={`${styles.selectOtherBtn} ${spaceType === 'OTHER' ? styles.selected : ''}`}
            onClick={() => handleSpaceTypeSelect('OTHER')}
            type="button"
            aria-label="기타공간 선택"
          >
            기타공간
          </button>
        </div>
      </div>

      <button className={styles.submitBtn} onClick={handleSubmit}>
        등록하기
      </button>
    </div>
  );
};

export default NewPlaceForm;
