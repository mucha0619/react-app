'use client';

import { useState } from 'react';
import Market from './components/Market';
import Accessory from './components/Accessory';
import Gem from './components/Gem';
import PartyFinder from './components/PartyFinder';
import Efficiency from './components/Efficiency';
import Navigation from './components/Navigation';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'market' | 'accessory' | 'gem' | 'party' | 'efficiency'>('market');
  const [userApiKey, setUserApiKey] = useState<string | null>(null);
  const defaultApiKey = process.env.NEXT_PUBLIC_LOA_API_KEY || '';

  // API 키 선택 로직
  const getActiveApiKey = () => {
    if (activeTab === 'market') {
      return userApiKey || defaultApiKey;
    }
    return userApiKey || '';  // 다른 탭에서는 사용자 입력 키만 사용
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onApiKeyChange={setUserApiKey}
        defaultApiKey={defaultApiKey}
      />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === 'market' && <Market apiKey={getActiveApiKey()} />}
        {activeTab === 'accessory' && <Accessory apiKey={getActiveApiKey()} />}
        {activeTab === 'gem' && <Gem apiKey={getActiveApiKey()} />}
        {activeTab === 'party' && <PartyFinder />}
        {activeTab === 'efficiency' && <Efficiency />}
      </main>
    </div>
  );
}
