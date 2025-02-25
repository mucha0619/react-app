import React, { useState } from 'react';
import styles from '../styles/PartyFinder.module.css';

interface Requirements {
  itemLevel: string;
  searchId: string;
  partySize: string;
  support: boolean;
  dps: boolean;
}

export default function PartyFinder() {
  const [requirements, setRequirements] = useState<Requirements>({
    itemLevel: '',
    searchId: '',
    partySize: '4',
    support: false,
    dps: false,
  });

  const handleInputChange = (field: keyof Requirements) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setRequirements(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    console.log('Search with:', requirements);
  };

  return (
    <div className={styles.container}>
      <div className={styles.requirementsContainer}>
        <div className={styles.requirementsRow}>
          <div className={styles.leftGroup}>
            <div className={styles.requirementGroup}>
              <label className={styles.label}>아이템 레벨</label>
              <input
                type="number"
                value={requirements.itemLevel}
                onChange={handleInputChange('itemLevel')}
                placeholder="1620"
                className={styles.input}
              />
            </div>

            <div className={styles.requirementGroup}>
              <label className={styles.label}>파티 인원</label>
              <select
                value={requirements.partySize}
                onChange={handleInputChange('partySize')}
                className={styles.select}
              >
                <option value="4">4인</option>
                <option value="8">8인</option>
              </select>
            </div>
          </div>

          <div className={styles.rightGroup}>
            <div className={styles.requirementGroup}>
              <label className={styles.label}>역할</label>
              <div>
                <label className={styles.labelSmall}>
                  <input
                    type="checkbox"
                    checked={requirements.support}
                    onChange={handleInputChange('support')}
                  />
                  {' '}지원가
                </label>
                <label className={styles.labelSmall}>
                  <input
                    type="checkbox"
                    checked={requirements.dps}
                    onChange={handleInputChange('dps')}
                  />
                  {' '}딜러
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.searchSection}>
        <div className={styles.searchWrapper}>
          <input
            type="text"
            value={requirements.searchId}
            onChange={handleInputChange('searchId')}
            placeholder="아이디 검색"
            className={styles.searchInput}
          />
          <button onClick={handleSearch} className={styles.searchButton}>
            검색
          </button>
        </div>
      </div>
    </div>
  );
}
