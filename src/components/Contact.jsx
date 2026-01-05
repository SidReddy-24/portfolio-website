import { motion } from 'framer-motion';

const Contact = () => {
    return (
        <section id="contact" className="min-h-[80vh] flex flex-col items-center justify-center bg-transparent relative overflow-hidden">
            {/* HUD Scanlines Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#ff00ff]/5 to-transparent pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center relative z-10"
            >
                <h2 className="text-7xl md:text-9xl font-display font-black text-white mb-8 uppercase tracking-tighter glitch-text" data-text="TRANSMIT">
                    Let's Connect
                </h2>
                <div className="relative inline-block group">
                    <a
                        href="mailto:sidreddy.onwork@gmail.com"
                        className="text-2xl md:text-4xl font-mono text-[#f3ec19] hover:text-white transition-all duration-300 tracking-widest uppercase pb-2 neon-glow-yellow"
                    >
                        sidreddy.onwork@gmail.com
                    </a>
                    <div className="absolute -bottom-2 left-0 w-0 h-[1px] bg-[#ff00ff] group-hover:w-full transition-all duration-500 shadow-[0_0_10px_#ff00ff]" />
                </div>
            </motion.div>

            <div className="mt-24 flex gap-12 relative z-10">
                {[
                    { name: 'Instagram', url: 'https://www.instagram.com/sid_rdy/' },
                    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/the-siddharth-reddy/' },
                    { name: 'GitHub', url: 'https://github.com/SidReddy-24' }
                ].map((social) => (
                    <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-mono text-[#ff00ff]/60 hover:text-white uppercase tracking-[0.3em] transition-all duration-300 hover:neon-glow-magenta"
                    >
                        {social.name}
                    </a>
                ))}
            </div>

            <footer className="absolute bottom-12 w-full text-center px-4">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] font-mono text-gray-700 uppercase tracking-[0.4em]">
                    <span>© 2026 // Siddharth_Reddy</span>
                    <span className="text-[#f3ec19]/30">Connection_Secure: AES-256</span>
                    <span>All Rights Encoded</span>
                </div>
            </footer>
        </section>
    );
};

export default Contact;
