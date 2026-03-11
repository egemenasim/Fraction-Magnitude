import React, { useState, useRef, useEffect } from 'react';

const NumberLine = ({ min = -1, max = 3, onSelectValue, disabled = false }) => {
    const containerRef = useRef(null);
    const [clickedValue, setClickedValue] = useState(null);
    const [clickedX, setClickedX] = useState(null);
    const [width, setWidth] = useState(0);

    // The ticks we want to show specifically
    const ticks = [-1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5, 3];

    const formatTickLabel = (val) => {
        if (val === -1) return "-1";
        if (val === -0.5) return "-1/2";
        if (val === 0) return "0";
        if (val === 0.5) return "1/2";
        if (val === 1) return "1";
        if (val === 1.5) return "3/2";
        if (val === 2) return "2";
        if (val === 2.5) return "5/2";
        if (val === 3) return "3";
        return val;
    };

    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                setWidth(containerRef.current.getBoundingClientRect().width);
            }
        };

        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    const handleClick = (e) => {
        if (disabled || width === 0) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;

        // clamp x to [0, width]
        const clampedX = Math.max(0, Math.min(x, width));

        // Map X to math value
        // x = 0 -> min
        // x = width -> max
        const percentage = clampedX / width;
        const value = min + percentage * (max - min);

        setClickedX(clampedX);
        setClickedValue(value);

        if (onSelectValue) {
            onSelectValue(value);
        }
    };

    const getXForValue = (val) => {
        if (width === 0) return 0;
        const percentage = (val - min) / (max - min);
        return percentage * width;
    };

    return (
        <div
            className="number-line-container"
            ref={containerRef}
            style={{ cursor: disabled ? 'default' : 'crosshair' }}
            onClick={handleClick}
        >
            <svg width="100%" height="80" style={{ overflow: 'visible' }}>
                {/* Main Line connecting arrows */}
                <line
                    x1="-10"
                    y1="40"
                    x2={width + 10}
                    y2="40"
                    stroke="currentColor"
                    strokeWidth="3"
                />

                {/* Left Arrow */}
                <path
                    d="M -10 40 L -2 34 L -2 46 Z"
                    fill="currentColor"
                />

                {/* Right Arrow */}
                <path
                    d={`M ${width + 10} 40 L ${width + 2} 34 L ${width + 2} 46 Z`}
                    fill="currentColor"
                />

                {/* Ticks and Labels */}
                {width > 0 && ticks.map((tickVal) => {
                    const xPos = getXForValue(tickVal);
                    return (
                        <g key={tickVal}>
                            <line
                                x1={xPos}
                                y1="32"
                                x2={xPos}
                                y2="48"
                                stroke="currentColor"
                                strokeWidth="2"
                            />
                            <text
                                x={xPos}
                                y="65"
                                textAnchor="middle"
                                fill="currentColor"
                                fontSize="14"
                                fontWeight="500"
                            >
                                {formatTickLabel(tickVal)}
                            </text>
                        </g>
                    );
                })}

                {/* User's Selection Dot */}
                {clickedX !== null && (
                    <circle
                        cx={clickedX}
                        cy="40"
                        r="8"
                        fill="#EF4444"
                        className="fade-in"
                        style={{ filter: 'drop-shadow(0 0 6px rgba(239, 68, 68, 0.5))' }}
                    />
                )}
            </svg>
        </div>
    );
};

export default NumberLine;
