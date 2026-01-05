import { motion } from 'framer-motion';

const About = ({ about }) => {
    if (!about) return null;

    return (
        <section id="about" className="min-h-screen flex items-center justify-center bg-transparent py-20 relative">
            {/* Background elements */}
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#f3ec19]/5 -z-10" />

            <div className="container mx-auto px-4 max-w-6xl relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-6xl md:text-8xl font-display font-black text-white mb-8 uppercase tracking-tighter glitch-text" data-text="ABOUT SYSTEM">
                            About System
                        </h2>
                        <p className="text-xl text-[#f3ec19]/80 font-mono tracking-tight leading-relaxed mb-6">
                            // USER_BIO_INITIATED
                            {about.bio}
                        </p>
                        <p className="text-lg text-gray-400 font-light leading-relaxed">
                            {about.description}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="bg-[#f3ec19]/5 p-10 relative border-l-2 border-[#ff00ff] shadow-[inset_0_0_20px_rgba(255,0,255,0.05)]"
                    >
                        {/* HUD corner marks */}
                        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#f3ec19]/40" />
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#f3ec19]/40" />

                        <h3 className="text-sm font-mono font-bold text-[#ff00ff] mb-8 uppercase tracking-[0.5em] neon-glow-magenta">
                            Loaded Modules
                        </h3>
                        <div className="flex flex-wrap gap-4">
                            {about.modules.map((tech) => (
                                <span key={tech} className="px-4 py-2 border border-[#f3ec19]/20 text-[#f3ec19] text-[10px] font-mono uppercase tracking-widest hover:border-[#f3ec19] hover:bg-[#f3ec19]/10 transition-all duration-300">
                                    {tech}
                                </span>
                            ))}
                        </div>

                        <div className="mt-12 pt-8 border-t border-[#f3ec19]/10 text-[9px] font-mono text-gray-600 uppercase tracking-widest">
                            Status: {about.status} // Node_Location: {about.location}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default About;
