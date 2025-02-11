import React from 'react';
import Modal from '@/components/Modal';
import { CafeDetail } from '@/types/cafe';
import styles from './CafeDetailModal.module.css';
import Image from 'next/image';

interface CafeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  cafeDetail: CafeDetail | null;
}

const CafeDetailModal: React.FC<CafeDetailModalProps> = ({
  isOpen,
  onClose,
  cafeDetail,
}) => {
  if (!cafeDetail) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.container}>
        {/* 이미지 슬라이더 */}
        <div className={styles.imageSlider}>
          {cafeDetail.images.map((image, index) => (
            <div key={index} className={styles.imageContainer}>
              <Image
                src={image.url}
                alt={image.description || cafeDetail.title}
                layout="fill"
                objectFit="cover"
              />
            </div>
          ))}
        </div>

        {/* 카페 정보 */}
        <div className={styles.infoContainer}>
          <h2 className={styles.title}>{cafeDetail.title}</h2>

          <div className={styles.stats}>
            <span>좋아요 {cafeDetail.likeCount}</span>
            <span>리뷰 {cafeDetail.reviewCount}</span>
          </div>

          <p className={styles.content}>{cafeDetail.content}</p>

          <div className={styles.details}>
            <div className={styles.detailItem}>
              <strong>주소</strong>
              <p>{cafeDetail.address}</p>
            </div>

            <div className={styles.detailItem}>
              <strong>영업시간</strong>
              <p>{cafeDetail.businessHours}</p>
            </div>

            <div className={styles.detailItem}>
              <strong>휴무일</strong>
              <p>{cafeDetail.holidays}</p>
            </div>

            {cafeDetail.phoneNumber && (
              <div className={styles.detailItem}>
                <strong>전화번호</strong>
                <p>{cafeDetail.phoneNumber}</p>
              </div>
            )}

            {cafeDetail.url && (
              <div className={styles.detailItem}>
                <strong>웹사이트</strong>
                <a
                  href={cafeDetail.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {cafeDetail.url}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CafeDetailModal;
