import React, { useState, useEffect } from 'react';
import styles from '../styles/Navigation.module.css';

interface NavigationProps {
  activeTab: 'market' | 'accessory' | 'gem' | 'party' | 'efficiency';
  setActiveTab: (tab: 'market' | 'accessory' | 'gem' | 'party' | 'efficiency') => void;
  onApiKeyChange: (apiKey: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab, onApiKeyChange }) => {
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    // 로컬 스토리지에서 API 키 불러오기
    const savedApiKey = localStorage.getItem('loaApiKey');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      onApiKeyChange(savedApiKey);
    }
  }, [onApiKeyChange]);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newApiKey = e.target.value;
    setApiKey(newApiKey);
    localStorage.setItem('loaApiKey', newApiKey);
    onApiKeyChange(newApiKey);
  };

  return (
    <nav className={styles.nav}>
      <h1 className={styles.logo}>KuLoa</h1>
      <div className={styles.buttonGroup}>
        <button
          onClick={() => setActiveTab('market')}
          className={`${styles.navButton} ${activeTab === 'market' ? styles.active : ''}`}
        >
          거래소
        </button>
        <button
          onClick={() => setActiveTab('accessory')}
          className={`${styles.navButton} ${activeTab === 'accessory' ? styles.active : ''}`}
        >
          악세
        </button>
        <button
          onClick={() => setActiveTab('gem')}
          className={`${styles.navButton} ${activeTab === 'gem' ? styles.active : ''}`}
        >
          보석
        </button>
        <button
          onClick={() => setActiveTab('party')}
          className={`${styles.navButton} ${activeTab === 'party' ? styles.active : ''}`}
        >
          파티모집
        </button>
        <button
          onClick={() => setActiveTab('efficiency')}
          className={`${styles.navButton} ${activeTab === 'efficiency' ? styles.active : ''}`}
        >
          스펙업효율
        </button>
      </div>
      <div className={styles.apiKeyContainer}>
        <input
          type="text"
          value={apiKey}
          onChange={handleApiKeyChange}
          placeholder="API Key 입력"
          className={styles.apiKeyInput}
        />
      </div>
    </nav>
  );
};

export default Navigation;
