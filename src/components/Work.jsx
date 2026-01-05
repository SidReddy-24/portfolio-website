import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const Work = ({ projects }) => {
    const [hoveredProject, setHoveredProject] = useState(null);

    return (
        <section id="work" className="min-h-screen py-32 relative">
            <div className="container mx-auto px-4 max-w-7xl relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-8xl font-display font-black text-white mb-20 uppercase tracking-tighter glitch-text"
                    data-text="SELECTED WORK"
                >
                    Project Work
                </motion.h2>

                <div className="grid grid-cols-1 gap-8">
                    {projects.map((project, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            onMouseEnter={() => setHoveredProject(index)}
                            onMouseLeave={() => setHoveredProject(null)}
                            className="group relative border-t border-[#f3ec19]/10 py-12 transition-colors duration-500 cursor-pointer overflow-hidden"
                        >
                            {/* HUD Deco */}
                            <div className="absolute top-4 left-4 text-[8px] font-mono text-[#f3ec19]/20 uppercase">
                                Ref_ID: {index.toString().padStart(3, '0')} // ENCODED
                            </div>

                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4 relative z-20">
                                <h3 className="text-4xl md:text-6xl font-display font-bold text-gray-300 group-hover:text-[#f3ec19] transition-colors duration-300 uppercase mix-blend-difference group-hover:neon-glow-yellow">
                                    {project.title}
                                </h3>
                                <div className="flex items-center gap-8 text-gray-500 font-light tracking-widest uppercase mix-blend-difference font-mono text-xs">
                                    <span className="group-hover:text-[#ff00ff]">{project.category}</span>
                                    <span className="group-hover:text-white">[{project.year}]</span>
                                </div>
                            </div>

                            {/* Hover Background Reveal for List Item */}
                            <div className="absolute inset-0 bg-[#f3ec19]/5 scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-center -z-0" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Work;
