'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/app/styles/Gem.module.css';
import { formatNumber } from '@/app/utils/format';
import Image from 'next/image';

interface GemSearchProps {
  apiKey: string;
}

interface GemGroup {
  name: string;
  code: number;
  imageUrl: string;
  items: {
    level: number;
    price: number | null;
  }[];
}

const gemGroups: GemGroup[] = [
  {
    name: '겁화',
    code: 210000,
    imageUrl: '/Use_12_105.png',
    items: [
      { level: 10, price: null },
      { level: 9, price: null },
      { level: 8, price: null },
      { level: 7, price: null },
      { level: 6, price: null },
    ]
  },
  {
    name: '작열',
    code: 210000,
    imageUrl: '/Use_12_114.png',
    items: [
      { level: 10, price: null },
      { level: 9, price: null },
      { level: 8, price: null },
      { level: 7, price: null },
      { level: 6, price: null },
    ]
  },
  {
    name: '멸화',
    code: 210000,
    imageUrl: '/Use_9_55.png',
    items: [
      { level: 10, price: null },
      { level: 9, price: null },
      { level: 8, price: null },
      { level: 7, price: null },
      { level: 6, price: null },
    ]
  },
  {
    name: '홍염',
    code: 210000,
    imageUrl: '/Use_9_65.png',
    items: [
      { level: 10, price: null },
      { level: 9, price: null },
      { level: 8, price: null },
      { level: 7, price: null },
      { level: 6, price: null },
    ]
  }
];

export default function Gem({ apiKey }: GemSearchProps) {
  const [groups, setGroups] = useState<GemGroup[]>(gemGroups);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null);

  const fetchGemPrices = async () => {
    setIsLoading(true);
    setError(null);
    setLastRefreshTime(new Date());

    const updatedGroups = [...groups];

    for (const group of updatedGroups) {
      for (const item of group.items) {
        try {
          const searchParams = {
            CategoryCode: group.code,
            ItemTier: null,
            ItemGrade: '',
            ItemName: `${item.level}레벨 ${group.name}`,
            PageNo: 1,
            PageSize: 1,
            Sort: 'BUY_PRICE',
            SortCondition: 'ASC',
            CharacterClass: ''
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

          if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
          }

          const data = await response.json();
          item.price = data.Items?.[0]?.AuctionInfo.BuyPrice || null;
        } catch (error) {
          console.error('Search error:', error);
          item.price = null;
        }
      }
    }

    setGroups(updatedGroups);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchGemPrices();
  }, []);

  return (
    <div className={styles.container}>
      {/* <h1 className={styles.title}>보석 시세</h1> */}
      
      <div className={styles.header}>
        <button 
          className={styles.refreshButton}
          onClick={fetchGemPrices}
          disabled={isLoading}
        >
          {isLoading ? '갱신 중...' : '시세 갱신'}
        </button>
        {lastRefreshTime && (
          <span className={styles.lastRefreshTime}>
            마지막 갱신: {lastRefreshTime.toLocaleTimeString()}
          </span>
        )}
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.gemGroups}>
        {groups.map((group, index) => (
          <div key={index} className={styles.gemGroup}>
            <div className={styles.groupHeader}>
              <div className={styles.groupTitle}>
                <h2>{group.name} 보석</h2>
                <Image
                  src={group.imageUrl}
                  alt={`${group.name} 보석`}
                  width={40}
                  height={40}
                  className={styles.gemImage}
                />
              </div>
            </div>
            <ul className={styles.gemList}>
              {group.items.map((item, itemIndex) => (
                <li key={itemIndex} className={styles.gemItem}>
                  <span className={styles.gemLevel}>
                    {item.level}레벨 {group.name}
                  </span>
                  <span className={styles.gemPrice}>
                    {item.price ? formatNumber(item.price) : '-'} G
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
