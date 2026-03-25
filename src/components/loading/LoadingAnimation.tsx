import React, {useEffect, useState} from 'react';

interface LoadingAnimationProps {
    progress: number;
    message?: string;
}

const anvilImg = "/images/anvil.png";
export const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ progress, message }) => {
    const [isVisible, setIsVisible] = React.useState(true);
    useEffect(() => {
        if (progress >= 100) {
            setTimeout(() => setIsVisible(false), 500);
        }
    }, [progress]);


    const [hammerPosition, setHammerPosition] = useState<'up' | 'down'>('up');
    useEffect(() => {
        const interval = setInterval(() => {
            setHammerPosition(prev => prev === 'up' ? 'down' : 'up');
        }, 1000);

        return () => clearInterval(interval);
    }, []);
    return (
        <>
            <div className="fixed bottom-0 left-0 right-0 flex items-end justify-end h-32 pointer-events-none">
                <div className="relative w-48 h-full mr-8 mb-4">
                    {/* 工作台 */}
                    <div className={`
                        absolute bottom-0 right-10 h-[100px] w-[200px]
                        bg-[url('${anvilImg}')] bg-cover bg-center 
                        px-2 py-[5%] rounded-[12px] flex justify-center
                        text-[#FF8A3D]
                    `}>
                        {message}{progress}%
                    </div>
                    {/* 锤子 */}
                    <div
                        className="absolute bottom-[125px] right-5"
                        style={{
                            transformOrigin: 'bottom right',
                            transform: `rotate(${hammerPosition === 'up' ? -90 : 0}deg)`,
                            transition: 'transform 0.5s cubic-bezier(0.5, 0, 0.2, 1)',
                            willChange: 'transform'
                        }}
                    >
                        {/* 锤头 */}
                        <div className="w-10 h-6 bg-gray-700 rounded absolute -top-6 -left-3.5"></div>
                        {/* 锤柄 */}
                        <div className="w-3 h-16 bg-amber-800 rounded-b-sm"></div>
                    </div>
                </div>
            </div>
        </>
    );
};
