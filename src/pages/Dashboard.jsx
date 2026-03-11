import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const navigate = useNavigate();
    const [sessions, setSessions] = useState([]);

    // Authentication state
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('fraction-magazine-sessions') || '[]');
        setSessions(data);
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        if (passwordInput === 'yavuzberkegemen') {
            setIsAuthenticated(true);
            setError('');
        } else {
            setError('Hatalı şifre.');
        }
    };

    const handleClear = () => {
        if (window.confirm("Bütün verileri silmek istediğinize emin misiniz?")) {
            localStorage.removeItem('fraction-magazine-sessions');
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

        // Use semicolon delimiter which is standard for Excel in Turkish localization
        let csvContent = "data:text/csv;charset=utf-8,\uFEFF" + headers.join(";") + "\n";

        sessions.forEach(session => {
            const g1 = session.results.find(r => r.taskId === 'task1') || {};
            const g2 = session.results.find(r => r.taskId === 'task2') || {};
            const g3 = session.results.find(r => r.taskId === 'task3') || {};
            const g4 = session.results.find(r => r.taskId === 'task4') || {};

            const row = [
                `"${session.user.isimSoyisim}"`,
                `"${session.user.programAdi}"`,
                `"${session.user.gozlukKullanimi}"`,
                g1.answer?.toFixed(4) || "", g1.timeMs?.toFixed(2) || "",
                g2.answer?.toFixed(4) || "", g2.timeMs?.toFixed(2) || "",
                g3.answer?.toFixed(4) || "", g3.timeMs?.toFixed(2) || "",
                g4.answer?.toFixed(4) || "", g4.timeMs?.toFixed(2) || "",
                `"${new Date(session.date).toLocaleString()}"`
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

                {sessions.length === 0 ? (
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
                                </tr>
                            </thead>
                            <tbody>
                                {sessions.map((session, index) => {
                                    const g1 = session.results.find(r => r.taskId === 'task1') || {};
                                    const g2 = session.results.find(r => r.taskId === 'task2') || {};
                                    const g3 = session.results.find(r => r.taskId === 'task3') || {};
                                    const g4 = session.results.find(r => r.taskId === 'task4') || {};

                                    return (
                                        <tr key={index}>
                                            <td>{session.user.isimSoyisim}</td>
                                            <td>{session.user.programAdi}</td>
                                            <td>{session.user.gozlukKullanimi}</td>
                                            <td>{g1.answer?.toFixed(4)}</td>
                                            <td style={{ color: '#000', fontWeight: 'bold' }}>{g1.timeMs?.toFixed(2)}</td>
                                            <td>{g2.answer?.toFixed(4)}</td>
                                            <td style={{ color: '#000', fontWeight: 'bold' }}>{g2.timeMs?.toFixed(2)}</td>
                                            <td>{g3.answer?.toFixed(4)}</td>
                                            <td style={{ color: '#000', fontWeight: 'bold' }}>{g3.timeMs?.toFixed(2)}</td>
                                            <td>{g4.answer?.toFixed(4)}</td>
                                            <td style={{ color: '#000', fontWeight: 'bold' }}>{g4.timeMs?.toFixed(2)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
