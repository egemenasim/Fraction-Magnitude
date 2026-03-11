import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Dashboard() {
    const navigate = useNavigate();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(false);

    // Authentication state
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [error, setError] = useState('');

    const fetchSessions = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('sessions')
            .select('*')
            .order('olusturma_tarihi', { ascending: false });

        if (!error && data) {
            setSessions(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchSessions();
        }
    }, [isAuthenticated]);

    const handleLogin = (e) => {
        e.preventDefault();
        if (passwordInput === 'yavuzberkegemen') {
            setIsAuthenticated(true);
            setError('');
        } else {
            setError('Hatalı şifre.');
        }
    };

    const handleClear = async () => {
        if (window.confirm("Bütün verileri silmek istediğinize emin misiniz?")) {
            await supabase.from('sessions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
            setSessions([]);
        }
    };

    const exportCSV = () => {
        if (sessions.length === 0) return;

        const headers = [
            "İsim Soyisim", "Departman", "Gözlük Kullanımı",
            "Görev 1 Cevap", "Görev 1 Süre (ms)",
            "Görev 2 Cevap", "Görev 2 Süre (ms)",
            "Görev 3 Cevap", "Görev 3 Süre (ms)",
            "Görev 4 Cevap", "Görev 4 Süre (ms)",
            "Tarih"
        ];

        // Use semicolon delimiter + BOM for Turkish Excel
        let csvContent = "data:text/csv;charset=utf-8,\uFEFF" + headers.join(";") + "\n";

        sessions.forEach(session => {
            const row = [
                `"${session.isim_soyisim}"`,
                `"${session.program_adi}"`,
                `"${session.gozluk_kullanimi}"`,
                session.g1_cevap?.toFixed(4) || "",
                session.g1_sure?.toFixed(2) || "",
                session.g2_cevap?.toFixed(4) || "",
                session.g2_sure?.toFixed(2) || "",
                session.g3_cevap?.toFixed(4) || "",
                session.g3_sure?.toFixed(2) || "",
                session.g4_cevap?.toFixed(4) || "",
                session.g4_sure?.toFixed(2) || "",
                `"${new Date(session.olusturma_tarihi).toLocaleString()}"`
            ];

            csvContent += row.join(";") + "\n";
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "fraction-magnitude-results.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // If not authenticated, render the login form
    if (!isAuthenticated) {
        return (
            <div className="page-container">
                <div className="glass-panel" style={{ maxWidth: '400px', textAlign: 'center' }}>
                    <h2>Yönetici Girişi</h2>
                    <p className="subtitle" style={{ marginBottom: '1.5rem' }}>Tabloyu görüntülemek için şifre girin.</p>

                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <input
                                type="password"
                                placeholder="Şifre"
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                autoFocus
                            />
                            {error && <p style={{ color: 'var(--primary)', fontSize: '0.85rem', marginTop: '0.5rem', textAlign: 'left' }}>{error}</p>}
                        </div>
                        <button type="submit" className="btn">Giriş Yap</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem' }}>
            <div className="glass-panel" style={{ maxWidth: '1400px', padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2>Katılımcı Verileri Tablosu</h2>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn" onClick={() => navigate('/')} style={{ margin: 0, padding: '0.5rem 1rem' }}>
                            Ana Sayfa
                        </button>
                        <button className="btn" onClick={exportCSV} style={{ margin: 0, padding: '0.5rem 1rem', background: '#3b82f6', color: 'white' }}>
                            CSV İndir
                        </button>
                        <button className="btn" onClick={handleClear} style={{ margin: 0, padding: '0.5rem 1rem', background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)' }}>
                            Verileri Sil
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="empty-state"><p>Yükleniyor...</p></div>
                ) : sessions.length === 0 ? (
                    <div className="empty-state">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem', opacity: 0.5 }}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                        <h3>Henüz Veri Yok</h3>
                        <p style={{ marginTop: '0.5rem' }}>Katılımcılar testleri tamamladıkça veriler burada listelenecektir.</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>İsim Soyisim</th>
                                    <th>Departman</th>
                                    <th>Gözlük</th>
                                    <th>G1 Cevap</th>
                                    <th>G1 Süre (ms)</th>
                                    <th>G2 Cevap</th>
                                    <th>G2 Süre (ms)</th>
                                    <th>G3 Cevap</th>
                                    <th>G3 Süre (ms)</th>
                                    <th>G4 Cevap</th>
                                    <th>G4 Süre (ms)</th>
                                    <th>Tarih</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sessions.map((session) => (
                                    <tr key={session.id}>
                                        <td>{session.isim_soyisim}</td>
                                        <td>{session.program_adi}</td>
                                        <td>{session.gozluk_kullanimi}</td>
                                        <td>{session.g1_cevap?.toFixed(4)}</td>
                                        <td style={{ fontWeight: 'bold' }}>{session.g1_sure?.toFixed(2)}</td>
                                        <td>{session.g2_cevap?.toFixed(4)}</td>
                                        <td style={{ fontWeight: 'bold' }}>{session.g2_sure?.toFixed(2)}</td>
                                        <td>{session.g3_cevap?.toFixed(4)}</td>
                                        <td style={{ fontWeight: 'bold' }}>{session.g3_sure?.toFixed(2)}</td>
                                        <td>{session.g4_cevap?.toFixed(4)}</td>
                                        <td style={{ fontWeight: 'bold' }}>{session.g4_sure?.toFixed(2)}</td>
                                        <td>{new Date(session.olusturma_tarihi).toLocaleString('tr-TR')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
