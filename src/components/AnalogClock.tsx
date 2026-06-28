import React, { useEffect, useRef } from 'react';

interface AnalogClockProps {
  size?: number;
  theme?: 'light' | 'dark';
  accentColor?: string;
}

export default function AnalogClock({
  size = 200,
  theme = 'dark',
  accentColor = '#b58028', // Gold
}: AnalogClockProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const drawClock = () => {
      ctx.clearRect(0, 0, size, size);
      
      const radius = size / 2;
      const center = radius;
      
      // Draw premium Outer Ring / Case
      ctx.beginPath();
      ctx.arc(center, center, radius - 6, 0, 2 * Math.PI);
      const ringGrad = ctx.createLinearGradient(0, 0, size, size);
      ringGrad.addColorStop(0, '#fbf7eb'); // Golden white sheen
      ringGrad.addColorStop(0.25, '#ebd6a3'); // Bright gold
      ringGrad.addColorStop(0.5, '#b58028'); // Pure gold
      ringGrad.addColorStop(0.75, '#7d4d19'); // Rich bronze
      ringGrad.addColorStop(1, '#ebd6a3'); // Bright gold
      ctx.strokeStyle = ringGrad;
      ctx.lineWidth = 6;
      ctx.stroke();

      // Inner shiny outline rim
      ctx.beginPath();
      ctx.arc(center, center, radius - 10, 0, 2 * Math.PI);
      ctx.strokeStyle = theme === 'dark' ? 'rgba(235, 214, 163, 0.4)' : 'rgba(125, 77, 25, 0.2)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Clock face background
      ctx.beginPath();
      ctx.arc(center, center, radius - 11, 0, 2 * Math.PI);
      const faceGrad = ctx.createRadialGradient(center, center, 5, center, center, radius - 11);
      if (theme === 'dark') {
        faceGrad.addColorStop(0, '#162f46'); // Deep Navy Glow
        faceGrad.addColorStop(1, '#0b1420'); // Premium Dark Navy
      } else {
        faceGrad.addColorStop(0, '#ffffff');
        faceGrad.addColorStop(1, '#fbf7eb'); // Cream white
      }
      ctx.fillStyle = faceGrad;
      ctx.fill();

      // Outer bezel line
      ctx.beginPath();
      ctx.arc(center, center, radius - 16, 0, 2 * Math.PI);
      ctx.strokeStyle = theme === 'dark' ? 'rgba(181, 128, 40, 0.2)' : 'rgba(181, 128, 40, 0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Hours indicators (Numbers & Marks)
      ctx.font = `300 ${size * 0.08}px 'Space Grotesk', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = theme === 'dark' ? '#ebd6a3' : '#7d4d19';

      for (let num = 1; num <= 12; num++) {
        const angle = (num * Math.PI) / 6;
        const x = center + Math.sin(angle) * (radius - 34);
        const y = center - Math.cos(angle) * (radius - 34);
        
        // Show all numbers beautifully, as shown in Image 1
        ctx.fillText(num.toString(), x, y);

        // Draw elegant tick lines
        ctx.beginPath();
        const startX = center + Math.sin(angle) * (radius - 22);
        const startY = center - Math.cos(angle) * (radius - 22);
        const endX = center + Math.sin(angle) * (radius - 17);
        const endY = center - Math.cos(angle) * (radius - 17);
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = theme === 'dark' ? 'rgba(181, 128, 40, 0.5)' : 'rgba(11, 20, 32, 0.2)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Minutes ticks
      for (let i = 0; i < 60; i++) {
        if (i % 5 !== 0) {
          const angle = (i * Math.PI) / 30;
          ctx.beginPath();
          const startX = center + Math.sin(angle) * (radius - 20);
          const startY = center - Math.cos(angle) * (radius - 20);
          const endX = center + Math.sin(angle) * (radius - 17);
          const endY = center - Math.cos(angle) * (radius - 17);
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.strokeStyle = theme === 'dark' ? 'rgba(181, 128, 40, 0.3)' : 'rgba(11, 20, 32, 0.15)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Get Current Time
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();
      const second = now.getSeconds();
      const ms = now.getMilliseconds();

      // Hour Hand
      const hrAngle = ((hour % 12) * Math.PI) / 6 + (minute * Math.PI) / 360;
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.lineTo(
        center + Math.sin(hrAngle) * (radius * 0.45),
        center - Math.cos(hrAngle) * (radius * 0.45)
      );
      ctx.strokeStyle = theme === 'dark' ? '#ebd6a3' : '#7d4d19';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Minute Hand
      const minAngle = (minute * Math.PI) / 30 + (second * Math.PI) / 1800;
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.lineTo(
        center + Math.sin(minAngle) * (radius * 0.65),
        center - Math.cos(minAngle) * (radius * 0.65)
      );
      ctx.strokeStyle = theme === 'dark' ? '#f5ebd1' : '#b58028';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Second Hand (Sweeping smoothly)
      const secAngle = ((second + ms / 1000) * Math.PI) / 30;
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.lineTo(
        center + Math.sin(secAngle) * (radius * 0.75),
        center - Math.cos(secAngle) * (radius * 0.75)
      );
      ctx.strokeStyle = '#b58028'; // Pure Gold second hand
      ctx.lineWidth = 1.2;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Center gold cap
      ctx.beginPath();
      ctx.arc(center, center, 6, 0, 2 * Math.PI);
      ctx.fillStyle = '#b58028';
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = theme === 'dark' ? '#ebd6a3' : '#ffffff';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(center, center, 2, 0, 2 * Math.PI);
      ctx.fillStyle = theme === 'dark' ? '#0b1420' : '#ffffff';
      ctx.fill();

      // Loop animation smoothly
      animationId = requestAnimationFrame(drawClock);
    };

    drawClock();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [size, theme, accentColor]);

  return (
    <div className="flex justify-center items-center">
      <canvas
        id={`analog-clock-${theme}`}
        ref={canvasRef}
        width={size}
        height={size}
        className="drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)] transition-all duration-300"
      />
    </div>
  );
}
