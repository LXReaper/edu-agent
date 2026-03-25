// UIProvider.tsx
import React, {createContext, useState, useCallback, ReactNode} from 'react';
import {Ripple, Notification} from "../type";
import {LoadingAnimation} from "../components/loading/LoadingAnimation";

interface UIContextType {
    // 通知相关
    notifications: Notification[];
    showNotification: (message: string, type?: 'success' | 'error' | 'info' | 'warning', duration?: number) => void;
    hideNotification: (id: string) => void;

    // 水波纹相关
    ripples: Ripple[];
    createRipple: (event: React.MouseEvent<HTMLElement>, color?: string) => void;

    showLoadingNotification: (progress: number, loadingMessage?: string, successMsg?: string) => void;
}

const NotificationContext = createContext<UIContextType | undefined>(undefined);

let timeout: NodeJS.Timeout | null = null;
export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [ripples, setRipples] = useState<Ripple[]>([]);

    const [loadingProgress, setLoadingProgress] = useState<number | null>(0);
    const [loadingMessage, setLoadingMessage] = useState("");

    // 显示通知
    const showNotification = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration = 3000) => {
        const id = Date.now() + Math.random() + "";
        setNotifications(prev => [...prev, { id, message, type, duration }]);

        setTimeout(() => {
            hideNotification(id);
        }, duration);
    }, []);

    // 隐藏通知
    const hideNotification = useCallback((id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    // 创建水波纹
    const createRipple = useCallback((event: React.MouseEvent<HTMLElement>, color = 'rgba(0, 0, 0, 0.2)') => {
        const id = Date.now() + Math.random() + "";
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        setRipples(prev => [...prev, { id, x, y, color }]);

        setTimeout(() => {
            setRipples(prev => prev.filter(r => r.id !== id));
        }, 600);
    }, []);

    const showLoadingNotification = useCallback((progress: number, loadingMessage?: string, successMsg?: string) => {
        if (progress >= 100) {
            if (timeout) return;
            timeout = setTimeout(() => {// 关闭加载动画
                setLoadingProgress(0);
                showNotification(successMsg || "Success", "success");
                timeout = null;
            }, 1000);
            return ;
        }
        if (loadingMessage) setLoadingMessage(loadingMessage);
        setLoadingProgress(progress);
    }, []);

    return (
        <NotificationContext.Provider value={{
            notifications,
            showNotification,
            hideNotification,
            ripples,
            createRipple,
            // use load
            showLoadingNotification,
        }}>
            {children}
            {loadingProgress && <LoadingAnimation progress={loadingProgress} message={loadingMessage} />}
            {/* 通知容器 */}
            <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9999, display: 'flex', flexDirection: 'column-reverse', gap: 8 }}>
                {notifications.map(notification => (
                    <div
                        key={notification.id}
                        className={`px-4 py-2 rounded shadow-lg text-white transition-all duration-300 ease-in-out transform translate-y-0 opacity-100 ${
                            notification.type === 'success' ? 'bg-green-500' :
                                notification.type === 'error' ? 'bg-red-500' :
                                    notification.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`}
                    >
                        {notification.message}
                    </div>
                ))}
            </div>

            {/* 水波纹容器 */}
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden' }}>
                {ripples.map(ripple => (
                    <div
                        key={ripple.id}
                        className="ripple-animation"
                        style={{
                            position: 'absolute',
                            left: ripple.x,
                            top: ripple.y,
                            transform: 'translate(-50%, -50%)',
                            width: '0px',
                            height: '0px',
                            backgroundColor: ripple.color,
                            borderRadius: '50%',
                            opacity: 0.5,
                            animation: 'rippleEffect 0.6s ease-out'
                        }}
                    />
                ))}
            </div>

            {/* 水波纹动画样式 */}
            <style>
                {`
                    @keyframes rippleEffect {
                      0% { width: 0px; height: 0px; opacity: 0.5; }
                      100% { width: 200px; height: 200px; opacity: 0; }
                    }
                    .ripple-animation {
                      will-change: transform, width, height, opacity;
                    }
                `}
            </style>
        </NotificationContext.Provider>
    );
};

export const useNotificationMessage = () => {
    const context = React.useContext(NotificationContext);
    if (!context) {
        throw new Error('useUI must be used within a NotificationProvider');
    }
    return context;
};
