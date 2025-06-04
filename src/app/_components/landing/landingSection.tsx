'use client'
import { useState, useEffect } from 'react';
import Button from "../button";

type Particle = {
    id: string;
    type: string;
    left: number;
    top: number;
    animationDelay: number;
    animationDuration: number;
    size: number;
    opacity: number;
};

const LandingSection = () => {
    const [particles, setParticles] = useState<Particle[]>([]);

    // Generate particles only on client side to avoid hydration mismatch
    useEffect(() => {
        // Main floating particles - increased count
        const mainParticles = Array.from({ length: 60 }, (_, i) => ({
            id: `main-${i}`,
            type: 'main',
            left: Math.random() * 100,
            top: Math.random() * 100,
            animationDelay: Math.random() * 15,
            animationDuration: 6 + Math.random() * 10,
            size: 2 + Math.random() * 5,
            opacity: 0.15 + Math.random() * 0.35
        }));

        // Left-focused particles - concentrated on left 40% of screen
        const leftFocusedParticles = Array.from({ length: 40 }, (_, i) => ({
            id: `left-${i}`,
            type: 'leftFocus',
            left: Math.random() * 40, // Only left 40% of screen
            top: Math.random() * 100,
            animationDelay: Math.random() * 12,
            animationDuration: 5 + Math.random() * 8,
            size: 1.5 + Math.random() * 4,
            opacity: 0.2 + Math.random() * 0.4
        }));

        // Dense left edge particles - very left side
        const leftEdgeParticles = Array.from({ length: 30 }, (_, i) => ({
            id: `leftEdge-${i}`,
            type: 'leftEdge',
            left: Math.random() * 25, // Only left 25% of screen
            top: Math.random() * 100,
            animationDelay: Math.random() * 10,
            animationDuration: 4 + Math.random() * 7,
            size: 1 + Math.random() * 3,
            opacity: 0.3 + Math.random() * 0.5
        }));

        // Subtle sparkle particles - increased count
        const sparkleParticles = Array.from({ length: 50 }, (_, i) => ({
            id: `sparkle-${i}`,
            type: 'sparkle',
            left: Math.random() * 100,
            top: Math.random() * 100,
            animationDelay: Math.random() * 12,
            animationDuration: 3 + Math.random() * 6,
            size: 1 + Math.random() * 3,
            opacity: 0.1 + Math.random() * 0.4
        }));

        // Left sparkles - concentrated sparkles on left
        const leftSparkles = Array.from({ length: 25 }, (_, i) => ({
            id: `leftSparkle-${i}`,
            type: 'sparkle',
            left: Math.random() * 35, // Left 35% of screen
            top: Math.random() * 100,
            animationDelay: Math.random() * 8,
            animationDuration: 2 + Math.random() * 5,
            size: 0.8 + Math.random() * 2.5,
            opacity: 0.2 + Math.random() * 0.6
        }));

        // Slow drifting particles - increased count
        const driftParticles = Array.from({ length: 35 }, (_, i) => ({
            id: `drift-${i}`,
            type: 'drift',
            left: Math.random() * 100,
            top: Math.random() * 100,
            animationDelay: Math.random() * 18,
            animationDuration: 12 + Math.random() * 20,
            size: 1.5 + Math.random() * 4,
            opacity: 0.1 + Math.random() * 0.25
        }));

        // Left drift particles
        const leftDriftParticles = Array.from({ length: 20 }, (_, i) => ({
            id: `leftDrift-${i}`,
            type: 'drift',
            left: Math.random() * 30, // Left 30% of screen
            top: Math.random() * 100,
            animationDelay: Math.random() * 15,
            animationDuration: 10 + Math.random() * 18,
            size: 2 + Math.random() * 5,
            opacity: 0.15 + Math.random() * 0.3
        }));

        // Orbital particles
        const orbitalParticles = Array.from({ length: 30 }, (_, i) => ({
            id: `orbital-${i}`,
            type: 'orbital',
            left: Math.random() * 100,
            top: Math.random() * 100,
            animationDelay: Math.random() * 10,
            animationDuration: 8 + Math.random() * 15,
            size: 1 + Math.random() * 3,
            opacity: 0.2 + Math.random() * 0.3
        }));

        // Left orbital particles
        const leftOrbitalParticles = Array.from({ length: 15 }, (_, i) => ({
            id: `leftOrbital-${i}`,
            type: 'orbital',
            left: Math.random() * 35, // Left 35% of screen
            top: Math.random() * 100,
            animationDelay: Math.random() * 8,
            animationDuration: 6 + Math.random() * 12,
            size: 1.5 + Math.random() * 3.5,
            opacity: 0.25 + Math.random() * 0.35
        }));

        // Fast moving particles
        const fastParticles = Array.from({ length: 25 }, (_, i) => ({
            id: `fast-${i}`,
            type: 'fast',
            left: Math.random() * 100,
            top: Math.random() * 100,
            animationDelay: Math.random() * 8,
            animationDuration: 4 + Math.random() * 8,
            size: 0.5 + Math.random() * 2,
            opacity: 0.3 + Math.random() * 0.4
        }));

        // Cascading particles from left
        const cascadeParticles = Array.from({ length: 20 }, (_, i) => ({
            id: `cascade-${i}`,
            type: 'cascade',
            left: Math.random() * 15, // Far left edge
            top: Math.random() * 100,
            animationDelay: Math.random() * 12,
            animationDuration: 8 + Math.random() * 16,
            size: 1 + Math.random() * 4,
            opacity: 0.2 + Math.random() * 0.4
        }));

        setParticles([
            ...mainParticles, 
            ...leftFocusedParticles, 
            ...leftEdgeParticles,
            ...sparkleParticles, 
            ...leftSparkles,
            ...driftParticles, 
            ...leftDriftParticles,
            ...orbitalParticles, 
            ...leftOrbitalParticles,
            ...fastParticles,
            ...cascadeParticles
        ]);
    }, []);

    return (
        <>
            {/* CSS Styles */}
            <style jsx global>{`
                @keyframes float {
                    0% {
                        transform: translateY(0) translateX(0) rotate(0deg) scale(1);
                    }
                    20% {
                        transform: translateY(-30px) translateX(15px) rotate(72deg) scale(1.1);
                    }
                    40% {
                        transform: translateY(-50px) translateX(-20px) rotate(144deg) scale(0.9);
                    }
                    60% {
                        transform: translateY(-25px) translateX(25px) rotate(216deg) scale(1.2);
                    }
                    80% {
                        transform: translateY(-40px) translateX(-10px) rotate(288deg) scale(0.8);
                    }
                    100% {
                        transform: translateY(0) translateX(0) rotate(360deg) scale(1);
                    }
                }

                @keyframes sparkle {
                    0%, 100% {
                        transform: scale(0) rotate(0deg);
                        opacity: 0;
                    }
                    25% {
                        transform: scale(0.5) rotate(90deg);
                        opacity: 0.5;
                    }
                    50% {
                        transform: scale(1.2) rotate(180deg);
                        opacity: 1;
                    }
                    75% {
                        transform: scale(0.8) rotate(270deg);
                        opacity: 0.7;
                    }
                }

                @keyframes drift {
                    0% {
                        transform: translateY(0) translateX(0) rotate(0deg);
                        opacity: 0.1;
                    }
                    25% {
                        transform: translateY(-25vh) translateX(20px) rotate(90deg);
                        opacity: 0.3;
                    }
                    50% {
                        transform: translateY(-50vh) translateX(-15px) rotate(180deg);
                        opacity: 0.4;
                    }
                    75% {
                        transform: translateY(-75vh) translateX(30px) rotate(270deg);
                        opacity: 0.2;
                    }
                    100% {
                        transform: translateY(-100vh) translateX(10px) rotate(360deg);
                        opacity: 0;
                    }
                }

                @keyframes orbital {
                    0% {
                        transform: translateX(0) translateY(0) rotate(0deg);
                    }
                    25% {
                        transform: translateX(40px) translateY(-40px) rotate(90deg);
                    }
                    50% {
                        transform: translateX(0) translateY(-80px) rotate(180deg);
                    }
                    75% {
                        transform: translateX(-40px) translateY(-40px) rotate(270deg);
                    }
                    100% {
                        transform: translateX(0) translateY(0) rotate(360deg);
                    }
                }

                @keyframes fastMove {
                    0% {
                        transform: translateX(-50px) translateY(50px) rotate(0deg) scale(0);
                        opacity: 0;
                    }
                    10% {
                        opacity: 0.8;
                        transform: scale(1);
                    }
                    50% {
                        transform: translateX(50vw) translateY(-30px) rotate(180deg) scale(1.2);
                        opacity: 1;
                    }
                    90% {
                        opacity: 0.3;
                    }
                    100% {
                        transform: translateX(100vw) translateY(-80px) rotate(360deg) scale(0);
                        opacity: 0;
                    }
                }

                @keyframes cascade {
                    0% {
                        transform: translateX(0) translateY(0) rotate(0deg) scale(0.5);
                        opacity: 0;
                    }
                    20% {
                        transform: translateX(30px) translateY(-20px) rotate(60deg) scale(1);
                        opacity: 0.8;
                    }
                    40% {
                        transform: translateX(80px) translateY(-40px) rotate(120deg) scale(1.2);
                        opacity: 1;
                    }
                    60% {
                        transform: translateX(150px) translateY(-30px) rotate(200deg) scale(0.9);
                        opacity: 0.7;
                    }
                    80% {
                        transform: translateX(250px) translateY(-60px) rotate(280deg) scale(1.1);
                        opacity: 0.4;
                    }
                    100% {
                        transform: translateX(400px) translateY(-80px) rotate(360deg) scale(0);
                        opacity: 0;
                    }
                }

                @keyframes leftFloat {
                    0% {
                        transform: translateY(0) translateX(0) rotate(0deg) scale(1);
                    }
                    25% {
                        transform: translateY(-40px) translateX(20px) rotate(90deg) scale(1.3);
                    }
                    50% {
                        transform: translateY(-60px) translateX(-15px) rotate(180deg) scale(0.8);
                    }
                    75% {
                        transform: translateY(-30px) translateX(35px) rotate(270deg) scale(1.1);
                    }
                    100% {
                        transform: translateY(0) translateX(0) rotate(360deg) scale(1);
                    }
                }

                @keyframes shimmer {
                    0% {
                        background-position: -200% center;
                    }
                    100% {
                        background-position: 200% center;
                    }
                }
                
                .animate-shimmer {
                    background-size: 200% auto;
                    animation: shimmer 3s linear infinite;
                }
            `}</style>

            <div className="relative w-full h-screen overflow-hidden">
                {/* Video Background */}
                <video 
                    autoPlay 
                    muted 
                    loop 
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                >
                    <source src="images/owl.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                
                {/* Gray Overlay for better text contrast */}
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                
                {/* Dynamic Particle System - Only render when particles are loaded */}
                {particles.length > 0 && (
                    <div className="absolute inset-0 pointer-events-none">
                        {particles.map((particle) => {
                            // Different styles for different particle types
                            const getParticleStyle = () => {
                                const baseStyle = {
                                    left: `${particle.left}%`,
                                    top: `${particle.top}%`,
                                    width: `${particle.size}px`,
                                    height: `${particle.size}px`,
                                    opacity: particle.opacity,
                                    animationDelay: `${particle.animationDelay}s`,
                                };

                                switch (particle.type) {
                                    case 'main':
                                        return {
                                            ...baseStyle,
                                            animation: `float ${particle.animationDuration}s ease-in-out infinite`,
                                            filter: 'blur(1px)',
                                            boxShadow: '0 0 12px rgba(139, 92, 246, 0.6)'
                                        };
                                    case 'sparkle':
                                        return {
                                            ...baseStyle,
                                            animation: `sparkle ${particle.animationDuration}s ease-in-out infinite`,
                                            filter: 'blur(0.5px)',
                                            boxShadow: '0 0 8px rgba(255, 255, 255, 0.9)'
                                        };
                                    case 'drift':
                                        return {
                                            ...baseStyle,
                                            animation: `drift ${particle.animationDuration}s linear infinite`,
                                            filter: 'blur(2px)',
                                            boxShadow: '0 0 10px rgba(139, 92, 246, 0.4)'
                                        };
                                    case 'orbital':
                                        return {
                                            ...baseStyle,
                                            animation: `orbital ${particle.animationDuration}s ease-in-out infinite`,
                                            filter: 'blur(1px)',
                                            boxShadow: '0 0 6px rgba(59, 130, 246, 0.7)'
                                        };
                                    case 'fast':
                                        return {
                                            ...baseStyle,
                                            animation: `fastMove ${particle.animationDuration}s linear infinite`,
                                            filter: 'blur(0.8px)',
                                            boxShadow: '0 0 4px rgba(168, 85, 247, 0.8)'
                                        };
                                    default:
                                        return baseStyle;
                                }
                            };

                            const getParticleClass = () => {
                                switch (particle.type) {
                                    case 'main':
                                        return 'absolute rounded-full bg-gradient-to-r from-purple-400 to-blue-400';
                                    case 'sparkle':
                                        return 'absolute rounded-full bg-gradient-to-r from-white to-purple-200';
                                    case 'drift':
                                        return 'absolute rounded-full bg-gradient-to-r from-purple-300 to-blue-300';
                                    case 'orbital':
                                        return 'absolute rounded-full bg-gradient-to-r from-blue-400 to-cyan-400';
                                    case 'fast':
                                        return 'absolute rounded-full bg-gradient-to-r from-purple-500 to-pink-400';
                                    default:
                                        return 'absolute rounded-full bg-gradient-to-r from-purple-400 to-blue-400';
                                }
                            };

                            return (
                                <div
                                    key={particle.id}
                                    className={getParticleClass()}
                                    style={getParticleStyle()}
                                />
                            );
                        })}
                    </div>
                )}
                
                {/* Content */}
                <div className="relative z-10 flex items-center justify-center h-full px-8">
                    <div className="text-center text-white max-w-4xl">
                        <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight relative">
                            <span className="relative inline-block">
                                <span className="absolute inset-0 text-transparent bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text animate-shimmer">
                                    Silent Observers,
                                </span>
                                <span 
                                    className="relative text-white"
                                    style={{
                                        textShadow: '0 0 20px rgba(255, 255, 255, 0.5), 0 0 40px rgba(139, 92, 246, 0.3), 0 0 80px rgba(139, 92, 246, 0.1)'
                                    }}
                                >
                                    Silent Observers,
                                </span>
                            </span>
                            <br />
                            <span className="relative inline-block">
                                <span className="absolute inset-0 text-transparent bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text animate-shimmer">
                                    Powerful <span className="text-primary">Insights</span>
                                </span>
                                <span 
                                    className="relative text-white"
                                    style={{
                                        textShadow: '0 0 20px rgba(255, 255, 255, 0.5), 0 0 40px rgba(139, 92, 246, 0.3), 0 0 80px rgba(139, 92, 246, 0.1)'
                                    }}
                                >
                                    Powerful <span className="text-primary" style={{
                                        textShadow: '0 0 20px rgba(139, 92, 246, 0.8), 0 0 40px rgba(139, 92, 246, 0.5), 0 0 60px rgba(139, 92, 246, 0.3)'
                                    }}>Insights</span>
                                </span>
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto"
                           style={{
                               textShadow: '0 0 10px rgba(255, 255, 255, 0.3)'
                           }}>
                            {"We transform customer service into"}<br />
{"your company's smartest advantage."}
                        </p>
                        
                        <div className="flex flex-row gap-6 justify-center">
                            <Button label="Login" href="/auth?mode=login" />
                            <Button label="Sign up" white href="/auth?mode=signup" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LandingSection;