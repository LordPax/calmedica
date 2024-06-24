"use client";
import React, { ReactNode, useRef, useState } from 'react';

const DimensionalCard = ({ children }: { children: ReactNode }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [glareStyle, setGlareStyle] = useState<React.CSSProperties>({});

    const calculateAngle = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = cardRef.current;
        if (!card) return;

        // Ensuring TypeScript recognizes the type of card
        let rect = card.getBoundingClientRect();

        let x = Math.abs(rect.x - e.clientX);
        let y = Math.abs(rect.y - e.clientY);
        let halfWidth = rect.width / 2;
        let halfHeight = rect.height / 2;

        let calcAngleX = (x - halfWidth) / 6;
        let calcAngleY = (y - halfHeight) / 14;

        // Apply transformation and perspective
        card.style.transform = `rotateY(${calcAngleX}deg) rotateX(${-calcAngleY}deg) scale(1.04)`;
        card.style.perspective = `${halfWidth * 6}px`;
    };

    return (
        <div
            className="card blastoise"
            ref={cardRef}
            onMouseEnter={calculateAngle}
            onMouseMove={calculateAngle}
            onMouseLeave={() => setGlareStyle({})}
        >
            <span className="inner-card">
                <span className="glare" style={glareStyle}></span>
                {children}
            </span>

        </div>
    );
}

export default DimensionalCard;
