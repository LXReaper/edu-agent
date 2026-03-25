import React, { useState, useEffect } from 'react';

interface LoadingProgressBarProps {
    width: string;
    height: string;
}

export const LoadingProgressBar: React.FC<LoadingProgressBarProps> = ({width, height}) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prevProgress) => {
                if (prevProgress >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prevProgress + 10;
            });
        }, 500);

        return () => clearInterval(interval);
    }, []);

    const styles = {
        container: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        progressBar: {
            width: width,
            height: height,
            backgroundColor: '#e0e0e0',
            borderRadius: '10px',
            overflow: 'hidden',
        },
        progress: {
            height: '100%',
            backgroundColor: '#6C5CE7',
            transition: 'width 0.5s ease', // 平滑过渡效果
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.progressBar}>
                <div style={{ ...styles.progress, width: `${progress}%` }}></div>
            </div>
        </div>
    );
};
