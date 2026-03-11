import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function Welcome() {
    const navigate = useNavigate();
    const { userInfo, setUserInfo } = useAppContext();

    const [localInfo, setLocalInfo] = useState({
        isimSoyisim: userInfo.isimSoyisim || '',
        programAdi: userInfo.programAdi || '',
        gozlukKullanimi: userInfo.gozlukKullanimi || ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!localInfo.isimSoyisim || !localInfo.programAdi || !localInfo.gozlukKullanimi) return;

        setUserInfo(localInfo);
        navigate('/gorev');
    };

    return (
        <div className="page-container">
            <div className="glass-panel">
                <h1 style={{ textAlign: 'center' }}>Hoş Geldiniz</h1>
                <p className="subtitle" style={{ textAlign: 'center' }}>
                    Lütfen devam etmeden önce aşağıdaki bilgileri doldurun.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>İsim Soyisim</label>
                        <input
                            type="text"
                            placeholder="Adınızı ve soyadınızı girin"
                            value={localInfo.isimSoyisim}
                            onChange={(e) => setLocalInfo({ ...localInfo, isimSoyisim: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Program Adı</label>
                        <select
                            value={localInfo.programAdi}
                            onChange={(e) => setLocalInfo({ ...localInfo, programAdi: e.target.value })}
                            required
                        >
                            <option value="" disabled>Seçiniz...</option>
                            <option value="İlköğretim Matematik Öğretmenliği">İlköğretim Matematik Öğretmenliği</option>
                            <option value="Sınıf Öğretmenliği">Sınıf Öğretmenliği</option>
                        </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                        <label>Gözlük Kullanımı</label>
                        <div className="radio-group">
                            <label className="radio-card">
                                <input
                                    type="radio"
                                    name="glasses"
                                    value="Evet"
                                    checked={localInfo.gozlukKullanimi === 'Evet'}
                                    onChange={(e) => setLocalInfo({ ...localInfo, gozlukKullanimi: e.target.value })}
                                    required
                                />
                                <span>Evet</span>
                            </label>

                            <label className="radio-card">
                                <input
                                    type="radio"
                                    name="glasses"
                                    value="Hayır"
                                    checked={localInfo.gozlukKullanimi === 'Hayır'}
                                    onChange={(e) => setLocalInfo({ ...localInfo, gozlukKullanimi: e.target.value })}
                                    required
                                />
                                <span>Hayır</span>
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn"
                        disabled={!localInfo.isimSoyisim || !localInfo.programAdi || !localInfo.gozlukKullanimi}
                    >
                        Sistemi Başlat
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </button>
                </form>
            </div>
        </div>
    );
}
