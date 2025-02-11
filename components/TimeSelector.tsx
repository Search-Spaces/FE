import dayjs, { Dayjs } from 'dayjs';
import styles from './TimeSelector.module.css';

interface TimeSelectorProps {
  isOpen: boolean;
  openTime: Dayjs | null;
  closeTime: Dayjs | null;
  onTimeChange: (type: 'open' | 'close', time: Dayjs | null) => void;
}

export default function TimeSelector({
  isOpen,
  openTime,
  closeTime,
  onTimeChange,
}: TimeSelectorProps) {
  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, '0'),
  );
  const minutes = Array.from({ length: 6 }, (_, i) =>
    (i * 10).toString().padStart(2, '0'),
  );

  const handleTimeChange = (
    type: 'open' | 'close',
    timeType: 'hour' | 'minute',
    value: string,
  ) => {
    const currentTime = type === 'open' ? openTime : closeTime;
    let newTime = currentTime?.clone() || dayjs();

    if (timeType === 'hour') {
      newTime = newTime.hour(parseInt(value));
    } else {
      newTime = newTime.minute(parseInt(value));
    }

    onTimeChange(type, newTime);
  };

  if (!isOpen) return null;

  return (
    <div>
      <span>오픈</span>
      <select
        className={styles.timeSelect}
        value={openTime?.format('HH') || '09'}
        onChange={e => handleTimeChange('open', 'hour', e.target.value)}
      >
        {hours.map(hour => (
          <option key={`open-hour-${hour}`} value={hour}>
            {hour}시
          </option>
        ))}
      </select>
      <select
        className={styles.timeSelect}
        value={openTime?.format('mm') || '00'}
        onChange={e => handleTimeChange('open', 'minute', e.target.value)}
      >
        {minutes.map(minute => (
          <option key={`open-min-${minute}`} value={minute}>
            {minute}분
          </option>
        ))}
      </select>
      <span>마감</span>
      <select
        className={styles.timeSelect}
        value={closeTime?.format('HH') || '18'}
        onChange={e => handleTimeChange('close', 'hour', e.target.value)}
      >
        {hours.map(hour => (
          <option key={`close-hour-${hour}`} value={hour}>
            {hour}시
          </option>
        ))}
      </select>
      <select
        className={styles.timeSelect}
        value={closeTime?.format('mm') || '00'}
        onChange={e => handleTimeChange('close', 'minute', e.target.value)}
      >
        {minutes.map(minute => (
          <option key={`close-min-${minute}`} value={minute}>
            {minute}분
          </option>
        ))}
      </select>
    </div>
  );
}
