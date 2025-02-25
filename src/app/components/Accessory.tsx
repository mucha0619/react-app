import React, { useState } from 'react';
import styles from '../styles/Accessory.module.css';

interface PolishEffect {
  name: string;
  displayName: string;
  code: number;
  values: {
    high: string;
    medium: string;
    low: string;
  };
}

const NECKLACE_EFFECTS: PolishEffect[] = [
  {
    name: '추가 피해',
    displayName: '추피',
    code: 41,
    values: { high: '2.60', medium: '1.60', low: '0.70' }
  },
  {
    name: '적에게 주는 피해 증가',
    displayName: '적추피',
    code: 42,
    values: { high: '2.00', medium: '1.20', low: '0.55' }
  },
  {
    name: '낙인력',
    displayName: '낙인력',
    code: 43,
    values: { high: '8.00', medium: '4.80', low: '2.15' }
  },
  {
    name: '게이지 획득',
    displayName: '게이지',
    code: 44,
    values: { high: '6.00', medium: '3.60', low: '1.60' }
  },
  {
    name: '공격력 +',
    displayName: '공격력+',
    code: 45,
    values: { high: '390', medium: '195', low: '80' }
  },
  {
    name: '무기 공격력 +',
    displayName: '무공+',
    code: 46,
    values: { high: '960', medium: '480', low: '195' }
  }
];

const EARRING_EFFECTS: PolishEffect[] = [
  {
    name: '공격력 %',
    displayName: '공격력%',
    code: 51,
    values: { high: '1.55', medium: '0.95', low: '0.40' }
  },
  {
    name: '무기 공격력 %',
    displayName: '무공%',
    code: 52,
    values: { high: '3.00', medium: '1.80', low: '0.80' }
  },
  {
    name: '파티원 보호막 효과',
    displayName: '보호막',
    code: 53,
    values: { high: '3.50', medium: '2.10', low: '0.95' }
  },
  {
    name: '파티원 회복 효과',
    displayName: '회복',
    code: 54,
    values: { high: '3.50', medium: '2.10', low: '0.95' }
  },
  {
    name: '공격력 +',
    displayName: '공격력+',
    code: 55,
    values: { high: '390', medium: '195', low: '80' }
  },
  {
    name: '무기 공격력 +',
    displayName: '무공+',
    code: 56,
    values: { high: '960', medium: '480', low: '195' }
  }
];

const RING_EFFECTS: PolishEffect[] = [
  {
    name: '치명타 적중률',
    displayName: '치적',
    code: 61,
    values: { high: '1.55', medium: '0.95', low: '0.40' }
  },
  {
    name: '치명타 피해',
    displayName: '치피',
    code: 62,
    values: { high: '4.00', medium: '2.40', low: '1.10' }
  },
  {
    name: '아군 공격력 강화 효과',
    displayName: '아공강',
    code: 63,
    values: { high: '5.00', medium: '3.00', low: '1.35' }
  },
  {
    name: '아군 피해량 강화 효과',
    displayName: '아피강',
    code: 64,
    values: { high: '7.50', medium: '4.00', low: '2.00' }
  },
  {
    name: '공격력 +',
    displayName: '공격력+',
    code: 65,
    values: { high: '390', medium: '195', low: '80' }
  },
  {
    name: '무기 공격력 +',
    displayName: '무공+',
    code: 66,
    values: { high: '960', medium: '480', low: '195' }
  }
];

interface SearchResult {
  type: 'necklace' | 'earring' | 'ring';
  data: {
    Items: Array<{
      Id: number;
      Name: string;
      Grade: string;
      GradeQuality: number;
      TradeRemainCount: number;
      AuctionInfo: {
        StartPrice: number;
        BuyPrice: number;
        BidPrice: number;
        EndDate: string;
        TradeAllowCount: number;
        UpgradeLevel: number;
      };
      Options: Array<{
        Type: string;
        OptionName: string;
        Value: number;
        IsValuePercentage: boolean;
      }>;
    }>;
  };
}

interface SearchOption {
  effects: Array<{
    type: string;
    level: '상' | '중' | '하';
  }>;
}

interface CommonSearchOption {
  grade: '유물' | '고대';
  quality: number;
  polishCount: 1 | 2 | 3;
  tradeCount: 0 | 1 | 2;
}

interface SearchState {
  common: CommonSearchOption;
  necklace: SearchOption;
  earring: SearchOption;
  ring: SearchOption;
}

interface AccessorySearchProps {
  apiKey: string;
}

interface SavedSearchResult {
  id: string;
  type: 'necklace' | 'earring' | 'ring';
  searchState: SearchState;
  data: SearchResult['data'] | null;
}

const initialCommonSearchOption: CommonSearchOption = {
  grade: '유물',
  quality: 0,
  polishCount: 3,
  tradeCount: 2
};

const initialSearchOption: SearchOption = {
  effects: []
};

const formatGold = (price: number): string => {
  return new Intl.NumberFormat('ko-KR').format(price);
};

type EffectMappings = {
  [key: string]: string;
};

const getEffectMappings = (): EffectMappings => ({
  // 목걸이
  '추가 피해': '추가 피해',
  '적에게 주는 피해 증가': '적에게 주는 피해 증가',
  '낙인력': '낙인력',
  '게이지 획득': '게이지 획득',
  '무기 공격력 +': '무기 공격력',
  '공격력 +': '공격력',
  // 귀걸이
  '공격력 %': '공격력',
  '무기 공격력 %': '무기 공격력',
  '파티원 보호막 효과': '파티원 보호막 효과',
  '파티원 회복 효과': '파티원 회복 효과',
  // 반지
  '치명타 적중률': '치명타 적중률',
  '치명타 피해': '치명타 피해',
  '아군 공격력 강화 효과': '아군 공격력 강화 효과',
  '아군 피해량 강화 효과': '아군 피해량 강화 효과'
});

const getEffectDisplayName = (effectType: string): string => {
  const allEffects = [...NECKLACE_EFFECTS, ...EARRING_EFFECTS, ...RING_EFFECTS];
  const effect = allEffects.find(e => e.name === effectType);
  return effect?.displayName || effectType;
};

const AccessorySearchSection: React.FC<{
  type: 'necklace' | 'earring' | 'ring';
  effects: PolishEffect[];
  title: string;
  searchOptions: SearchOption;
  onSearchOptionsChange: (options: SearchOption) => void;
  onSearch: () => void;
  isLoading: boolean;
}> = ({
  type, 
  effects, 
  title, 
  searchOptions,
  onSearchOptionsChange,
  onSearch,
  isLoading
}) => {
  return (
    <div className={styles.searchSection} style={{ position: 'relative' }}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.searchOptions}>
        <div className={styles.effectsList}>
          {effects.map((effect, index) => (
            <div key={index} className={styles.effectOption}>
              <div className={styles.effectName}>{effect.displayName}</div>
              <div className={styles.effectLevels}>
                <button 
                  className={`${styles.levelButton} ${searchOptions.effects.some(e => e.type === effect.name && e.level === '상') ? styles.active : ''}`}
                  onClick={() => {
                    const existingEffectIndex = searchOptions.effects.findIndex(e => e.type === effect.name);
                    let newEffects = [...searchOptions.effects];
                    
                    if (existingEffectIndex >= 0) {
                      if (searchOptions.effects[existingEffectIndex].level === '상') {
                        newEffects.splice(existingEffectIndex, 1);
                      } else {
                        newEffects[existingEffectIndex] = { type: effect.name, level: '상' };
                      }
                    } else {
                      newEffects.push({ type: effect.name, level: '상' });
                    }
                    
                    onSearchOptionsChange({
                      ...searchOptions,
                      effects: newEffects
                    });
                  }}
                >
                  상
                </button>
                <button 
                  className={`${styles.levelButton} ${searchOptions.effects.some(e => e.type === effect.name && e.level === '중') ? styles.active : ''}`}
                  onClick={() => {
                    const existingEffectIndex = searchOptions.effects.findIndex(e => e.type === effect.name);
                    let newEffects = [...searchOptions.effects];
                    
                    if (existingEffectIndex >= 0) {
                      if (searchOptions.effects[existingEffectIndex].level === '중') {
                        newEffects.splice(existingEffectIndex, 1);
                      } else {
                        newEffects[existingEffectIndex] = { type: effect.name, level: '중' };
                      }
                    } else {
                      newEffects.push({ type: effect.name, level: '중' });
                    }
                    
                    onSearchOptionsChange({
                      ...searchOptions,
                      effects: newEffects
                    });
                  }}
                >
                  중
                </button>
                <button 
                  className={`${styles.levelButton} ${searchOptions.effects.some(e => e.type === effect.name && e.level === '하') ? styles.active : ''}`}
                  onClick={() => {
                    const existingEffectIndex = searchOptions.effects.findIndex(e => e.type === effect.name);
                    let newEffects = [...searchOptions.effects];
                    
                    if (existingEffectIndex >= 0) {
                      if (searchOptions.effects[existingEffectIndex].level === '하') {
                        newEffects.splice(existingEffectIndex, 1);
                      } else {
                        newEffects[existingEffectIndex] = { type: effect.name, level: '하' };
                      }
                    } else {
                      newEffects.push({ type: effect.name, level: '하' });
                    }
                    
                    onSearchOptionsChange({
                      ...searchOptions,
                      effects: newEffects
                    });
                  }}
                >
                  하
                </button>
              </div>
            </div>
          ))}
        </div>
        <button 
          className={styles.searchButton} 
          onClick={onSearch}
          disabled={isLoading}
        >
          {isLoading ? '검색 중...' : '검색'}
        </button>
      </div>
    </div>
  );
};

const CommonSearchOptions: React.FC<{
  options: CommonSearchOption;
  onChange: (options: CommonSearchOption) => void;
}> = ({ options, onChange }) => {
  return (
    <div className={styles.commonSearchOptions}>
      <div className={styles.optionGroup}>
        <label>등급</label>
        <select 
          value={options.grade}
          onChange={(e) => onChange({
            ...options, 
            grade: e.target.value as '유물' | '고대'
          })}
        >
          <option value="유물">유물</option>
          <option value="고대">고대</option>
        </select>
      </div>

      <div className={styles.optionGroup}>
        <label>최소 품질</label>
        <input 
          type="number"
          min="0"
          max="100"
          value={options.quality}
          onChange={(e) => {
            const value = Math.min(100, Math.max(0, Number(e.target.value)));
            onChange({
              ...options,
              quality: value
            });
          }}
          style={{ width: '60px' }}
        />
      </div>

      <div className={styles.optionGroup}>
        <label>연마 횟수</label>
        <select
          value={options.polishCount}
          onChange={(e) => onChange({
            ...options,
            polishCount: Number(e.target.value) as 1 | 2 | 3
          })}
        >
          <option value="1">1회</option>
          <option value="2">2회</option>
          <option value="3">3회</option>
        </select>
      </div>

      <div className={styles.optionGroup}>
        <label>거래 가능 횟수</label>
        <select
          value={options.tradeCount}
          onChange={(e) => onChange({
            ...options,
            tradeCount: Number(e.target.value) as 0 | 1 | 2
          })}
        >
          <option value="0">0회</option>
          <option value="1">1회</option>
          <option value="2">2회</option>
        </select>
      </div>
    </div>
  );
};

interface SearchResultsProps {
  type: 'necklace' | 'earring' | 'ring';
  data: SearchResult['data'] | null;
  searchState: SearchState;
  onRemoveItem: (id: number) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ type, data, searchState, onRemoveItem }) => {
  const lowestPriceItems = data?.Items ? data.Items.reduce((acc: typeof data.Items, item) => {
    // 선택한 효과들만의 값을 키로 사용
    const effectKey = searchState[type].effects
      .map(selectedEffect => {
        const mappedName = getEffectMappings()[selectedEffect.type] || selectedEffect.type;
        const matchingOption = item.Options.find(opt => 
          opt.Type === 'ACCESSORY_UPGRADE' && 
          opt.OptionName === mappedName
        );
        return `${selectedEffect.type}_${matchingOption?.Value || 0}`;
      })
      .sort()
      .join('_');
    
    const existingItem = acc.find(i => {
      const existingKey = searchState[type].effects
        .map(selectedEffect => {
          const mappedName = getEffectMappings()[selectedEffect.type] || selectedEffect.type;
          const matchingOption = i.Options.find(opt => 
            opt.Type === 'ACCESSORY_UPGRADE' && 
            opt.OptionName === mappedName
          );
          return `${selectedEffect.type}_${matchingOption?.Value || 0}`;
        })
        .sort()
        .join('_');
      return existingKey === effectKey;
    });

    if (!existingItem || item.AuctionInfo.BuyPrice < existingItem.AuctionInfo.BuyPrice) {
      if (existingItem) {
        acc = acc.filter(i => i !== existingItem);
      }
      acc.push(item);
    }

    return acc;
  }, []) : [];

  const typeTitle = type === 'necklace' ? '목걸이' : 
                   type === 'earring' ? '귀걸이' : '반지';

  return (
    <div className={styles.resultList}>
      <div className={styles.resultHeader}>
        <h3>{typeTitle} 검색 결과</h3>
      </div>
      {lowestPriceItems.length > 0 ? (
        lowestPriceItems.map((item) => (
          <div key={item.Id} className={styles.resultItem}>
            <div className={styles.itemInfo}>
              <div className={styles.itemMainInfo}>
                <div className={styles.itemEffects}>
                  {item.Options
                    .filter(opt => opt.Type === 'ACCESSORY_UPGRADE')
                    .map((opt, idx) => {
                      // 귀걸이의 공격력과 무기공격력은 % 표시 추가
                      let displayName = opt.OptionName;
                      if (type === 'earring' && (opt.OptionName === '공격력' || opt.OptionName === '무기 공격력')) {
                        displayName = `${opt.OptionName}%`;
                      }
                      
                      const value = opt.IsValuePercentage ? opt.Value.toFixed(2) : opt.Value;
                      return (
                        <span key={idx} className={styles.effect}>
                          {`${displayName} +${value}${opt.IsValuePercentage ? '%' : ''}`}
                        </span>
                      );
                    })
                  }
                </div>
                <div className={styles.itemDetails}>
                  <span className={styles.quality}>품질 {item.GradeQuality}</span>
                  <span className={styles.tradeInfo}>
                    연마 {item.AuctionInfo.UpgradeLevel}회 / 
                    거래 {item.AuctionInfo.TradeAllowCount}회
                  </span>
                </div>
              </div>
              <div className={styles.itemActions}>
                <span className={styles.price}>{formatGold(item.AuctionInfo.BuyPrice)} G</span>
                <button 
                  className={styles.removeButton}
                  onClick={() => onRemoveItem(item.Id)}
                  aria-label="아이템 삭제"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))
      ) : searchState[type].effects.length > 0 ? (
        <div className={styles.noResults}>검색 결과가 없습니다.</div>
      ) : null}
    </div>
  );
};

const AccessorySearch: React.FC<AccessorySearchProps> = ({ apiKey }) => {
  const [searchState, setSearchState] = useState<SearchState>({
    common: initialCommonSearchOption,
    necklace: initialSearchOption,
    earring: initialSearchOption,
    ring: initialSearchOption
  });

  const [savedSearches, setSavedSearches] = useState<SavedSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({
    necklace: false,
    earring: false,
    ring: false
  });
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (type: 'necklace' | 'earring' | 'ring') => {
    setIsLoading(prev => ({ ...prev, [type]: true }));
    setError(null);

    try {
      const searchOptions = searchState[type].effects;
      const etcOptions = searchOptions.map(effect => {
        let secondOption = 0;
        let effectValue = 0;
        if (type === 'necklace') {
          if (effect.type === '추가 피해') {
            secondOption = 41;
            effectValue = effect.level === '상' ? 260
              : effect.level === '중' ? 160
              : 70;
          }
          else if (effect.type === '적에게 주는 피해 증가') {
            secondOption = 42;
            effectValue = effect.level === '상' ? 200
              : effect.level === '중' ? 120
              : 55;
          }
          else if (effect.type === '낙인력') {
            secondOption = 44;
            effectValue = effect.level === '상' ? 800
              : effect.level === '중' ? 480
              : 215;
          }
          else if (effect.type === '게이지 획득') {
            secondOption = 43;
            effectValue = effect.level === '상' ? 600
              : effect.level === '중' ? 360
              : 160;
          }
          else if (effect.type === '공격력 +') {
            secondOption = 53;
            effectValue = effect.level === '상' ? 390
              : effect.level === '중' ? 195
              : 80;
          }
          else if (effect.type === '무기 공격력 +') {
            secondOption = 54;
            effectValue = effect.level === '상' ? 960
              : effect.level === '중' ? 480
              : 195;
          }
        }
        else if (type === 'earring') {
          if (effect.type === '공격력 %') {
            secondOption = 45;
            effectValue = effect.level === '상' ? 155
              : effect.level === '중' ? 95
              : 40;
          }
          else if (effect.type === '무기 공격력 %') {
            secondOption = 46;
            effectValue = effect.level === '상' ? 300
              : effect.level === '중' ? 180
              : 80;
          }
          else if (effect.type === '파티원 보호막 효과') {
            secondOption = 43;
            effectValue = effect.level === '상' ? 350
              : effect.level === '중' ? 210
              : 95;
          }
          else if (effect.type === '파티원 회복 효과') {
            secondOption = 44;
            effectValue = effect.level === '상' ? 350
              : effect.level === '중' ? 210
              : 95;
          }
          else if (effect.type === '공격력 +') {
            secondOption = 53;
            effectValue = effect.level === '상' ? 390
              : effect.level === '중' ? 195
              : 80;
          }
          else if (effect.type === '무기 공격력 +') {
            secondOption = 54;
            effectValue = effect.level === '상' ? 960
              : effect.level === '중' ? 480
              : 195;
          }
        }
        else if (type === 'ring') {
          if (effect.type === '치명타 적중률') {
            secondOption = 49;
            effectValue = effect.level === '상' ? 155
              : effect.level === '중' ? 95
              : 40;
          }
          else if (effect.type === '치명타 피해') {
            secondOption = 50;
            effectValue = effect.level === '상' ? 400
              : effect.level === '중' ? 240
              : 110;
          }
          else if (effect.type === '아군 공격력 강화 효과') {
            secondOption = 51;
            effectValue = effect.level === '상' ? 500
              : effect.level === '중' ? 300
              : 135;
          }
          else if (effect.type === '아군 피해량 강화 효과') {
            secondOption = 52;
            effectValue = effect.level === '상' ? 750
              : effect.level === '중' ? 400
              : 200;
          }
          else if (effect.type === '공격력 +') {
            secondOption = 53;
            effectValue = effect.level === '상' ? 390
              : effect.level === '중' ? 195
              : 80;
          }
          else if (effect.type === '무기 공격력 +') {
            secondOption = 54;
            effectValue = effect.level === '상' ? 960
              : effect.level === '중' ? 480
              : 195;
          }
        }
        
        const option = {
          FirstOption: 7,
          SecondOption: secondOption,
          Value: effectValue,
          MinValue: effectValue,
          MaxValue: effectValue
        };

        return option;
      }).filter(option => option.SecondOption !== 0);

      const searchParams = {
        CategoryCode: type === 'necklace' ? 200010 : type === 'earring' ? 200020 : 200030,
        ItemTier: 4,
        ItemGrade: searchState.common.grade === '고대' ? '고대' : '유물',
        PageNo: 1,
        PageSize: 10,
        SortCondition: 'ASC',
        Sort: 'BUY_PRICE',
        ItemTradeAllowCount: searchState.common.tradeCount || 0,
        ItemUpgradeLevel: searchState.common.polishCount || 0,
        ItemGradeQuality: searchState.common.quality || 0,
        EtcOptions: etcOptions
      };

      try {
        const response = await fetch('https://developer-lostark.game.onstove.com/auctions/items', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'authorization': `bearer ${apiKey}`,
            'content-Type': 'application/json',
          },
          body: JSON.stringify(searchParams)
        });

        const responseText = await response.text();
        if (!response.ok) {
          throw new Error(`API Error: ${response.status} - ${responseText}`);
        }

        const data = responseText ? JSON.parse(responseText) : null;
        
        setSavedSearches(prev => {
          const updated = prev.filter(item => item.type !== type);
          if (data?.Items?.length) {
            updated.push({
              id: `${type}_${Date.now()}`,
              type,
              searchState: JSON.parse(JSON.stringify(searchState)),
              data
            });
          }
          return updated;
        });
      } catch (error) {
        console.error(`Error searching ${type}:`, error);
        throw error;
      }
    } catch (error) {
      console.error('Search error:', error);
      setError('검색 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleRemoveItem = (type: 'necklace' | 'earring' | 'ring', itemId: number) => {
    setSavedSearches(prev => {
      return prev.map(search => {
        if (search.type === type && search.data?.Items) {
          return {
            ...search,
            data: {
              ...search.data,
              Items: search.data.Items.filter(item => item.Id !== itemId)
            }
          };
        }
        return search;
      }).filter(search => (search.data?.Items?.length ?? 0) > 0);
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <AccessorySearchSection
          type="necklace"
          effects={NECKLACE_EFFECTS}
          title="목걸이"
          searchOptions={searchState.necklace}
          onSearchOptionsChange={(options) => setSearchState({ ...searchState, necklace: options })}
          onSearch={() => handleSearch('necklace')}
          isLoading={isLoading.necklace}
        />
        <AccessorySearchSection
          type="earring"
          effects={EARRING_EFFECTS}
          title="귀걸이"
          searchOptions={searchState.earring}
          onSearchOptionsChange={(options) => setSearchState({ ...searchState, earring: options })}
          onSearch={() => handleSearch('earring')}
          isLoading={isLoading.earring}
        />
        <AccessorySearchSection
          type="ring"
          effects={RING_EFFECTS}
          title="반지"
          searchOptions={searchState.ring}
          onSearchOptionsChange={(options) => setSearchState({ ...searchState, ring: options })}
          onSearch={() => handleSearch('ring')}
          isLoading={isLoading.ring}
        />
      </div>

      <CommonSearchOptions 
        options={searchState.common}
        onChange={(options) => setSearchState({ ...searchState, common: options })}
      />
      
      <div className={styles.resultsContainer}>
        {savedSearches.some(s => s.type === 'necklace' && s.data?.Items && s.data.Items.length > 0) && (
          <SearchResults
            type="necklace"
            data={savedSearches.find(s => s.type === 'necklace')?.data || null}
            searchState={searchState}
            onRemoveItem={(itemId) => handleRemoveItem('necklace', itemId)}
          />
        )}
        {savedSearches.some(s => s.type === 'earring' && s.data?.Items && s.data.Items.length > 0) && (
          <SearchResults
            type="earring"
            data={savedSearches.find(s => s.type === 'earring')?.data || null}
            searchState={searchState}
            onRemoveItem={(itemId) => handleRemoveItem('earring', itemId)}
          />
        )}
        {savedSearches.some(s => s.type === 'ring' && s.data?.Items && s.data.Items.length > 0) && (
          <SearchResults
            type="ring"
            data={savedSearches.find(s => s.type === 'ring')?.data || null}
            searchState={searchState}
            onRemoveItem={(itemId) => handleRemoveItem('ring', itemId)}
          />
        )}
      </div>
      
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

export default AccessorySearch;
