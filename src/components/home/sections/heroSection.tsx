import "../ui/homeSection/heroSection.css"
import React from "react"
import {useCallback, useEffect, useRef, useState} from "react";
import {CssVariableNames} from "../../../lib";
import {HeroSectionTitle} from "../ui/homeSection/heroSectionTitle.tsx";
import {DoubleArrowDownBouncing} from "../ui/icons/doubleArrowDownBouncing.tsx";
import {ChatSection} from "./chatSection.tsx";

// --- 背景动画 ---
interface Particle {
    x: number;
    y: number;
    size: number;
    speed: number;
    color: string;
}

interface Node {
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
}

export const HeroSection = () => {
    const heroVideoPostUrl = import.meta.env.VITE_HERO_SECTION_VIDEO_POST_URL;
    const heroVideoUrl = import.meta.env.VITE_HERO_SECTION_VIDEO_URL;

    const [heroVideoBlob, setHeroVideoBlob] = useState<string | null>(heroVideoUrl);

    const firstSectionRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const loadVideo = async () => {
            if (!heroVideoUrl) return;

            try {
                const response = await fetch(heroVideoUrl);
                const blob = await response.blob();
                const blobUrl = URL.createObjectURL(blob);
                setHeroVideoBlob(blobUrl);
            } catch (error) {
                console.error('视频加载失败:', error);
            }
        };

        loadVideo();

        // 组件卸载时清理Blob URL
        return () => {
            if (heroVideoBlob) {
                URL.revokeObjectURL(heroVideoBlob);
            }
        };
    }, [heroVideoUrl]);

    // Memoize the drawing logic to prevent unnecessary re-creations
    const drawCanvasEffect = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width: number, height: number;

        const resizeCanvas = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        resizeCanvas();

        // --- Left-Side Particle Flow Setup (Cyan) ---
        const particles: Particle[] = [];
        const particleCount = 200;
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width * 0.4,
                y: Math.random() * height,
                size: Math.random() * 2 + 1,
                speed: Math.random() * 0.5 + 0.1,
                color: `rgba(16, 82, 212, ${Math.random() * 0.8 + 0.2})`, // cyan-500
            });
        }

        // --- Right-Side Data Network Setup (Violet) ---
        const nodes: Node[] = [];
        const nodeCount = 50;
        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                x: width * 0.6 + Math.random() * width * 0.4,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                color: `rgba(139, 92, 246, ${Math.random() * 0.8 + 0.2})`, // violet-500
            });
        }

        let animationFrameId: number;

        function draw() {
            // Clear the canvas
            ctx.clearRect(0, 0, width, height);

            // Draw left particle flow
            particles.forEach(p => {
                ctx.fillStyle = p.color;
                ctx.fillRect(p.x, p.y, p.size, p.size);
                p.x += p.speed;
                if (p.x > width * 0.4) {
                    p.x = 0;
                    p.y = Math.random() * height;
                }
            });

            // Draw right particle network
            nodes.forEach(n => {
                // Update position and boundary bounce
                n.x += n.vx;
                n.y += n.vy;
                const xMin = width * 0.6;
                if (n.x < xMin || n.x > width) n.vx *= -1;
                if (n.y < 0 || n.y > height) n.vy *= -1;

                // Draw node particle
                ctx.beginPath();
                ctx.fillStyle = n.color;
                ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.closePath();

                // Draw connecting lines
                nodes.forEach(n2 => {
                    const dist = Math.sqrt(Math.pow(n.x - n2.x, 2) + Math.pow(n.y - n2.y, 2));
                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(139, 92, 246, ${1 - dist / 100})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(n.x, n.y);
                        ctx.lineTo(n2.x, n2.y);
                        ctx.stroke();
                        ctx.closePath();
                    }
                });
            });

            animationFrameId = requestAnimationFrame(draw);
        }

        // Start drawing and listen for resize
        draw();
        window.addEventListener('resize', resizeCanvas);
        // Cleanup function
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    useEffect(() => {
        drawCanvasEffect();
    }, [drawCanvasEffect]);

    const scrollDown = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        if (firstSectionRef.current) {
            firstSectionRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    }
    return (
        <div
            className={`relative bg-[${CssVariableNames.backgroundColor}] text-white font-sans overflow-hidden min-h-screen`}>
            <div className={`relative f-ScreenBg`}>
                {/*Bg Video*/}
                <video
                    className="relative w-full h-[100vh] z-0 object-cover"
                    autoPlay loop muted playsInline
                    poster={heroVideoPostUrl}
                >
                    <source src={heroVideoBlob} type="video/mp4"/>
                </video>
                {/* Title Text */}
                <HeroSectionTitle/>
            </div>
            <div className={`absolute z-20 pb-12 top-[90vh] left-0 right-0 flex justify-center text-[${CssVariableNames.foregroundColor}]`}>
                <a className="flex items-center cursor-pointer" onClick={scrollDown} href="#111">
                    <div style={{fontSize: '1.02265625rem', paddingRight: '0.511328125rem'}} className="">向下滑动翻页
                    </div>
                    <div style={{height: '0.9715234375rem', width: '0.8692578125rem'}}
                         className="relative animate-bounce">
                        <DoubleArrowDownBouncing/>
                    </div>
                </a>
            </div>

            {/* Hero Content Body - relative, centered, on top of Canvas */}
            <div ref={firstSectionRef} className="relative z-10 min-h-screen flex flex-col justify-center py-20 px-4">
                {/* Canvas Element for dynamic background - absolute position */}
                <canvas
                    id="hero-canvas"
                    ref={canvasRef}
                    className="absolute top-0 left-0 w-full h-[20vh] z-0"
                />
                {/* AI Chatbox Main Body */}
                <ChatSection />
            </div>
        </div>
    )
}
