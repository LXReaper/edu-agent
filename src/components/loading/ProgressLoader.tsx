import React, { useState, useEffect } from 'react';

interface ProgressLoaderProps {
    isOpen: boolean;
    maskWidth?: string | number; // 遮罩宽度
    maskHeight?: string | number; // 遮罩高度
    maskColor?: string;
    totalSteps?: number;
    currentStep?: number;
    loadingText?: string;
    completeText?: string;
}

export const ProgressLoader: React.FC<ProgressLoaderProps> = ({
    isOpen,
    maskWidth = '100%',
    maskHeight = '100%',
    maskColor = 'rgba(0, 0, 0, 0.5)', // 默认半透明黑色遮罩
    totalSteps = 10,
    currentStep = 0,
    loadingText = "Loading resources",
    completeText = "Complete!"
}) => {
    const [progress, setProgress] = useState(0);
    const [displayText, setDisplayText] = useState("");

    useEffect(() => {
        if (isOpen) {
            setProgress(0); // 每次打开时重置进度
            setDisplayText(""); // 重置文本
        }
    }, [isOpen]);

    useEffect(() => {
        setProgress(Math.min(Math.floor(currentStep / totalSteps * 100), 100));
    }, [currentStep, totalSteps]);

    // 文字逐字显示效果
    useEffect(() => {
        let currentIndex = 0;
        const targetText = !isOpen ? completeText : loadingText;
        const interval = setInterval(() => {
            if (currentIndex <= targetText.length) {
                setDisplayText(targetText.slice(0, currentIndex));
                currentIndex++;
            } else {
                clearInterval(interval);
            }
        }, 50);
        return () => clearInterval(interval);
    }, [progress, loadingText, completeText]);

    // 粒子生成（进度越高粒子越少）
    // const particleCount = Math.max(3, 15 - Math.floor(progress / 10));
    const particleCount = 5;
    const particles = Array(particleCount).fill(0).map((_, i) => ({
        id: i,
        size: `${Math.random() * 4 + 2}px`,
        color: `hsl(${200 + progress * 1.5}, 80%, 60%)`,
        delay: `${i * 0.1}s`,
        x: `${Math.random() * 40 - 20}px`,
        y: `${Math.random() * 40 - 20}px`
    }));

    return (
        <div
            style={{
                display: isOpen ? 'flex' : 'none',
                maxWidth: maskWidth,
                minWidth: maskWidth,
                width: maskWidth,
                maxHeight: maskHeight,
                minHeight: maskHeight,
                height: maskHeight,
                backgroundColor: maskColor,
            }}
            className="loader-grid-mask rounded-[20px] w-full max-w-md p-8 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200">
            {/* 粒子背景 */}
            <div className="absolute inset-0 overflow-hidden rounded-xl">
                {particles.map((p) => (
                    <div
                        key={p.id}
                        className="absolute rounded-full opacity-60"
                        style={{
                            width: p.size,
                            height: p.size,
                            backgroundColor: p.color,
                            animation: `particle-float 2s ease-in-out infinite alternate`,
                            animationDelay: p.delay,
                            left: `${50 + Math.random() * 10 - 5}%`,
                            top: `${30 + Math.random() * 40}%`,
                        }}
                    />
                ))}
            </div>

            {/* 进度显示 */}
            <div
                className="relative z-10 space-y-6
                min-w-[80%] max-w-[80%] w-[80%]"
            >
                {/* 数字进度 */}
                <div className="flex justify-between items-end">
                    <span className="text-5xl font-bold text-blue-600">
                        {Math.min(100, Math.floor(progress))}%
                    </span>
                    <span className="text-gray-500">
                        {currentStep}/{totalSteps} steps
                    </span>
                </div>

                {/* 图形化进度条 */}
                <div
                    className="
                        relative min-w-[100%] max-w-[100%] w-[100%]
                        h-4 bg-gray-200 rounded-full overflow-hidden"
                >
                    <div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    >
                        <div className="absolute right-0 top-1/2 w-3 h-3 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    </div>
                </div>

                {/* 动态文字 */}
                <div className="min-h-6">
                    <p className="text-lg font-medium text-blue-600">
                        {displayText}
                        <span className="ml-1 inline-block w-1 h-6 bg-blue-500 align-middle animate-pulse"></span>
                    </p>
                </div>

                {/* 完成图标（进度100%时显示） */}
                {progress >= 100 && (
                    <div className="flex justify-center">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                )}
            </div>

            {/* 动画样式 */}
            <style>{`
                @keyframes particle-float {
                  0%, 100% { transform: translate(0, 0) scale(1); }
                  50% { transform: translate(var(--x), var(--y)) scale(1.3); }
                }
            `}</style>
        </div>
    );
};
