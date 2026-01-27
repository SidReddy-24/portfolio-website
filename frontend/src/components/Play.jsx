import { motion } from 'framer-motion';

const Play = ({ hobbies }) => {

    return (
        <section id="play" className="py-20 relative overflow-hidden">
            <div className="container mx-auto px-4 max-w-7xl relative z-10">
                <div className="flex items-end justify-between mb-16 px-4">
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-black text-white uppercase tracking-tighter glitch-text" data-text="HOBBIES & EXTRAS">
                        Experiences & Extras
                    </h2>
                    <span className="text-[10px] text-[#ff00ff] font-mono uppercase tracking-[0.4em] hidden md:block neon-glow-magenta">
                        // Personal_Data_Stream
                    </span>
                </div>

                <div className="overflow-x-auto hide-scrollbar pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <div className="flex gap-6 px-4" style={{ width: 'max-content' }}>
                        {hobbies.map((item, index) => (
                            <motion.div
                                key={index}
                                whileHover={{
                                    scale: 1.02,
                                    borderColor: "#ff00ff",
                                    backgroundColor: "rgba(255, 0, 255, 0.05)"
                                }}
                                onClick={() => item.url && window.open(item.url, '_blank')}
                                className="aspect-square bg-black border border-[#f3ec19]/10 p-0 flex flex-col items-start justify-between cursor-pointer transition-all duration-500 group relative overflow-hidden"
                                style={{ minWidth: '300px', width: '300px' }}
                            >
                                {item.photo && (
                                    <div className="absolute inset-0 z-0 opacity-40 group-hover:opacity-60 transition-opacity">
                                        <img src={item.photo} alt={item.title} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                                    </div>
                                )}

                                <div className="p-8 h-full w-full flex flex-col justify-between relative z-10">
                                    <div className="flex justify-between items-start w-full">
                                        <div className="absolute top-2 right-2 text-[8px] font-mono text-[#f3ec19]/40">
                                            0{index + 1}
                                        </div>

                                        <div className="flex flex-col gap-2 w-full">
                                            <span className="text-2xl font-display font-bold text-gray-300 group-hover:text-[#f3ec19] transition-colors uppercase leading-none truncate">
                                                {item.title}
                                            </span>
                                            {item.description ? (
                                                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-wider line-clamp-3 opacity-60 group-hover:opacity-100 transition-all duration-300 leading-relaxed">
                                                    {item.description}
                                                </p>
                                            ) : (
                                                <p className="text-[10px] font-mono text-gray-600 italic opacity-40">
                                                    No description provided.
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="w-full mt-auto">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[10px] text-[#f3ec19] font-mono opacity-50 group-hover:opacity-100 transition-opacity">
                                                {item.date}
                                            </span>
                                            <span className="text-[8px] text-[#ff00ff] font-mono opacity-0 group-hover:opacity-100 transition-all">
                                                VIEW_LOG_ENTRY
                                            </span>
                                        </div>
                                        <div className="h-[1px] w-full bg-[#f3ec19]/10 group-hover:bg-[#f3ec19]/40 transition-colors" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Play;
