import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import NumberLine from '../components/NumberLine';

// Define the steps.
const STEPS = [
    { type: 'transition', title: 'Alıştırma Görevi', description: 'Bu bir deneme görevi. Süre veya puanlamaya dahil edilmeyecek.' },
    { type: 'task', id: 'practice', imgSrc: '/practice.png', opText: '1/2 + 3/5', isPractice: true },
    { type: 'transition', title: 'Görev 1', description: 'Şimdi asıl görev başlıyor. Süre ölçümü aktiftir.' },
    { type: 'task', id: 'task1', imgSrc: '/task1.png', opText: '19/35 + 41/66' },
    { type: 'transition', title: 'Görev 2', description: 'Sıradaki göreve geçiyorsunuz.' },
    { type: 'task', id: 'task2', imgSrc: '/task2.png', opText: '19/35 - 41/66' },
    { type: 'transition', title: 'Görev 3', description: 'Sıradaki göreve geçiyorsunuz.' },
    { type: 'task', id: 'task3', imgSrc: '/task3.png', opText: '19/35 x 41/66' },
    { type: 'transition', title: 'Görev 4', description: 'Son göreve geçiyorsunuz.' },
    { type: 'task', id: 'task4', imgSrc: '/task4.png', opText: '41/66 / 19/35' },
    { type: 'complete' }
];


export default function TaskFlow() {
    const navigate = useNavigate();
    const { userInfo, saveTaskResult, finalizeSession } = useAppContext();

    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [startTime, setStartTime] = useState(null);
    const [currentValue, setCurrentValue] = useState(null);

    const step = STEPS[currentStepIndex];

    // Redirect to welcome if no user info exists
    useEffect(() => {
        if (!userInfo.isimSoyisim) {
            navigate('/');
        }
    }, [userInfo, navigate]);

    // Restart timer when a task step mounts
    useEffect(() => {
        if (step && step.type === 'task') {
            setStartTime(performance.now());
            setCurrentValue(null);
        }
    }, [currentStepIndex, step]);

    if (!step) return null;

    const [localResults, setLocalResults] = useState([]);

    const handleNextTransition = () => {
        setCurrentStepIndex(i => i + 1);
    };

    const handleNextTask = () => {
        if (currentValue === null) return;

        let updatedResults = localResults;
        if (!step.isPractice) {
            const endTime = performance.now();
            const timeMs = endTime - startTime;
            const newResult = {
                taskId: step.id,
                operation: step.opText,
                answer: currentValue,
                timeMs: timeMs
            };
            updatedResults = [...localResults, newResult];
            setLocalResults(updatedResults);
            saveTaskResult(newResult);
        }

        setCurrentStepIndex(i => i + 1);
    };

    const handleFinish = async () => {
        await finalizeSession(localResults);
        navigate('/');
    };

    // --- Render logic based on step type ---

    if (step.type === 'transition') {
        return (
            <div className="page-container">
                <div className="glass-panel" style={{ textAlign: 'center' }}>
                    <h1>{step.title}</h1>
                    {step.description && <p className="subtitle">{step.description}</p>}
                    <div className="action-row" style={{ justifyContent: 'center' }}>
                        <button className="btn" onClick={handleNextTransition}>
                            Devam Et
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (step.type === 'complete') {
        return (
            <div className="page-container">
                <div className="glass-panel" style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '80px', height: '80px',
                        background: 'var(--primary)',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 2rem'
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <h1>Tamamlandı</h1>
                    <p className="subtitle">Tüm görevleri başarıyla bitirdiniz, teşekkür ederiz.</p>
                    <div className="action-row" style={{ justifyContent: 'center' }}>
                        <button className="btn" onClick={handleFinish}>
                            Ana Sayfaya Dön
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // task step
    return (
        <div className="page-container">
            <div className="glass-panel glass-panel-large">
                <div className="task-header">
                    {step.isPractice && <h2>GÖREV DEMOSU</h2>}
                    <div className="task-operation">
                        <img
                            src={step.imgSrc}
                            alt={step.opText}
                            style={{ maxHeight: '200px', maxWidth: '100%', objectFit: 'contain' }}
                        />
                    </div>
                </div>

                <NumberLine
                    min={-1}
                    max={3}
                    onSelectValue={val => setCurrentValue(val)}
                />

                <div className="action-row">
                    <button
                        className="btn"
                        disabled={currentValue === null}
                        onClick={handleNextTask}
                    >
                        İlerle
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
