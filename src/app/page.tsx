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
  const [apiKey, setApiKey] = useState<string>('');

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onApiKeyChange={setApiKey}
      />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === 'market' && <Market apiKey={apiKey} />}
        {activeTab === 'accessory' && <Accessory apiKey={apiKey} />}
        {activeTab === 'gem' && <Gem />}
        {activeTab === 'party' && <PartyFinder />}
        {activeTab === 'efficiency' && <Efficiency />}
      </main>
    </div>
  );
}
