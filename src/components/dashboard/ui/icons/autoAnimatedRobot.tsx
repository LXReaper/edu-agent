import React, { useEffect, useRef, useCallback, useState } from "react";

interface AutoAnimatedRobotProps {
    chatBubbleTop?: string;
    chatBubbleLeft?: string;
    width?: string;
    height?: string;
    robotPhrases?: Array<string>;
}

// --- 动画常量 ---
const ANIMATION_DURATION_MIN = 1500; // 最小动作持续时间 (ms)
const ANIMATION_DURATION_MAX = 3500; // 最大动作持续时间 (ms)
const BLINK_DURATION = 300; // 眨眼动作的固定时长

// --- 聊天气泡常量 ---
const ROBOT_PHRASES = [
    "您好！我正在进行思考。",
    "今天天气真不错，对吗？",
    "我在自动执行各种动作。",
    "滴嘟滴嘟，一切正常。",
    "我听见您在说话，请继续。",
    "我是你的Agent助手。",
    "我在分析宇宙数据...",
    "需要我帮您做些什么？",
    "数据处理中...请稍候。",
    "能量水平：100%。"
];
const SPEECH_INTERVAL_MIN = 6000; // 6秒后开始下一次说话周期 (空闲时间)
const SPEECH_INTERVAL_MAX = 10000; // 10秒后开始下一次说话周期
const SPEECH_DURATION = 3000; // 说话气泡显示 3 秒

/**
 * 具有自动动画和聊天气泡的机器人组件。
 * 接受宽度和高度参数以控制整体尺寸。
 * @param chatBubbleTop 聊天气泡的top属性
 * @param chatBubbleLeft 聊天气泡的left属性
 * @param {number} width - 容器的宽度 (px). 默认为 250。
 * @param {number} height - 容器的高度 (px). 默认为 400。
 * @param robotPhrases 聊天气泡内容
 */
export const AutoAnimatedRobot: React.FC<AutoAnimatedRobotProps> = ({
    chatBubbleTop = '3vh',
    chatBubbleLeft = '0px',
    width = '150px',
    height = '420px',
    robotPhrases = ROBOT_PHRASES,
}) => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const currentAction = useRef("idle");
    const actionStartTime = useRef(0);
    const actionDuration = useRef(ANIMATION_DURATION_MAX); // 动作持续时间

    // 动画参数的 Ref
    const headOffset = useRef(0);
    const eyeOffset = useRef({ left: 0, right: 0, y: 0, size: 1 });
    const mouthScaleX = useRef(1);
    const antennaAngle = useRef(0);
    const armAngle = useRef({ left: 0, right: 0 });
    const bodyScaleY = useRef(1);

    // 聊天状态
    const [speechContent, setSpeechContent] = useState("");
    const [isSpeaking, setIsSpeaking] = useState(false);

    // 可用的动画动作
    const actions = [
        "idle", "lookLeft", "lookRight", "excited", "listening", "blink", "thinking",
        "surprise", "scratchHead", "happyNod"
    ];

    // 随机选择下一个动作
    const getRandomAction = (current) => {
        const available = actions.filter(a => a !== current);
        let newAction = available[Math.floor(Math.random() * available.length)];
        if (newAction === current) {
            // Re-select if we got the same action, prioritizing variety
            newAction = available[Math.floor(Math.random() * available.length)];
        }
        return newAction;
    };

    // 绘制机器人
    const drawRobot = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // 获取 Canvas 实际渲染尺寸
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        // 获取 Canvas 样式尺寸（由外部 props: width, height 控制）
        const styleWidth = canvas.style.width ? parseInt(canvas.style.width.replace('px', '')) : width;
        const styleHeight = canvas.style.height ? parseInt(canvas.style.height.replace('px', '')) : height;

        // 缩放因子：Canvas 渲染尺寸 / Canvas 样式尺寸
        const scale = canvasWidth / styleWidth;

        const centerX = canvasWidth / 2;
        // 机器人尺寸基于容器较小边 80% (已乘以 scale 因子)
        const baseSize = Math.min(styleWidth, styleHeight) * 0.8 * scale;

        // Clear canvas
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        ctx.save();

        // 应用整体平移和头部偏移
        ctx.translate(centerX, canvasHeight * 0.5 + headOffset.current * scale);

        // 设置样式
        ctx.strokeStyle = "rgb(55, 65, 81)"; // 深灰色轮廓
        ctx.lineWidth = 2 * scale; // 调整线宽
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        const primaryFillColor = "rgba(100, 100, 100, 0.2)"; // 浅透明填充
        const jointColor = "rgb(55, 65, 81)"; // 关节深色

        // --- 头部 (Head) ---
        const headWidth = baseSize * 0.8;
        const headHeight = baseSize * 0.7;
        const headRadius = 10 * scale;
        ctx.beginPath();
        ctx.roundRect(-headWidth / 2, -headHeight * 0.7, headWidth, headHeight, headRadius);
        ctx.fillStyle = primaryFillColor;
        ctx.fill();
        ctx.stroke();

        // --- 天线 (Antenna) ---
        ctx.save();
        ctx.translate(0, -headHeight * 0.7);
        ctx.rotate(antennaAngle.current * Math.PI / 180);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -baseSize * 0.2);
        ctx.lineTo(-baseSize * 0.1, -baseSize * 0.2);
        ctx.stroke();
        ctx.restore();

        // --- 眼睛 (Eyes) ---
        const eyeWidth = headWidth * 0.2 * eyeOffset.current.size;
        const eyeHeight = headHeight * 0.2 * eyeOffset.current.size;
        const eyeSpacing = headWidth * 0.2;
        const eyeY = -headHeight * 0.3 + eyeOffset.current.y * scale;
        const eyeRadius = 3 * scale;

        // Left Eye
        ctx.beginPath();
        ctx.roundRect(-eyeSpacing - eyeWidth / 2 + eyeOffset.current.left * scale, eyeY - eyeHeight / 2, eyeWidth, eyeHeight, eyeRadius);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.stroke();

        // Right Eye
        ctx.beginPath();
        ctx.roundRect(eyeSpacing - eyeWidth / 2 + eyeOffset.current.right * scale, eyeY - eyeHeight / 2, eyeWidth, eyeHeight, eyeRadius);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = primaryFillColor; // 恢复身体填充颜色

        // --- 嘴巴 (Mouth) ---
        const mouthWidth = headWidth * 0.4 * mouthScaleX.current;
        const mouthHeight = headHeight * 0.1;
        const mouthY = headHeight * 0.1;
        ctx.beginPath();
        ctx.roundRect(-mouthWidth / 2, mouthY - mouthHeight / 2, mouthWidth, mouthHeight, 3 * scale);
        ctx.stroke();

        // --- 身体 (Body) ---
        const headBodyOverlap = headHeight * 0.55;
        ctx.translate(0, headBodyOverlap);

        ctx.scale(1, bodyScaleY.current);
        const bodyWidth = baseSize * 1.0;
        const bodyHeight = baseSize * 1.2;
        const bodyRadius = 15 * scale;

        ctx.beginPath();
        ctx.roundRect(-bodyWidth / 2, 0, bodyWidth, bodyHeight, bodyRadius);
        ctx.fill();
        ctx.stroke();

        // --- 手臂 (Arms) ---
        const armLength = baseSize * 0.65;
        const armThickness = baseSize * 0.15;
        const armRadius = 5 * scale;
        const shoulderY = bodyHeight * 0.1;
        const shoulderOffsetX = bodyWidth / 2 - armThickness * 0.3;
        const jointRadius = armThickness * 0.5;
        const armStartOffset = jointRadius * 0.3;

        // Left Arm
        ctx.save();
        ctx.translate(-shoulderOffsetX, shoulderY);
        ctx.rotate(armAngle.current.left * Math.PI / 180);
        ctx.beginPath();
        ctx.arc(0, 0, jointRadius * 1.1, 0, 2 * Math.PI);
        ctx.fillStyle = jointColor;
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.roundRect(-armThickness / 2, armStartOffset, armThickness, armLength - armStartOffset, armRadius);
        ctx.fillStyle = primaryFillColor;
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Right Arm
        ctx.save();
        ctx.translate(shoulderOffsetX, shoulderY);
        ctx.rotate(armAngle.current.right * Math.PI / 180);
        ctx.beginPath();
        ctx.arc(0, 0, jointRadius * 1.1, 0, 2 * Math.PI);
        ctx.fillStyle = jointColor;
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.roundRect(-armThickness / 2, armStartOffset, armThickness, armLength - armStartOffset, armRadius);
        ctx.fillStyle = primaryFillColor;
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // --- 腿部 (Legs - Simplified) ---
        const legWidth = baseSize * 0.3;
        const legHeight = baseSize * 0.4;
        const legSpacing = bodyWidth * 0.2;
        const legY = bodyHeight;

        // Left Leg
        ctx.beginPath();
        ctx.moveTo(-legSpacing, legY);
        ctx.lineTo(-legSpacing, legY + legHeight * 0.5);
        ctx.stroke();
        ctx.beginPath();
        ctx.roundRect(-legSpacing - legWidth / 2, legY + legHeight * 0.5, legWidth, legHeight * 0.5, 5 * scale);
        ctx.fill();
        ctx.stroke();

        // Right Leg
        ctx.beginPath();
        ctx.moveTo(legSpacing, legY);
        ctx.lineTo(legSpacing, legY + legHeight * 0.5);
        ctx.stroke();
        ctx.beginPath();
        ctx.roundRect(legSpacing - legWidth / 2, legY + legHeight * 0.5, legWidth, legHeight * 0.5, 5 * scale);
        ctx.fill();
        ctx.stroke();

        ctx.restore(); // Restore context after all drawing
    }, [
        headOffset.current, eyeOffset.current, mouthScaleX.current, antennaAngle.current, armAngle.current, bodyScaleY.current, width, height // 添加依赖
    ]);

    // 更新动画状态
    const updateAnimation = (timestamp) => {

        if (!actionStartTime.current) {
            actionStartTime.current = timestamp;
            actionDuration.current = Math.random() * (ANIMATION_DURATION_MAX - ANIMATION_DURATION_MIN) + ANIMATION_DURATION_MIN;
        }

        const elapsed = timestamp - actionStartTime.current;
        let progress = elapsed / actionDuration.current;

        if (progress >= 1) {
            currentAction.current = getRandomAction(currentAction.current);
            actionStartTime.current = timestamp;
            actionDuration.current = Math.random() * (ANIMATION_DURATION_MAX - ANIMATION_DURATION_MIN) + ANIMATION_DURATION_MIN;
            progress = 0;
        }

        // 重置所有参数 (在动作切换时)
        if (progress < 0.05 && currentAction.current !== 'blink') {
            headOffset.current = 0;
            eyeOffset.current = { left: 0, right: 0, y: 0, size: 1 };
            mouthScaleX.current = 1;
            antennaAngle.current = 0;
            armAngle.current = { left: 0, right: 0 };
            bodyScaleY.current = 1;
        }

        // Blink 动作的进度需要单独计算
        if (currentAction.current === 'blink') {
            const blinkProgress = (elapsed % actionDuration.current) / actionDuration.current;
            if (blinkProgress > 0.3 && blinkProgress < 0.4) {
                eyeOffset.current.size = 0.1;
            } else {
                eyeOffset.current.size = 1;
            }
            if (elapsed % actionDuration.current > BLINK_DURATION) {
                // Blink completed, switch action
                currentAction.current = getRandomAction('blink');
                actionStartTime.current = performance.now();
                actionDuration.current = Math.random() * (ANIMATION_DURATION_MAX - ANIMATION_DURATION_MIN) + ANIMATION_DURATION_MIN;
            }
        } else {
            eyeOffset.current.size = 1; // 确保非眨眼状态下眼睛正常
        }

        // 修复：重新计算 progress 以确保动画平滑过渡
        if (currentAction.current !== 'blink') {
            progress = elapsed / actionDuration.current;
        }

        const easedProgress = Math.sin(progress * Math.PI); // 通用平滑进度

        // 如果机器人正在说话，则保持 listening 动作直到说话周期结束
        if (isSpeaking) {
            currentAction.current = "listening";
        }

        switch (currentAction.current) {
            case "lookLeft":
                eyeOffset.current.left = -5 * easedProgress;
                eyeOffset.current.right = -5 * easedProgress;
                break;
            case "lookRight":
                eyeOffset.current.left = 5 * easedProgress;
                eyeOffset.current.right = 5 * easedProgress;
                break;
            case "listening":
                const listenFreq = 4 * Math.PI;
                // 轻微的头部倾斜和眼睛活动
                headOffset.current = 2 * Math.sin(progress * listenFreq);
                bodyScaleY.current = 1 - 0.03 * Math.sin(progress * listenFreq);
                eyeOffset.current.y = -2 * Math.sin(progress * listenFreq);
                mouthScaleX.current = 1 - 0.2 * Math.sin(progress * listenFreq);
                break;
            case "excited":
                const exciteFreq = 10 * Math.PI;
                headOffset.current = -5 * Math.sin(progress * exciteFreq);
                eyeOffset.current.size = 1 + 0.2 * Math.sin(progress * exciteFreq);
                antennaAngle.current = 20 * Math.sin(progress * exciteFreq * 1.2);
                armAngle.current.left = 20 * Math.sin(progress * exciteFreq);
                armAngle.current.right = -20 * Math.sin(progress * exciteFreq);
                break;
            case "thinking":
                const thinkFreq = 2 * Math.PI;
                headOffset.current = 3 * Math.sin(progress * thinkFreq);
                eyeOffset.current.left = -2 * Math.sin(progress * 4 * Math.PI);
                eyeOffset.current.right = 2 * Math.sin(progress * 4 * Math.PI);
                mouthScaleX.current = 0.8;
                // 让左臂抬起靠向头部 (思考姿势)
                armAngle.current.left = 40 * easedProgress;
                break;
            case "blink":
                // 眨眼逻辑已移到前面，这里仅为防止重置
                break;
            case "surprise":
                const surpriseDuration = actionDuration.current * 0.2;
                if (elapsed < surpriseDuration) {
                    const setupProgress = elapsed / surpriseDuration;
                    const setupEased = Math.sin(setupProgress * Math.PI / 2); // 快速进入
                    headOffset.current = -15 * setupEased;
                    eyeOffset.current.size = 1 + 0.5 * setupEased;
                    mouthScaleX.current = 1.5 * setupEased;
                    armAngle.current.left = -30 * setupEased;
                    armAngle.current.right = 30 * setupEased;
                } else {
                    // 保持惊讶状态，添加轻微晃动
                    headOffset.current = -15 + 2 * Math.sin(timestamp / 150 * Math.PI);
                    eyeOffset.current.size = 1.5;
                    mouthScaleX.current = 1.5;
                    armAngle.current.left = -30;
                    armAngle.current.right = 30;
                }
                break;
            case "scratchHead":
                const scratchFreq = 2 * Math.PI;
                headOffset.current = 5 * Math.sin(progress * scratchFreq);
                // 左臂抬起，并向内弯曲一点 (模拟挠头)
                armAngle.current.left = 80 * easedProgress - 10;
                eyeOffset.current.left = 5 * easedProgress;
                eyeOffset.current.right = -5 * easedProgress;
                mouthScaleX.current = 1 - 0.3 * easedProgress;
                break;
            case "happyNod":
                const nodFreq = 6 * Math.PI;
                headOffset.current = 10 * Math.cos(progress * nodFreq + Math.PI);
                bodyScaleY.current = 1 + 0.05 * Math.sin(progress * nodFreq);
                mouthScaleX.current = 1 + 0.5 * Math.sin(progress * nodFreq);
                armAngle.current.left = 10 * Math.sin(progress * nodFreq);
                armAngle.current.right = -10 * Math.sin(progress * nodFreq);
                break;
            default: // idle - 呼吸动画
                const idleFreq = 2 * Math.PI;
                headOffset.current = 1 * Math.sin(timestamp / 500 * idleFreq);
                bodyScaleY.current = 1 - 0.01 * Math.sin(timestamp / 500 * idleFreq);
                break;
        }

        if (canvasRef.current) {
            drawRobot();
        }

        animationRef.current = requestAnimationFrame(updateAnimation);
    };

    // 初始化 Canvas 尺寸并启动动画
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        actionDuration.current = Math.random() * (ANIMATION_DURATION_MAX - ANIMATION_DURATION_MIN) + ANIMATION_DURATION_MIN;

        // 使用 ResizeObserver 确保 Canvas 尺寸响应式，并处理高 DPI 渲染
        const observer = new ResizeObserver(() => {
            const container = canvas.parentElement;
            if (container) {
                const rect = container.getBoundingClientRect();
                // 确保 Canvas 渲染分辨率更高，防止缩放模糊
                const dpiScale = 2; // 使用 2x DPI
                canvas.width = rect.width * dpiScale;
                canvas.height = rect.height * dpiScale;
                canvas.style.width = rect.width + 'px';
                canvas.style.height = rect.height + 'px';
                drawRobot();
            }
        });

        if (canvas.parentElement) {
            observer.observe(canvas.parentElement);
        }

        animationRef.current = requestAnimationFrame(updateAnimation);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            if (canvas.parentElement) {
                observer.unobserve(canvas.parentElement);
            }
        };
    }, [drawRobot]);

    // 聊天气泡周期管理
    useEffect(() => {
        let intervalId = null;
        let timeoutId = null;

        const startSpeakingCycle = () => {
            // 1. 随机选择一个动作
            const randomIndex = Math.floor(Math.random() * robotPhrases.length);
            const phrase = robotPhrases[randomIndex];

            // 2. 设置内容并显示气泡
            setSpeechContent(phrase);
            setIsSpeaking(true);
            // 说话时让机器人表现为“聆听/注意”状态，覆盖当前动画
            currentAction.current = "listening";
            actionStartTime.current = performance.now();

            // 3. 设定超时，在 SPEECH_DURATION 后隐藏气泡
            timeoutId = window.setTimeout(() => {
                setIsSpeaking(false);
                setSpeechContent("");
                currentAction.current = "idle"; // 隐藏后切换回空闲状态
                actionStartTime.current = performance.now();

                // 4. 设置下一个说话周期，随机等待一段时间
                const nextInterval = Math.random() * (SPEECH_INTERVAL_MAX - SPEECH_INTERVAL_MIN) + SPEECH_INTERVAL_MIN;
                intervalId = window.setTimeout(startSpeakingCycle, nextInterval);
            }, SPEECH_DURATION);
        };

        // 首次启动周期
        intervalId = window.setTimeout(startSpeakingCycle, SPEECH_INTERVAL_MIN);

        // 清理函数
        return () => {
            if (intervalId !== null) clearTimeout(intervalId);
            if (timeoutId !== null) clearTimeout(timeoutId);
        };
    }, []); // 仅在挂载时运行一次

    // 使用 props 控制外部容器的尺寸
    return (
        <div
            className="relative flex flex-col items-center justify-center p-3 rounded-xl"
            style={{ width: width, height: height, minWidth: '150px', minHeight: '200px' }}
        >
            {/* --- 聊天气泡 --- */}
            {isSpeaking && (
                <div className={`absolute top-[${chatBubbleTop}] left-[${chatBubbleLeft}] p-3 bg-white border-2 border-gray-800 rounded-xl flex justify-center items-center
                    shadow-lg transition-opacity duration-300 z-10 max-w-xs sm:max-w-sm text-sm sm:text-base text-gray-800 font-sans animate-fadeIn`}>
                    <div className={`flex justify-center items-center`}>{speechContent}</div>
                    {/* 气泡尾部 - 外部边框 (指向下方中心) */}
                    <div className="absolute left-1/4 transform -translate-x-1/2 bottom-[-13px] w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-gray-800"></div>
                    {/* 气泡尾部 - 内部填充 (指向下方中心) */}
                    <div className="absolute left-1/4 transform -translate-x-1/2 bottom-[-10px] w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-white"></div>
                </div>
            )}

            {/* --- 机器人 --- */}
            <div className={`w-full h-full flex justify-center items-center p-2`}>
                <canvas
                    ref={canvasRef}
                    className={`w-[100%] h-[100%]`}
                    style={{
                        color: "rgb(55, 65, 81)", // Canvas 笔触颜色
                        display: 'block'
                    }}
                />
            </div>

            <style jsx global>{`
                /* 定义 CSS 动画 */
                @keyframes fadeIn {
                    from { opacity: 0; transform: translate(0, 10px); }
                    to { opacity: 1; transform: translate(0, 0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};
