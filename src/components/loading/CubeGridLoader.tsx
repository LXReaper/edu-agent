import React from 'react';
import './CubeGridLoader.css';

interface CubeGridLoaderProps {
    dotBackgroundColor?: string;
    isOpen?: boolean;
    maskWidth?: string | number; // 遮罩宽度
    maskHeight?: string | number; // 遮罩高度
    maskColor?: string; // 遮罩背景色
}

export const CubeGridLoader: React.FC<CubeGridLoaderProps> = ({
    dotBackgroundColor = '#fff',
    isOpen = false,
    maskWidth = '100%',
    maskHeight = '100%',
    maskColor = 'rgba(0, 0, 0, 0.5)', // 默认半透明黑色遮罩
}) => {
    return (
        <div
            className="loader-grid-mask"
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
        >
            <div
                className="sk-cube-grid"
                style={{
                    '--dot-background-color': dotBackgroundColor,
                    'display': `${isOpen ? 'block' : 'none'}`
                } as React.CSSProperties}
            >
                <div className="sk-cube sk-cube1"></div>
                <div className="sk-cube sk-cube2"></div>
                <div className="sk-cube sk-cube3"></div>
                <div className="sk-cube sk-cube4"></div>
                <div className="sk-cube sk-cube5"></div>
                <div className="sk-cube sk-cube6"></div>
                <div className="sk-cube sk-cube7"></div>
                <div className="sk-cube sk-cube8"></div>
                <div className="sk-cube sk-cube9"></div>
            </div>
        </div>
    );
};
