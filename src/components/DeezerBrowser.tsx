"use client";
import React, { useState, useEffect } from 'react';
import {
  searchTracks,
  // searchHindiSongs,
  // searchByArtist,
  getCharts
} from '../services/deezerApi';
import EnhancedTrackList from './EnhancedTrackList';

interface DeezerBrowserProps {
  viewType: string;
}

const DeezerBrowser: React.FC<DeezerBrowserProps> = ({ viewType }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deezerTracks, setDeezerTracks] = useState<any[]>([]);
  const [chartTracks, setChartTracks] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'charts' | 'search' | 'hindi'>('charts');

  useEffect(() => {
    loadCharts();
  }, []);

  const loadCharts = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getCharts();
      if (result.success) {
        setChartTracks(result.tracks);
      } else {
        setError(result.error || 'Failed to load charts. Please check API key.');
      }
    } catch (err) {
      setError('Failed to load charts. Please check your API key and internet connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ...existing search and UI logic...
  return null;
};

export default DeezerBrowser;
