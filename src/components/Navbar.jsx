import { motion } from 'framer-motion';

const Navbar = () => {
    const links = ['Home', 'Work', 'About', 'Contact'];

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 mix-blend-difference"
        >
            <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#ff00ff] animate-pulse shadow-[0_0_10px_#ff00ff]" />
                <span className="text-white font-display font-black text-xl uppercase tracking-tighter">
                    SIDDHARTH
                </span>
                <span className="hidden sm:inline text-[10px] font-mono text-[#f3ec19]/50 px-2 py-1 border border-[#f3ec19]/30 rounded">
                    CORE_v1.0
                </span>
            </div>

            <div className="hidden md:flex items-center gap-12 relative">
                {/* HUD Brackets */}
                <div className="absolute -inset-x-4 -inset-y-2 border-x border-[#f3ec19]/10 pointer-events-none" />

                {links.map((item) => (
                    <a
                        key={item}
                        href={`#${item.toLowerCase()}`}
                        className="text-[10px] uppercase tracking-[0.3em] text-gray-400 hover:text-[#f3ec19] transition-all duration-300 relative group font-mono"
                    >
                        {item}
                        <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#f3ec19] transition-all duration-300 group-hover:w-full shadow-[0_0_5px_#f3ec19]" />
                    </a>
                ))}
            </div>

            <div className="text-[10px] font-mono text-[#f3ec19]/40 flex flex-col items-end">
                <span>SECURITY: CLEAR</span>
                <span className="animate-pulse">SIGNAL: 100%</span>
            </div>
        </motion.nav>
    );
};

export default Navbar;
