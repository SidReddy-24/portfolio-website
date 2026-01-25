import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Admin = ({ projects, setProjects, hobbies, setHobbies, about, setAbout }) => {
    const [mode, setMode] = useState('works'); // 'works', 'hobbies', or 'about'
    const [inputUrl, setInputUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editData, setEditData] = useState(null);
    const [aboutData, setAboutData] = useState({ ...about });

    // Synchronize local aboutData with global about prop (for cross-tab updates)
    useEffect(() => {
        setAboutData(about);
    }, [about]);

    // Automatically sync local changes to global state for "socket-like" real-time updates
    const updateAboutSystem = (newData) => {
        setAboutData(newData);
        setAbout(newData);
    };

    // Multi-proxy fetching helper
    const fetchWithProxies = async (url) => {
        const proxies = [
            `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
            `https://corsproxy.io/?${encodeURIComponent(url)}`,
        ];

        let lastError = null;
        for (const proxyUrl of proxies) {
            try {
                const res = await fetch(proxyUrl);
                if (!res.ok) throw new Error(`Proxy returned ${res.status}`);

                // Handle different proxy response formats
                const data = await res.json();
                return data.contents || data; // allorigins uses .contents, others may differ
            } catch (err) {
                lastError = err;
                continue; // Try next proxy
            }
        }
        throw new Error(`All proxies failed: ${lastError?.message || 'Unknown error'}`);
    };

    // Enhanced metadata extraction with multiple strategies
    const extractMetadata = (html, url) => {
        const strategies = [
            // Strategy 1: Open Graph tags
            () => {
                const titleMatch = html.match(/<meta property="og:title" content="([^"]+)"/);
                const descMatch = html.match(/<meta property="og:description" content="([^"]+)"/);
                const photoMatch = html.match(/<meta property="og:image" content="([^"]+)"/);

                if (titleMatch) {
                    return {
                        title: titleMatch[1].split(' | ')[0],
                        description: descMatch ? descMatch[1].substring(0, 100) + "..." : null,
                        photo: photoMatch ? photoMatch[1] : null
                    };
                }
                return null;
            },
            // Strategy 2: Twitter Card tags
            () => {
                const titleMatch = html.match(/<meta name="twitter:title" content="([^"]+)"/);
                const descMatch = html.match(/<meta name="twitter:description" content="([^"]+)"/);
                const photoMatch = html.match(/<meta name="twitter:image" content="([^"]+)"/);

                if (titleMatch) {
                    return {
                        title: titleMatch[1],
                        description: descMatch ? descMatch[1].substring(0, 100) + "..." : null,
                        photo: photoMatch ? photoMatch[1] : null
                    };
                }
                return null;
            },
            // Strategy 3: JSON-LD structured data
            () => {
                const jsonLdMatch = html.match(/<script type="application\/ld\+json">(.+?)<\/script>/s);
                if (jsonLdMatch) {
                    try {
                        const data = JSON.parse(jsonLdMatch[1]);
                        if (data.headline || data.name) {
                            return {
                                title: data.headline || data.name,
                                description: data.description?.substring(0, 100) + "..." || null,
                                photo: data.image?.url || data.image || null
                            };
                        }
                    } catch (e) {
                        // JSON parsing failed, continue to next strategy
                    }
                }
                return null;
            }
        ];

        // Try each strategy until one succeeds
        for (const strategy of strategies) {
            const result = strategy();
            if (result) return result;
        }

        // All strategies failed - return minimal data
        return {
            title: 'LinkedIn Post',
            description: 'Metadata extraction failed. Please edit manually.',
            photo: null
        };
    };

    const fetchData = async () => {
        if (!inputUrl) return;
        setIsLoading(true);
        setError(null);
        try {
            let newNode = {};
            if (mode === 'works') {
                const match = inputUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
                if (!match) throw new Error("INVALID_REPO_URL // Access Denied");

                const [, owner, repo] = match;
                const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
                if (!res.ok) throw new Error("GITHUB_API_ERROR // Node Unreachable");

                const data = await res.json();
                newNode = {
                    title: data.name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
                    category: data.language || 'Software Node',
                    year: new Date(data.created_at).getFullYear().toString(),
                    color: `bg-yellow-500`,
                    url: inputUrl
                };
                setProjects([newNode, ...projects]);
            } else {
                // Enhanced LinkedIn fetching with multi-proxy and fallback
                try {
                    const html = await fetchWithProxies(inputUrl);
                    const metadata = extractMetadata(html, inputUrl);

                    newNode = {
                        title: metadata.title,
                        description: metadata.description || 'Personal achievement uploaded via LinkedIn node.',
                        photo: metadata.photo,
                        date: new Date().toLocaleDateString('en-US', { month: '2-digit', year: 'numeric' }).replace('/', '.'),
                        url: inputUrl
                    };
                } catch (fetchError) {
                    // Graceful degradation: create node with URL for manual editing
                    setError(`METADATA_EXTRACTION_FAILED // ${fetchError.message} // Manual Override Required`);
                    newNode = {
                        title: `LinkedIn Post - ${new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`,
                        description: 'Click to edit and add details manually.',
                        photo: null,
                        date: new Date().toLocaleDateString('en-US', { month: '2-digit', year: 'numeric' }).replace('/', '.'),
                        url: inputUrl
                    };
                }
                setHobbies([newNode, ...hobbies]);
            }
            setInputUrl('');
            setEditingIndex(0);
            setEditData(newNode);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const addManualNode = () => {
        const newNode = mode === 'works'
            ? { title: 'NEW_WORK_NODE', category: 'Category', year: '2025', color: 'bg-yellow-500' }
            : { title: 'NEW_HOBBY_NODE', description: 'Description here...', date: '01.2025', photo: '' };

        if (mode === 'works') {
            setProjects([newNode, ...projects]);
        } else {
            setHobbies([newNode, ...hobbies]);
        }
        setEditingIndex(0);
        setEditData(newNode);
    };

    const removeNode = (index) => {
        if (mode === 'works') {
            setProjects(projects.filter((_, i) => i !== index));
        } else {
            setHobbies(hobbies.filter((_, i) => i !== index));
        }
        if (editingIndex === index) {
            setEditingIndex(null);
            setEditData(null);
        }
    };

    const startEditing = (index, item) => {
        setEditingIndex(index);
        setEditData({ ...item });
    };

    const saveEdit = () => {
        if (mode === 'works') {
            const newList = [...projects];
            newList[editingIndex] = editData;
            setProjects(newList);
        } else {
            const newList = [...hobbies];
            newList[editingIndex] = editData;
            setHobbies(newList);
        }
        setEditingIndex(null);
        setEditData(null);
    };

    const exportConfig = () => {
        const fullConfig = { projects, hobbies };
        const dataStr = JSON.stringify(fullConfig, null, 4);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', 'portfolio_config.json');
        linkElement.click();
    };

    const currentList = mode === 'works' ? projects : hobbies;

    return (
        <div className="min-h-screen bg-black text-[#f3ec19] font-mono p-8 pt-24 relative overflow-hidden">
            <div className="fixed inset-0 pointer-events-none opacity-20 scanlines z-50" />
            <div className="absolute inset-0 opacity-10 pointer-events-none z-0"
                style={{ backgroundImage: 'linear-gradient(#f3ec19 1px, transparent 1px), linear-gradient(90deg, #f3ec19 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <div className="max-w-6xl mx-auto relative z-10">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-[#f3ec19]/30 pb-6 gap-4">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tighter uppercase italic glitch-text" data-text="ADMIN_PANEL_v3.1">
                            ADMIN_PANEL_v3.1
                        </h1>
                        <p className="text-[10px] opacity-60 uppercase tracking-[0.5em] mt-2 flex items-center">
                            <span className="w-2 h-2 bg-red-500 mr-2 animate-ping" />
                            ROOT_ACCESS_GRANTED // SECURE_CHANNEL_ACTIVE
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={exportConfig}
                            className="px-4 py-2 border border-[#f3ec19]/40 hover:bg-[#f3ec19] hover:text-black transition-all text-[10px] uppercase font-bold tracking-widest"
                        >
                            [ EXPORT_PORTFOLIO.JSON ]
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-12">
                        <div className="flex flex-wrap gap-2">
                            {[
                                { id: 'works', label: 'SYSTEMS_NODE' },
                                { id: 'hobbies', label: 'EXPERIENCE_LOG' },
                                { id: 'about', label: 'USER_PROFILE' }
                            ].map((m) => (
                                <button
                                    key={m.id}
                                    onClick={() => { setMode(m.id); setEditingIndex(null); }}
                                    className={`px-6 py-3 border transition-all text-[10px] uppercase font-bold tracking-tighter ${mode === m.id ? 'bg-[#f3ec19] text-black shadow-[0_0_20px_rgba(243,236,25,0.4)]' : 'border-[#f3ec19]/30 text-[#f3ec19]/60 hover:border-[#f3ec19]'}`}
                                >
                                    {m.label}
                                </button>
                            ))}
                        </div>

                        {mode !== 'about' ? (
                            <>
                                <div className="bg-[#f3ec19]/5 p-8 border border-[#f3ec19]/20 backdrop-blur-sm relative group">
                                    <div className="absolute top-0 right-0 p-2 text-[8px] opacity-20 group-hover:opacity-100 transition-opacity">
                                        SYNC_INTERFACE_v4
                                    </div>
                                    <h2 className="text-sm font-bold uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                                        <span className="w-1 h-4 bg-[#f3ec19]" />
                                        Inject_{mode === 'works' ? 'Github' : 'LinkedIn'}_Node
                                    </h2>
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <input
                                            type="text"
                                            placeholder={mode === 'works' ? "GITHUB_URL" : "LINKEDIN_POST_URL"}
                                            value={inputUrl}
                                            onChange={(e) => setInputUrl(e.target.value)}
                                            className="flex-1 bg-black/50 border border-[#f3ec19]/30 p-4 text-[#f3ec19] placeholder-[#f3ec19]/20 outline-none focus:border-[#f3ec19]"
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={fetchData}
                                                disabled={isLoading}
                                                className={`px-8 py-4 border border-[#f3ec19] font-bold uppercase ${isLoading ? 'opacity-50' : 'hover:bg-[#f3ec19] hover:text-black'}`}
                                            >
                                                {isLoading ? 'SYNCING...' : 'SYNC_NODE'}
                                            </button>
                                            <button onClick={addManualNode} className="px-4 py-4 border border-[#f3ec19]/30 hover:bg-[#f3ec19]/10 font-bold">[+]</button>
                                        </div>
                                    </div>
                                    {error && <p className="text-red-500 text-[10px] mt-4 font-bold animate-pulse">!! ERROR: {error}</p>}
                                </div>

                                <div className="space-y-4">
                                    <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-40 mb-6 flex items-center">
                                        <span className="flex-1 h-[1px] bg-[#f3ec19]/10 mr-4" />
                                        ACTIVE_SUBSYSTEMS
                                        <span className="flex-1 h-[1px] bg-[#f3ec19]/10 ml-4" />
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <AnimatePresence mode='popLayout'>
                                            {currentList.map((item, index) => (
                                                <motion.div
                                                    layout
                                                    key={index}
                                                    onClick={() => startEditing(index, item)}
                                                    className={`group p-6 border transition-all relative overflow-hidden cursor-pointer ${editingIndex === index ? 'border-[#f3ec19] bg-[#f3ec19]/10' : 'border-[#f3ec19]/10 hover:border-[#f3ec19]/40 hover:bg-[#f3ec19]/5'}`}
                                                >
                                                    <div className="relative z-10 flex justify-between items-start">
                                                        <div className="max-w-[80%]">
                                                            <h3 className="font-bold uppercase tracking-tight truncate text-sm">{item.title}</h3>
                                                            <div className="flex gap-4 mt-2">
                                                                <span className="text-[8px] opacity-40 uppercase tracking-widest">{item.date || item.year}</span>
                                                                <span className="text-[8px] text-[#ff00ff] uppercase tracking-widest font-bold">{item.category || 'LOG_ENTRY'}</span>
                                                            </div>
                                                        </div>
                                                        <button onClick={(e) => { e.stopPropagation(); removeNode(index); }} className="text-red-500/40 text-[9px] font-bold hover:text-red-500 transition-colors">[DELETE]</button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
                                <div className="bg-[#f3ec19]/5 p-8 border border-[#f3ec19]/20 backdrop-blur-sm">
                                    <h3 className="text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-3 text-[#ff00ff]">
                                        <span className="w-1 h-3 bg-[#ff00ff]" />
                                        CORE_IDENTITY_SETTINGS
                                    </h3>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[8px] uppercase tracking-widest opacity-40">Primary_Bio</label>
                                            <textarea
                                                value={aboutData.bio}
                                                onChange={(e) => updateAboutSystem({ ...aboutData, bio: e.target.value })}
                                                rows={3}
                                                className="w-full bg-black/50 border border-[#f3ec19]/20 p-4 text-sm text-[#f3ec19] outline-none"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[8px] uppercase tracking-widest opacity-40">System_Description</label>
                                            <textarea
                                                value={aboutData.description}
                                                onChange={(e) => updateAboutSystem({ ...aboutData, description: e.target.value })}
                                                rows={4}
                                                className="w-full bg-black/50 border border-[#f3ec19]/20 p-4 text-xs text-[#f3ec19] outline-none"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[8px] uppercase tracking-widest opacity-40">Status</label>
                                                <input value={aboutData.status} onChange={(e) => updateAboutSystem({ ...aboutData, status: e.target.value })} className="w-full bg-black/50 border border-[#f3ec19]/20 p-4 text-xs text-[#f3ec19] outline-none" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[8px] uppercase tracking-widest opacity-40">Location</label>
                                                <input value={aboutData.location} onChange={(e) => updateAboutSystem({ ...aboutData, location: e.target.value })} className="w-full bg-black/50 border border-[#f3ec19]/20 p-4 text-xs text-[#f3ec19] outline-none" />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[8px] uppercase tracking-widest opacity-40 block">Loaded_Modules</label>
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {aboutData.modules.map((module, i) => (
                                                    <span key={i} className="flex items-center gap-2 px-3 py-1 bg-[#f3ec19]/10 border border-[#f3ec19]/30 text-[9px] uppercase font-bold">
                                                        {module}
                                                        <button onClick={() => updateAboutSystem({ ...aboutData, modules: aboutData.modules.filter((_, idx) => idx !== i) })} className="hover:text-red-500">×</button>
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="flex gap-2">
                                                <input id="new-module" type="text" placeholder="Inject Module..." className="flex-1 bg-black/50 border border-[#f3ec19]/20 p-3 text-[10px] text-[#f3ec19] outline-none" />
                                                <button
                                                    onClick={() => {
                                                        const el = document.getElementById('new-module');
                                                        const val = el.value.trim();
                                                        if (val) {
                                                            updateAboutSystem({ ...aboutData, modules: [...aboutData.modules, val] });
                                                            el.value = '';
                                                        }
                                                    }}
                                                    className="px-6 py-2 border border-[#f3ec19] text-[10px] font-bold hover:bg-[#f3ec19] hover:text-black"
                                                >
                                                    INJECT
                                                </button>
                                            </div>
                                        </div>
                                        <div className="pt-8 flex items-center gap-3">
                                            <div className="w-2 h-2 bg-[#f3ec19] animate-pulse rounded-full" />
                                            <span className="text-[8px] uppercase tracking-[0.3em] opacity-40">Auto-Sync Active // System_Ready</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-1">
                        <div className="sticky top-32 space-y-8">
                            {mode !== 'about' ? (
                                editingIndex !== null ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-black border border-[#f3ec19] p-8 shadow-[0_0_40px_rgba(243,236,25,0.1)]"
                                    >
                                        <div className="flex justify-between items-start mb-8">
                                            <h2 className="text-xs font-bold uppercase tracking-widest">MANUAL_OVERRIDE</h2>
                                            <button onClick={() => setEditingIndex(null)} className="text-[10px] opacity-40 hover:opacity-100">[CLOSE]</button>
                                        </div>
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-[8px] uppercase tracking-widest opacity-40">Identifier</label>
                                                <input
                                                    value={editData.title}
                                                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                                                    className="w-full bg-black/50 border border-[#f3ec19]/20 p-3 text-sm text-[#f3ec19] outline-none"
                                                />
                                            </div>
                                            {mode === 'works' ? (
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="text-[8px] uppercase tracking-widest opacity-40">Category</label>
                                                        <input value={editData.category} onChange={(e) => setEditData({ ...editData, category: e.target.value })} className="w-full bg-black/50 border border-[#f3ec19]/20 p-3 text-xs text-[#f3ec19] outline-none" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[8px] uppercase tracking-widest opacity-40">Year</label>
                                                        <input value={editData.year} onChange={(e) => setEditData({ ...editData, year: e.target.value })} className="w-full bg-black/50 border border-[#f3ec19]/20 p-3 text-xs text-[#f3ec19] outline-none" />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-6">
                                                    <div className="space-y-2">
                                                        <label className="text-[8px] uppercase tracking-widest opacity-40">Timestamp</label>
                                                        <input value={editData.date} onChange={(e) => setEditData({ ...editData, date: e.target.value })} className="w-full bg-black/50 border border-[#f3ec19]/20 p-3 text-xs text-[#f3ec19] outline-none" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[8px] uppercase tracking-widest opacity-40">Narrative</label>
                                                        <textarea value={editData.description} onChange={(e) => setEditData({ ...editData, description: e.target.value })} rows={4} className="w-full bg-black/50 border border-[#f3ec19]/20 p-3 text-[11px] text-[#f3ec19] outline-none resize-none" />
                                                    </div>
                                                </div>
                                            )}
                                            <button onClick={saveEdit} className="w-full py-4 bg-[#f3ec19] text-black font-black uppercase text-xs tracking-widest hover:bg-white transition-all">AUTHORIZE_CHANGES</button>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="border border-[#f3ec19]/10 p-12 text-center opacity-20 italic text-[10px] uppercase tracking-[0.3em]">Select a node to adjust parameters</div>
                                )
                            ) : (
                                <div className="bg-[#f3ec19]/5 border border-[#f3ec19]/20 p-8 space-y-6">
                                    <h2 className="text-xs font-bold uppercase tracking-widest text-[#f3ec19]">SYSTEM_PREVIEW</h2>
                                    <div className="space-y-4">
                                        <div className="p-4 border border-[#f3ec19]/10 font-mono">
                                            <div className="text-[8px] opacity-40 mb-2">// BIOS_STRING</div>
                                            <div className="text-[10px] leading-relaxed italic">"{aboutData.bio}"</div>
                                        </div>
                                        <div className="p-4 border border-[#f3ec19]/10 font-mono">
                                            <div className="text-[8px] opacity-40 mb-2">// MODULE_COUNT</div>
                                            <div className="text-xl font-bold">{aboutData.modules.length} ACTIVE</div>
                                        </div>
                                    </div>
                                    <div className="text-[8px] opacity-40 italic text-center uppercase tracking-widest pt-4">Auto-sync active across nodes.</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <footer className="mt-24 pt-12 border-t border-[#f3ec19]/10 flex justify-center pb-12">
                    <a href="/" className="group flex items-center gap-4 text-[10px] uppercase tracking-widest transition-all">
                        <span className="w-12 h-[1px] bg-[#f3ec19]/30 group-hover:w-24 group-hover:bg-[#f3ec19] transition-all" />
                        <span className="opacity-40 group-hover:opacity-100 group-hover:neon-glow-yellow transition-all">Exit Administrative Interface</span>
                        <span className="w-12 h-[1px] bg-[#f3ec19]/30 group-hover:w-24 group-hover:bg-[#f3ec19] transition-all" />
                    </a>
                </footer>
            </div>
            <div className="fixed inset-0 pointer-events-none mix-blend-overlay opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-[60]" />
        </div>
    );
};

export default Admin;
