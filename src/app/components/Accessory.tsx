import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/Accessory.module.css';
import { formatGold } from '@/app/utils/format';

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
    displayName: '보호막 효과',
    code: 53,
    values: { high: '3.50', medium: '2.10', low: '0.95' }
  },
  {
    name: '파티원 회복 효과',
    displayName: '회복 효과',
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

interface AuctionItem {
  Id: number;
  Name: string;
  Grade: string;
  Tier: number;
  Level: number;
  Icon: string;
  GradeQuality: number;
  AuctionInfo: {
    StartPrice: number;
    BuyPrice: number;
    BidPrice: number;
    EndDate: string;
    BidCount: number;
    BidStartPrice: number;
    IsCompetitive: boolean;
    TradeAllowCount: number;
    UpgradeLevel: number;
  };
  Options: {
    Type: string;
    OptionName: string;
    OptionNameTripod: string;
    Value: number;
    IsPenalty: boolean;
    IsSkillOption: boolean;
    IsClassOption: boolean;
    ClassName: string;
    IsEstherOption: boolean;
    IsEndContents: boolean;
    IsSetOptions: boolean;
    SetOptions: any[];
    IsFixed: boolean;
    IsLevelOption: boolean;
    IsGemOption: boolean;
    IsCombatStats: boolean;
    IsInvalidOption: boolean;
    IsEdited: boolean;
    IsHighlight: boolean;
    MaxValue: number;
    MinValue: number;
    ValueType: string;
    IsAuthentic: boolean;
    IsBestOption: boolean;
    IsInvalidCustomOption: boolean;
    IsLowPenalty: boolean;
    IsRequiredOption: boolean;
    IsSelectOption: boolean;
    IsStarOption: boolean;
    IsStateOption: boolean;
    IsUnique: boolean;
    IsUniqueOption: boolean;
    IsDestruction: boolean;
    IsExist: boolean;
    IsGroup: boolean;
    IsGroupExist: boolean;
    IsMoving: boolean;
    IsSigil: boolean;
    IsSkill: boolean;
    IsSkillGroup: boolean;
    IsStack: boolean;
    IsUseInRecipe: boolean;
    IsValuePercentage: boolean;
  }[];
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

const getEffectMappings = (): { [key: string]: string } => ({
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

const getEffectMapping = (type: 'necklace' | 'earring' | 'ring', effectType: string, level: string) => {
  let secondOption = 0;
  let value = 0;

  if (type === 'necklace') {
    if (effectType === '추가 피해') {
      secondOption = 41;
      value = level === '상' ? 260
        : level === '중' ? 160
        : 70;
    }
    else if (effectType === '적에게 주는 피해 증가') {
      secondOption = 42;
      value = level === '상' ? 200
        : level === '중' ? 120
        : 55;
    }
    else if (effectType === '낙인력') {
      secondOption = 44;
      value = level === '상' ? 800
        : level === '중' ? 480
        : 215;
    }
    else if (effectType === '게이지 획득') {
      secondOption = 43;
      value = level === '상' ? 600
        : level === '중' ? 360
        : 160;
    }
    else if (effectType === '공격력 +') {
      secondOption = 53;
      value = level === '상' ? 390
        : level === '중' ? 195
        : 80;
    }
    else if (effectType === '무기 공격력 +') {
      secondOption = 54;
      value = level === '상' ? 960
        : level === '중' ? 480
        : 195;
    }
  }
  else if (type === 'earring') {
    if (effectType === '공격력 %') {
      secondOption = 45;
      value = level === '상' ? 155
        : level === '중' ? 95
        : 40;
    }
    else if (effectType === '무기 공격력 %') {
      secondOption = 46;
      value = level === '상' ? 300
        : level === '중' ? 180
        : 80;
    }
    else if (effectType === '파티원 보호막 효과') {
      secondOption = 43;
      value = level === '상' ? 350
        : level === '중' ? 210
        : 95;
    }
    else if (effectType === '파티원 회복 효과') {
      secondOption = 44;
      value = level === '상' ? 350
        : level === '중' ? 210
        : 95;
    }
    else if (effectType === '공격력 +') {
      secondOption = 53;
      value = level === '상' ? 390
        : level === '중' ? 195
        : 80;
    }
    else if (effectType === '무기 공격력 +') {
      secondOption = 54;
      value = level === '상' ? 960
        : level === '중' ? 480
        : 195;
    }
  }
  else if (type === 'ring') {
    if (effectType === '치명타 적중률') {
      secondOption = 49;
      value = level === '상' ? 155
        : level === '중' ? 95
        : 40;
    }
    else if (effectType === '치명타 피해') {
      secondOption = 50;
      value = level === '상' ? 400
        : level === '중' ? 240
        : 110;
    }
    else if (effectType === '아군 공격력 강화 효과') {
      secondOption = 51;
      value = level === '상' ? 500
        : level === '중' ? 300
        : 135;
    }
    else if (effectType === '아군 피해량 강화 효과') {
      secondOption = 52;
      value = level === '상' ? 750
        : level === '중' ? 400
        : 200;
    }
    else if (effectType === '공격력 +') {
      secondOption = 53;
      value = level === '상' ? 390
        : level === '중' ? 195
        : 80;
    }
    else if (effectType === '무기 공격력 +') {
      secondOption = 54;
      value = level === '상' ? 960
        : level === '중' ? 480
        : 195;
    }
  }

  return { secondOption, value };
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
  onRemoveItem: (id: string) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ type, data, searchState, onRemoveItem }) => {
  const typeTitle = type === 'necklace' ? '목걸이' : 
                   type === 'earring' ? '귀걸이' : '반지';

  // 검색 조건을 문자열로 변환하여 표시
  const searchCondition = searchState[type].effects
    .map(effect => `${effect.type} ${effect.level}`)
    .join(', ');

  return (
    <div className={styles.resultList}>
      <div className={styles.resultHeader}>
        <h3>{typeTitle} 검색 결과</h3>
        <div className={styles.searchCondition}>
          검색 조건: {searchCondition}
        </div>
      </div>
      {data?.Items && data.Items.length > 0 ? (
        data.Items.map((item) => (
          <div key={item.Id} className={styles.resultItem}>
            <div className={styles.itemInfo}>
              <div className={styles.itemMainInfo}>
                <div className={styles.itemEffects}>
                  {item.Options
                    .filter(opt => opt.Type === 'ACCESSORY_UPGRADE')
                    .map((opt, idx) => {
                      let displayName = opt.OptionName;
                      if (type === 'earring' && (opt.OptionName === '공격력' || opt.OptionName === '무기 공격력')) {
                        displayName = `${opt.OptionName}%`;
                      }
                      
                      const value = opt.IsValuePercentage ? opt.Value.toFixed(2) : opt.Value;
                      return (
                        <span key={`${item.Id}-${opt.OptionName}-${opt.Value}`} className={styles.effect}>
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
                  onClick={() => onRemoveItem(`${type}_${item.Id}`)}
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
    necklace: { effects: [] },
    earring: { effects: [] },
    ring: { effects: [] }
  });

  const [savedSearches, setSavedSearches] = useState<SavedSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({
    necklace: false,
    earring: false,
    ring: false
  });
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null);
  const autoRefreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 자동 갱신 타이머 설정/해제
  useEffect(() => {
    if (autoRefresh && savedSearches.length > 0) {
      // 5분마다 저장된 검색 결과 갱신
      const refreshSearches = async () => {
        setLastRefreshTime(new Date());
        
        // 각 저장된 검색에 대해 새로운 검색 실행
        for (const search of savedSearches) {
          setIsLoading(prev => ({ ...prev, [search.type]: true }));
          try {
            const response = await fetch('https://developer-lostark.game.onstove.com/auctions/items', {
              method: 'POST',
              headers: {
                'accept': 'application/json',
                'authorization': `bearer ${apiKey}`,
                'content-Type': 'application/json',
              },
              body: JSON.stringify({
                CategoryCode: search.type === 'necklace' ? 200010 : search.type === 'earring' ? 200020 : 200030,
                ItemTier: 4,
                ItemGrade: search.searchState.common.grade === '고대' ? '고대' : '유물',
                PageNo: 1,
                PageSize: 10,
                SortCondition: 'ASC',
                Sort: 'BUY_PRICE',
                ItemTradeAllowCount: search.searchState.common.tradeCount || 0,
                ItemUpgradeLevel: search.searchState.common.polishCount || 0,
                ItemGradeQuality: search.searchState.common.quality || 0,
                EtcOptions: search.searchState[search.type].effects.map(effect => {
                  const effectMapping = getEffectMapping(search.type, effect.type, effect.level);
                  return {
                    FirstOption: 7,
                    SecondOption: effectMapping.secondOption,
                    Value: effectMapping.value,
                    MinValue: effectMapping.value,
                    MaxValue: effectMapping.value
                  };
                }).filter(option => option.SecondOption !== 0)
              })
            });

            const responseText = await response.text();
            if (!response.ok) {
              throw new Error(`API Error: ${response.status} - ${responseText}`);
            }

            const data = responseText ? JSON.parse(responseText) : null;
            
            if (data?.Items?.length) {
              // 각 검색 결과에서 최저가만 필터링
              const filteredItems = data.Items.reduce((acc: AuctionItem[], item: AuctionItem) => {
                const effectKey = search.searchState[search.type].effects
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
                  const existingKey = search.searchState[search.type].effects
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
              }, []);

              setSavedSearches(prev => {
                const otherSearches = prev.filter(s => s.id !== search.id);
                return [...otherSearches, {
                  ...search,
                  data: {
                    ...data,
                    Items: filteredItems
                  }
                }];
              });
            }
          } catch (error) {
            console.error(`Error refreshing ${search.type}:`, error);
          } finally {
            setIsLoading(prev => ({ ...prev, [search.type]: false }));
          }
        }
      };

      autoRefreshIntervalRef.current = setInterval(refreshSearches, 5 * 60 * 1000);
      // 활성화 즉시 첫 갱신 실행
      refreshSearches();
    } else if (autoRefreshIntervalRef.current) {
      clearInterval(autoRefreshIntervalRef.current);
      autoRefreshIntervalRef.current = null;
    }

    return () => {
      if (autoRefreshIntervalRef.current) {
        clearInterval(autoRefreshIntervalRef.current);
      }
    };
  }, [autoRefresh, savedSearches.length]);

  const formatLastRefreshTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const handleSearch = async (type: 'necklace' | 'earring' | 'ring') => {
    setIsLoading(prev => ({ ...prev, [type]: true }));
    setError(null);

    try {
      const searchOptions = searchState[type].effects;
      const etcOptions = searchOptions.map(effect => {
        const effectMapping = getEffectMapping(type, effect.type, effect.level);
        return {
          FirstOption: 7,
          SecondOption: effectMapping.secondOption,
          Value: effectMapping.value,
          MinValue: effectMapping.value,
          MaxValue: effectMapping.value
        };
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
      
      if (data?.Items?.length) {
        // 검색 조건을 문자열로 변환하여 검색 ID에 포함
        const searchCondition = searchState[type].effects
          .map(effect => `${effect.type}_${effect.level}`)
          .sort()
          .join('_');
          
        const searchId = `${type}_${searchCondition}_${Date.now()}`;
        setSavedSearches(prev => [...prev, {
          id: searchId,
          type,
          searchState: JSON.parse(JSON.stringify(searchState)),
          data: {
            ...data,
            // 각 검색 결과에서 최저가만 필터링
            Items: data.Items.reduce((acc: AuctionItem[], item: AuctionItem) => {
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
            }, [])
          }
        }]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setError('검색 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleRemoveItem = (type: 'necklace' | 'earring' | 'ring', searchId: string) => {
    setSavedSearches(prev => prev.filter(item => item.id !== searchId));
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <AccessorySearchSection
          type="necklace"
          title="목걸이"
          effects={NECKLACE_EFFECTS}
          searchOptions={searchState.necklace}
          onSearchOptionsChange={(options) => setSearchState({ ...searchState, necklace: options })}
          onSearch={() => handleSearch('necklace')}
          isLoading={isLoading.necklace}
        />
        <AccessorySearchSection
          type="earring"
          title="귀걸이"
          effects={EARRING_EFFECTS}
          searchOptions={searchState.earring}
          onSearchOptionsChange={(options) => setSearchState({ ...searchState, earring: options })}
          onSearch={() => handleSearch('earring')}
          isLoading={isLoading.earring}
        />
        <AccessorySearchSection
          type="ring"
          title="반지"
          effects={RING_EFFECTS}
          searchOptions={searchState.ring}
          onSearchOptionsChange={(options) => setSearchState({ ...searchState, ring: options })}
          onSearch={() => handleSearch('ring')}
          isLoading={isLoading.ring}
        />
      </div>

      <div className={styles.commonSearchOptions}>
        <CommonSearchOptions 
          options={searchState.common}
          onChange={(options) => setSearchState({ ...searchState, common: options })}
        />
        <div className={styles.autoRefreshContainer}>
          {lastRefreshTime && autoRefresh && (
            <div className={styles.lastRefreshTime}>
              마지막 갱신: {formatLastRefreshTime(lastRefreshTime)}
            </div>
          )}
          <button
            className={`${styles.autoRefreshButton} ${autoRefresh ? styles.active : ''}`}
            onClick={() => setAutoRefresh(!autoRefresh)}
            disabled={savedSearches.length === 0 || Object.values(isLoading).some(loading => loading)}
          >
            <span>{autoRefresh ? '자동 갱신 중' : '자동 갱신'}</span>
            {Object.values(isLoading).some(loading => loading) && <span>...</span>}
          </button>
        </div>
      </div>
      
      <div className={styles.resultsContainer}>
        {/* 목걸이 결과 */}
        {savedSearches.some(s => s.type === 'necklace' && s.data?.Items && s.data.Items.length > 0) && (
          <div className={styles.resultList}>
            <div className={styles.resultHeader}>
              <h3>목걸이 검색 결과</h3>
            </div>
            {savedSearches
              .filter(s => s.type === 'necklace' && s.data?.Items && s.data.Items.length > 0)
              .map(search => (
                <div key={search.id} className={styles.resultGroup}>
                  {search.data?.Items.map(item => (
                    <div key={item.Id} className={styles.resultItem}>
                      <div className={styles.itemInfo}>
                        <div className={styles.itemMainInfo}>
                          <div className={styles.itemEffects}>
                            {item.Options
                              .filter(opt => opt.Type === 'ACCESSORY_UPGRADE')
                              .map((opt) => {
                                let displayName = opt.OptionName;
                                const value = opt.IsValuePercentage ? opt.Value.toFixed(2) : opt.Value;
                                return (
                                  <span key={`${item.Id}-${opt.OptionName}-${opt.Value}`} className={styles.effect}>
                                    {`${displayName} +${value}${opt.IsValuePercentage ? '%' : ''}`}
                                  </span>
                                );
                              })}
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
                            onClick={() => handleRemoveItem('necklace', search.id)}
                            aria-label="아이템 삭제"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
          </div>
        )}

        {/* 귀걸이 결과 */}
        {savedSearches.some(s => s.type === 'earring' && s.data?.Items && s.data.Items.length > 0) && (
          <div className={styles.resultList}>
            <div className={styles.resultHeader}>
              <h3>귀걸이 검색 결과</h3>
            </div>
            {savedSearches
              .filter(s => s.type === 'earring' && s.data?.Items && s.data.Items.length > 0)
              .map(search => (
                <div key={search.id} className={styles.resultGroup}>
                  {search.data?.Items.map(item => (
                    <div key={item.Id} className={styles.resultItem}>
                      <div className={styles.itemInfo}>
                        <div className={styles.itemMainInfo}>
                          <div className={styles.itemEffects}>
                            {item.Options
                              .filter(opt => opt.Type === 'ACCESSORY_UPGRADE')
                              .map((opt) => {
                                let displayName = opt.OptionName;
                                if (opt.OptionName === '공격력' || opt.OptionName === '무기 공격력') {
                                  displayName = `${opt.OptionName}%`;
                                }
                                const value = opt.IsValuePercentage ? opt.Value.toFixed(2) : opt.Value;
                                return (
                                  <span key={`${item.Id}-${opt.OptionName}-${opt.Value}`} className={styles.effect}>
                                    {`${displayName} +${value}${opt.IsValuePercentage ? '%' : ''}`}
                                  </span>
                                );
                              })}
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
                            onClick={() => handleRemoveItem('earring', search.id)}
                            aria-label="아이템 삭제"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
          </div>
        )}

        {/* 반지 결과 */}
        {savedSearches.some(s => s.type === 'ring' && s.data?.Items && s.data.Items.length > 0) && (
          <div className={styles.resultList}>
            <div className={styles.resultHeader}>
              <h3>반지 검색 결과</h3>
            </div>
            {savedSearches
              .filter(s => s.type === 'ring' && s.data?.Items && s.data.Items.length > 0)
              .map(search => (
                <div key={search.id} className={styles.resultGroup}>
                  {search.data?.Items.map(item => (
                    <div key={item.Id} className={styles.resultItem}>
                      <div className={styles.itemInfo}>
                        <div className={styles.itemMainInfo}>
                          <div className={styles.itemEffects}>
                            {item.Options
                              .filter(opt => opt.Type === 'ACCESSORY_UPGRADE')
                              .map((opt) => {
                                let displayName = opt.OptionName;
                                const value = opt.IsValuePercentage ? opt.Value.toFixed(2) : opt.Value;
                                return (
                                  <span key={`${item.Id}-${opt.OptionName}-${opt.Value}`} className={styles.effect}>
                                    {`${displayName} +${value}${opt.IsValuePercentage ? '%' : ''}`}
                                  </span>
                                );
                              })}
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
                            onClick={() => handleRemoveItem('ring', search.id)}
                            aria-label="아이템 삭제"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
          </div>
        )}
      </div>
      
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

export default AccessorySearch;
