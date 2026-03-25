import React, { useRef, useEffect, useState, useCallback } from 'react';

// --- Configuration Constants ---
const TEXT = 'EduMentor';
const NEON_COLOR = '#44D9E6'; // Tech cyan
const PRIMARY_COLOR_RGBA = 'rgba(68, 217, 230,'; // For ripples
const RING_COUNT = 5;

// --- TypeScript Class for Radar Rings ---
class Ring {
    index: number;
    speedFactor: number;
    radius: number;
    maxRadius: number;
    life: number;

    constructor(index: number, initialWidth: number, initialHeight: number) {
        this.index = index;
        this.speedFactor = 1 + index * 0.5;
        this.maxRadius = Math.max(initialWidth, initialHeight) * 0.8 || 1;
        this.radius = (index / RING_COUNT) * this.maxRadius * 0.5; // Stagger initial radius
        this.life = 100;
    }

    reset(width: number, height: number) {
        this.radius = 0;
        this.maxRadius = Math.max(width, height) * 0.8 || 1;
        this.life = 100;
    }

    update(mouse: { x: number; y: number }, currentMaxRadius: number) {
        const distanceFactor = Math.sqrt(mouse.x * mouse.x + mouse.y * mouse.y);
        const speedMod = 1 + (1 - distanceFactor) * 2; // Speed up when mouse is central

        this.radius += (this.speedFactor + speedMod) * 1.5;
        this.radius = Math.max(0, this.radius);

        const safeMaxRadius = currentMaxRadius || 1;
        this.life = 100 * (1 - this.radius / safeMaxRadius);

        if (this.radius > safeMaxRadius) {
            this.reset(safeMaxRadius / 0.8, safeMaxRadius / 0.8); // Reset using an estimated size
        }
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number) {
        if (this.radius <= 0) return;

        const opacity = Math.max(0, this.life / 100) * 0.5;
        if (opacity <= 0.01) return;

        ctx.strokeStyle = `${PRIMARY_COLOR_RGBA} ${opacity})`;
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.arc(width / 2, height / 2, this.radius, 0, Math.PI * 2);
        ctx.stroke();
    }
}

// --- Data Radar Component ---
interface DataRadarProps {
    // Optional props for flexibility, e.g., if you want to control its position
    className?: string;
}
export const FooterSectionAnimation: React.FC<DataRadarProps> = ({ className = 'absolute bottom-0 left-0' }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
    const mouse = useRef({ x: 0, y: 0 }); // Normalized mouse position [-1, 1]
    const rings = useRef<Ring[]>([]);
    const time = useRef(0);

    // 1. Handle Resize and Initialization
    const resizeCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (canvas && container) {
            const width = container.offsetWidth;
            const height = container.offsetHeight;
            canvas.width = width;
            canvas.height = height;
            setCanvasSize({ width, height });

            if (width > 0 && height > 0) {
                rings.current = [];
                for (let i = 0; i < RING_COUNT; i++) {
                    rings.current.push(new Ring(i, width, height));
                }
            }
        }
    }, []);

    useEffect(() => {
        // Initial setup and global resize listener
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        return () => window.removeEventListener('resize', resizeCanvas);
    }, [resizeCanvas]);

    // 2. Drawing Functions
    const drawGrid = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
        ctx.strokeStyle = 'rgba(68, 217, 230, 0.05)';
        ctx.lineWidth = 1;
        const gridSpacing = 50;
        const offsetX = Math.sin(time.current * 0.005) * 5;

        // Vertical Lines
        for (let x = 0; x < width; x += gridSpacing) {
            ctx.beginPath();
            ctx.moveTo(x + offsetX, 0);
            ctx.lineTo(x + offsetX, height);
            ctx.stroke();
        }
        // Horizontal Lines
        for (let y = 0; y < height; y += gridSpacing) {
            ctx.beginPath();
            ctx.moveTo(0, y - offsetX);
            ctx.lineTo(width, y - offsetX);
            ctx.stroke();
        }
    }, []);

    const drawCoreText = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
        if (width === 0 || height === 0) return;

        const centerX = width / 2;
        const centerY = height / 2;

        ctx.save();
        ctx.translate(centerX, centerY);

        // Text offset based on mouse position
        const offsetX = mouse.current.x * 5;
        const offsetY = mouse.current.y * 3;
        ctx.translate(offsetX, offsetY);

        // Dynamic font size
        const dynamicFontSize = Math.min(width, height) * 0.15;

        ctx.font = `900 ${dynamicFontSize}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Neon effect: White core with high blur + colored glow
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = NEON_COLOR;
        ctx.shadowBlur = 35;
        ctx.fillText(TEXT, 0, 0);

        ctx.shadowBlur = 10;
        ctx.fillStyle = NEON_COLOR;
        ctx.fillText(TEXT, 1, 1); // Slight offset for deeper glow

        ctx.restore();
    }, []);

    // 3. Animation Loop
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        const { width, height } = canvasSize;

        if (!ctx || width === 0 || height === 0) return;

        let animationFrameId: number;
        const maxRadius = Math.max(width, height) * 0.8 || 1;

        const animate = () => {
            time.current++;

            // Trail effect: Partially transparent background wipe
            ctx.fillStyle = 'rgba(13, 12, 21, 0.2)';
            ctx.fillRect(0, 0, width, height);

            // Disable shadow for non-neon elements (grid/rings)
            ctx.shadowBlur = 0;
            ctx.shadowColor = 'transparent';

            // Draw sequence
            drawGrid(ctx, width, height);

            rings.current.forEach(r => {
                r.update(mouse.current, maxRadius);
                r.draw(ctx, width, height);
            });

            drawCoreText(ctx, width, height);

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [canvasSize, drawCoreText, drawGrid]);

    // 4. Mouse Move Handler
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const canvasX = e.clientX - rect.left;
        const canvasY = e.clientY - rect.top;

        // Normalize coordinates to [-1, 1]
        mouse.current.x = (canvasX / canvasSize.width) * 2 - 1;
        mouse.current.y = (canvasY / canvasSize.height) * 2 - 1;
    };

    // Use absolute positioning and Tailwind utility classes for styling
    return (
        <div
            ref={containerRef as React.RefObject<HTMLDivElement>}
            // Combine default absolute positioning with any passed className
            className={`w-full h-[50vh] relative overflow-hidden bg-[#0d0c15] ${className}`}
            onMouseMove={handleMouseMove}
        >
            <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center">
                <canvas
                    ref={canvasRef}
                    className="block w-full h-full"
                />
            </div>
        </div>
    );
}
