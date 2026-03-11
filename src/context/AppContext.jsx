import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState({
    isimSoyisim: '',
    programAdi: '',
    gozlukKullanimi: ''
  });

  const [results, setResults] = useState([]);

  const saveTaskResult = (taskResult) => {
    setResults(prev => [...prev, taskResult]);
  };

  const finalizeSession = () => {
    // Save to local storage for the dashboard to read
    const sessionData = {
      user: userInfo,
      results: results,
      date: new Date().toISOString()
    };
    
    const existingSessions = JSON.parse(localStorage.getItem('fraction-magazine-sessions') || '[]');
    existingSessions.push(sessionData);
    localStorage.setItem('fraction-magazine-sessions', JSON.stringify(existingSessions));
  };

  const value = {
    userInfo,
    setUserInfo,
    results,
    saveTaskResult,
    finalizeSession,
    setResults // For reset if needed
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
