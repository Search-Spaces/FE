import React, { useState } from 'react';
import style from './signup.module.css';

function SignUp() {
  // 상태 관리 추가
  const [formData, setFormData] = useState({
    nickname: '',
    gender: '',
    birthDate: '',
  });

  // 입력값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // 회원가입 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 빈 필드 확인
    const emptyFields = [];
    if (!formData.nickname) emptyFields.push('닉네임');
    if (!formData.gender) emptyFields.push('성별');
    if (!formData.birthDate) emptyFields.push('생년월일');

    // 빈 필드가 있으면 알림
    if (emptyFields.length > 0) {
      alert(`다음 항목을 입력해주세요: ${emptyFields.join(', ')}`);
      return;
    }

    // 모든 필드가 채워졌을 때의 처리
    console.log('회원가입 데이터:', formData);
    // TODO: API 호출 등 추가 처리
  };

  return (
    <>
      <h1>회원가입</h1>
      <div className={style.signupContainer}>
        <form onSubmit={handleSubmit}>
          <div className={style.inputGroup}>
            <label className={style.label}>닉네임</label>
            <input
              type="text"
              name="nickname"
              placeholder="닉네임을 입력하세요"
              className={style.input}
              value={formData.nickname}
              onChange={handleChange}
            />
            <button type="button" className={style.checkButton}>
              중복검사
            </button>
          </div>

          <div className={style.inputGroup}>
            <label className={style.label}>성별</label>
            <div>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === 'male'}
                onChange={handleChange}
              />{' '}
              남
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === 'female'}
                onChange={handleChange}
              />{' '}
              여
            </div>
          </div>

          <div className={style.inputGroup}>
            <label className={style.label}>생일</label>
            <input
              type="date"
              name="birthDate"
              className={style.dateInput}
              value={formData.birthDate}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className={style.registerButton}>
            회원 등록하기
          </button>
        </form>
      </div>
    </>
  );
}

export default SignUp;
