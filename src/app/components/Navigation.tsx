import React, { useState, useEffect } from 'react';
import styles from '../styles/Navigation.module.css';

interface NavigationProps {
  activeTab: 'market' | 'accessory' | 'gem' | 'party' | 'efficiency';
  setActiveTab: (tab: 'market' | 'accessory' | 'gem' | 'party' | 'efficiency') => void;
  onApiKeyChange: (apiKey: string | null) => void;
  defaultApiKey: string;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab, onApiKeyChange, defaultApiKey }) => {
  const [apiKey, setApiKey] = useState('');
  const [isEditing, setIsEditing] = useState(true);
  const [tempApiKey, setTempApiKey] = useState('');

  useEffect(() => {
    const savedApiKey = localStorage.getItem('loaApiKey');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setIsEditing(false);
      onApiKeyChange(savedApiKey);
    } else {
      onApiKeyChange(null);  // 사용자가 입력한 API 키가 없음을 알림
    }
  }, [onApiKeyChange]);

  const handleApiKeySubmit = () => {
    if (isEditing) {
      setApiKey(tempApiKey);
      localStorage.setItem('loaApiKey', tempApiKey);
      onApiKeyChange(tempApiKey);
      setIsEditing(false);
    } else {
      setTempApiKey(apiKey);
      setIsEditing(true);
    }
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempApiKey(e.target.value);
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
        <div className={styles.tooltip}>
          <span className={styles.apiKeyLabel}>API Key</span>
          <div className={styles.tooltipText}>
            API 키 발급 방법:
            <ol>
              <li>1. 아래 링크를 클릭하여 개발자 페이지로 이동</li>
              <li>2. 스마일게이트 로그인</li>
              <li>3. 'GET ACCESS TO LOSTARK API' 클릭</li>
              <li>4. 'CREATE A NEW CLIENT' 클릭하여 새 클라이언트 생성</li>
              <li>5. 'CLIENT NAME 만 작성하고 제출</li>
              <li>6. 발급받은 API 키를 여기에 입력</li>
            </ol>
          </div>
        </div>
        {isEditing ? (
          <>
            <input
              type="text"
              value={tempApiKey}
              onChange={handleApiKeyChange}
              placeholder="  입력"
              className={styles.apiKeyInput}
            />
            <button onClick={handleApiKeySubmit} className={styles.apiKeyButton}>
              확인
            </button>
          </>
        ) : (
          <>
            <div className={styles.apiKeyDisplay}>
              {apiKey.slice(0, 8)}...{apiKey.slice(-8)}
            </div>
            <button onClick={handleApiKeySubmit} className={styles.apiKeyButton}>
              수정
            </button>
          </>
        )}
        <a 
          href="https://developer-lostark.game.onstove.com"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.apiKeyLink}
        >
          발급하러 가기
        </a>
      </div>
    </nav>
  );
};

export default Navigation;
