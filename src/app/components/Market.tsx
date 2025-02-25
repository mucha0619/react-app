import React, { useState, useEffect } from 'react';
import styles from '../styles/Market.module.css';

interface MarketItem {
  Id: number;
  Name: string;
  Grade: string;
  Icon: string;
  BundleCount: number;
  TradeRemainCount: number;
  YDayAvgPrice: number;
  RecentPrice: number;
  CurrentMinPrice: number;
  Stats: any[];
}

interface ItemCategory {
  id: string;
  title: string;
  items: string[];
}

const ITEM_CATEGORIES: ItemCategory[] = [
  {
    id: 'destruction',
    title: '파괴석',
    items: [
      '정제된 파괴강석',
      '운명의 파괴석'
    ]
  },
  {
    id: 'guardian',
    title: '수호석',
    items: [
      '정제된 수호강석',
      '운명의 수호석'
    ]
  },
  {
    id: 'leapstone',
    title: '돌파석',
    items: [
      '찬란한 명예의 돌파석',
      '운명의 돌파석'
    ]
  },
  {
    id: 'honor-shard',
    title: '운명의 파편',
    items: [
      '운명의 파편 주머니(대)',
      '운명의 파편 주머니(중)',
      '운명의 파편 주머니(소)'
    ]
  },
  {
    id: 'fusion',
    title: '융화 재료',
    items: [
      '아비도스 융화 재료',
      '최상급 오레하 융화 재료'
    ]
  },
  {
    id: 'additional',
    title: '보조 재료',
    items: [
      '용암의 숨결',
      '빙하의 숨결'
    ]
  }
];

const ENGRAVING_BOOKS: ItemCategory[] = [
  {
    id: 'engraving',
    title: '유물 각인서',
    items: [
      '아드레날린 각인서',
      '원한 각인서',
      '예리한 둔기 각인서',
      '돌격대장 각인서',
      '기습의 대가 각인서',
      '타격의 대가 각인서',
      '결투의 대가 각인서',
      '저주받은 인형 각인서',
      '안정된 상태 각인서',
      '슈퍼 차지 각인서',
      '마나 효율 증가 각인서',
      '달인의 저력 각인서',
      '바리케이드 각인서',
      '마나의 흐름 각인서',
      '각성 각인서',
      '구슬동자 각인서'
    ]
  }
];

const calculatePriceChange = (currentPrice: number, yesterdayPrice: number) => {
  if (!yesterdayPrice) return { change: 0, isIncrease: false };
  
  const change = ((currentPrice - yesterdayPrice) / yesterdayPrice * 100);
  return {
    change: Math.abs(change).toFixed(1),
    isIncrease: change > 0
  };
};

interface ItemCardProps {
  item: { name: string; data: MarketItem };
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  return (
    <div className={styles.itemCard}>
      <div className={styles.itemBasicInfo}>
        <img 
          src={item.data.Icon} 
          alt={item.data.Name} 
          className={styles.itemIcon}
          onError={(e) => {
            e.currentTarget.src = '/fallback-icon.png';
          }}
        />
        <h3 className={`${styles.itemName} ${styles[item.data.Grade.toLowerCase()]}`}>
          {item.data.Name}
        </h3>
      </div>
      <div className={styles.priceInfo}>
        {(() => {
          const { change, isIncrease } = calculatePriceChange(
            item.data.CurrentMinPrice,
            item.data.YDayAvgPrice
          );
          return (
            <span className={`${styles.change} ${isIncrease ? styles.increase : styles.decrease}`}>
              {isIncrease ? '▲' : '▼'} {change}%
            </span>
          );
        })()}
        <p className={styles.price}>
          {item.data.CurrentMinPrice.toLocaleString()}골드
        </p>
      </div>
    </div>
  );
};

export default function Market() {
  const [itemsData, setItemsData] = useState<{ [key: string]: MarketItem }>({});
  const [loading, setLoading] = useState(false);

  const fetchItemPrice = async (itemName: string) => {
    try {
      const response = await fetch('/api/lostark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint: 'market',
          body: { itemName }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch item price');
      }

      const data = await response.json();
      return data.Items?.[0] || null;
    } catch (error) {
      console.error('Error fetching item price:', error);
      return null;
    }
  };

  const fetchAllPrices = async () => {
    setLoading(true);
    const allItems = [...ITEM_CATEGORIES, ...ENGRAVING_BOOKS].flatMap(category => 
      category.items.map(item => ({ name: item, category: category.id }))
    );

    const newItemsData: { [key: string]: MarketItem } = {};

    for (const item of allItems) {
      const itemData = await fetchItemPrice(item.name);
      if (itemData) {
        newItemsData[item.name] = itemData;
      }
    }

    setItemsData(newItemsData);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllPrices();
  }, []);

  const getSortedItems = (category: ItemCategory) => {
    return category.items
      .map(itemName => ({
        name: itemName,
        data: itemsData[itemName]
      }))
      .filter(item => item.data)
      .sort((a, b) => b.data.CurrentMinPrice - a.data.CurrentMinPrice);
  };

  const getSortedEngravingBooks = (category: ItemCategory) => {
    return category.items
      .map(itemName => ({
        name: itemName,
        data: itemsData[itemName]
      }))
      .filter(item => item.data)
      .sort((a, b) => b.data.CurrentMinPrice - a.data.CurrentMinPrice);
  };

  return (
    <div className={styles.container}>
      {loading ? (
        <div className={styles.loading}>가격 정보를 불러오는 중...</div>
      ) : (
        <div className={styles.categoryContainer}>
          <div className={styles.mainGroup}>
            {ITEM_CATEGORIES.map((category) => (
              <div key={category.id} className={`${styles.category} ${styles[category.id]}`}>
                <div className={styles.categoryHeader}>
                  <h2>{category.title}</h2>
                </div>
                <div className={styles.itemList}>
                  {getSortedItems(category).map((item) => (
                    <ItemCard key={item.name} item={item} />
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {ENGRAVING_BOOKS.map((category) => (
            <div key={category.id} className={`${styles.category} ${styles[category.id]}`}>
              <div className={styles.categoryHeader}>
                <h2>{category.title}</h2>
              </div>
              <div className={styles.itemList}>
                {getSortedEngravingBooks(category).map((item) => (
                  <ItemCard key={item.name} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
