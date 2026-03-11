import React, { createContext, useState, useContext } from 'react';
import { supabase } from '../supabaseClient';

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

  const finalizeSession = async (finalResults) => {
    // Use the finalResults passed directly to avoid stale state issues
    const allResults = finalResults || results;

    const g1 = allResults.find(r => r.taskId === 'task1') || {};
    const g2 = allResults.find(r => r.taskId === 'task2') || {};
    const g3 = allResults.find(r => r.taskId === 'task3') || {};
    const g4 = allResults.find(r => r.taskId === 'task4') || {};

    const record = {
      isim_soyisim: userInfo.isimSoyisim,
      program_adi: userInfo.programAdi,
      gozluk_kullanimi: userInfo.gozlukKullanimi,
      g1_cevap: g1.answer ?? null,
      g1_sure: g1.timeMs ?? null,
      g2_cevap: g2.answer ?? null,
      g2_sure: g2.timeMs ?? null,
      g3_cevap: g3.answer ?? null,
      g3_sure: g3.timeMs ?? null,
      g4_cevap: g4.answer ?? null,
      g4_sure: g4.timeMs ?? null,
    };

    const { error } = await supabase.from('sessions').insert([record]);

    if (error) {
      console.error('Supabase kayıt hatası:', error);
    }
  };

  const value = {
    userInfo,
    setUserInfo,
    results,
    saveTaskResult,
    finalizeSession,
    setResults
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
