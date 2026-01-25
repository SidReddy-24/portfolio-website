import { motion, AnimatePresence } from 'framer-motion';

const LandingPage = ({ progress, onEnter, isLoaded }) => {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{
                opacity: 0,
                transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] }
            }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center cursor-default overflow-hidden"
        >
            {/* HUD Scanlines */}
            <div className="scanlines" />

            <div className="relative w-full max-w-4xl px-8 flex flex-col items-center z-10">
                {/* Progress Text */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-8"
                >
                    <span className="text-sm font-mono tracking-widest text-[#f3ec19] uppercase neon-glow-yellow">
                        System Initialization / {progress}%
                    </span>
                </motion.div>

                {/* Large Brand Mark or Title */}
                <div className="overflow-hidden mb-12">
                    <motion.h1
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
                        className="text-7xl md:text-9xl font-display font-black text-white tracking-tighter uppercase glitch-text"
                        data-text="PORTFOLIO"
                    >
                        Portfolio
                    </motion.h1>
                </div>

                {/* Enter Button */}
                <div className="h-24 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        {isLoaded ? (
                            <motion.button
                                key="enter-button"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow: "0 0 20px #f3ec19",
                                    backgroundColor: "rgba(243, 236, 25, 0.1)"
                                }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onEnter}
                                className="px-12 py-4 border border-[#f3ec19] text-[#f3ec19] font-display font-bold text-xl uppercase tracking-widest transition-all duration-300 neon-glow-yellow"
                            >
                                Access System
                            </motion.button>
                        ) : (
                            <motion.div
                                key="loader"
                                className="w-48 h-[2px] bg-gray-900 overflow-hidden"
                            >
                                <motion.div
                                    className="h-full bg-[#f3ec19] shadow-[0_0_10px_#f3ec19]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ ease: "linear" }}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Bottom Metadata */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="absolute bottom-[-20vh] md:bottom-[-30vh] left-0 w-full flex justify-between text-[10px] font-mono text-[#f3ec19]/40 uppercase tracking-[0.3em] px-4"
                >
                    <span>Est. 2026</span>
                    <span>Siddharth Reddy</span>
                    <span>Security Protocol Active</span>
                </motion.div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-10 left-10 text-[10px] font-mono text-[#f3ec19]/30 uppercase tracking-widest vertical-text">
                Decryption in Progress...
            </div>
            <div className="absolute bottom-10 right-10 text-[10px] font-mono text-[#ff00ff]/30 uppercase tracking-widest">
                Node: SR-2026-X
            </div>

            {/* Random Data Streams */}
            <div className="data-stream top-1/4 left-10 animate-pulse">01011001 01010100</div>
            <div className="data-stream bottom-1/4 right-10 animate-pulse delay-1000">LINK_ESTABLISHED</div>
        </motion.div>
    );
};

export default LandingPage;
