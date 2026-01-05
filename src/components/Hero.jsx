import { motion } from 'framer-motion';

const Hero = () => {
    return (
        <section id="home" className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
            {/* Holographic Frame */}
            <div className="absolute inset-20 border border-[#f3ec19]/20 pointer-events-none">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#f3ec19]" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#f3ec19]" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#f3ec19]" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#f3ec19]" />
            </div>

            <div className="z-10 text-center relative">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap"
                >
                    <span className="text-[10px] font-mono text-[#f3ec19] tracking-[0.5em] uppercase opacity-50">
                        Subject Identifier: SR-24
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="text-9xl font-display font-black tracking-tighter uppercase text-white glitch-text filter drop-shadow-[0_0_15px_rgba(243,236,25,0.3)]"
                    data-text="SIDDHARTH REDDY"
                >
                    Siddharth Reddy
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="mt-6 text-2xl font-light text-[#ff00ff] tracking-[0.5em] uppercase neon-glow-magenta"
                >
                    Creative Developer
                </motion.p>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-10 animate-bounce text-[#f3ec19]"
            >
                <div className="flex flex-col items-center gap-2">
                    <span className="text-[10px] uppercase tracking-widest font-mono opacity-50">Initiate Scroll</span>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </motion.div>

            {/* Background HUD elements */}
            <div className="data-stream top-20 right-20">LAT: 12.9716 N / LON: 77.5946 E</div>
            <div className="data-stream bottom-20 left-20">SYSTEM_STATUS: ONLINE</div>
        </section>
    );
};

export default Hero;
