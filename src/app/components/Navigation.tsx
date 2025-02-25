import styles from '../styles/Navigation.module.css';

interface NavigationProps {
  activeTab: 'market' | 'accessory' | 'gem' | 'party' | 'efficiency';
  setActiveTab: (tab: 'market' | 'accessory' | 'gem' | 'party' | 'efficiency') => void;
}

export default function Navigation({ activeTab, setActiveTab }: NavigationProps) {
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
    </nav>
  );
}
