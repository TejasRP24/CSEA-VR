import React from "react";
import { technologies } from "./zone3data";
import { technologyIcons } from "./icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Zone3() {
    const navigate = useNavigate();

    // Helper to calculate grid span based on index
    const getGridSpan = (index) => {
        if (index === 0) return "md:col-span-2 md:row-span-2"; // First item large
        if (index === 3) return "md:col-span-2"; // Make 4th item span 2 columns
        return "md:col-span-1";
    };

    return (
        <div className="min-h-screen w-full bg-slate-100 py-20 px-6 md:px-12 font-sans selection:bg-blue-200">
            {/* HERO */}
            <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="max-w-[1200px] mx-auto text-center mb-20 flex flex-col items-center"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-8">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                    <span className="text-xs font-bold tracking-widest uppercase text-slate-500 font-mono">
                        PSG College of Technology • Dept of CSE
                    </span>
                </div>

                <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-tight mb-6">
                    AI & Emerging <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">Technologies Pavilion</span>
                </h1>

                <p className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-2xl font-medium">
                    Explore cutting-edge technologies, laboratories and
                    innovation facilities shaping the future of computing.
                </p>
            </motion.section>

            {/* TECHNOLOGY GRID (BENTO BOX) */}
            <section className="max-w-[1600px] w-full mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:auto-rows-[240px]">
                {technologies.map((tech, index) => {
                    const Icon = technologyIcons[tech.slug];
                    const spanClass = getGridSpan(index);
                    const isLarge = spanClass.includes("row-span-2");

                    return (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ scale: 1.01, y: -4 }}
                            key={tech.id}
                            onClick={() => navigate(`/technology/${tech.slug}`)}
                            className={`group relative bg-white border border-slate-200 rounded-3xl p-6 md:p-8 overflow-hidden cursor-pointer shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_48px_rgba(37,99,235,0.1)] transition-all duration-500 flex flex-col gap-6 ${spanClass}`}
                            style={{ 
                                '--accent': tech.accentColor || '#3b82f6',
                                '--accent-light': (tech.accentColor || '#3b82f6') + '15'
                            }}
                        >
                            {/* Abstract gradient glow */}
                            <div 
                                className="absolute -right-20 -top-20 w-64 h-64 rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none"
                                style={{ backgroundColor: 'var(--accent)' }}
                            />

                            <div className="flex justify-between items-start relative z-10">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-slate-50 border border-slate-100 shadow-sm group-hover:scale-110 transition-transform duration-500">
                                    {Icon && <Icon size={24} color="var(--accent)" />}
                                </div>
                                <div className="px-3.5 py-1 rounded-full text-[11px] font-bold border" style={{ color: 'var(--accent)', backgroundColor: 'var(--accent-light)', borderColor: 'var(--accent-light)' }}>
                                    {tech.labsCount} Labs
                                </div>
                            </div>

                            <div className="relative z-10 flex flex-col gap-2">
                                <h2 className={`font-black text-slate-900 tracking-tight leading-none group-hover:text-blue-600 transition-colors ${isLarge ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'}`}>
                                    {tech.title}
                                </h2>
                                <p className={`text-slate-500 font-medium leading-relaxed max-w-lg mt-1 ${isLarge ? 'line-clamp-5 text-sm' : 'line-clamp-3 text-xs'}`}>
                                    {tech.shortDescription || "Explore laboratories and facilities under this technology."}
                                </p>
                            </div>

                            {/* Show Labs list on large card to fill the blank space */}
                            {isLarge && tech.labs && (
                                <div className="flex flex-col gap-3 border-t border-slate-100 pt-6 relative z-10">
                                    <span className="text-[10px] font-mono text-slate-400 uppercase font-black tracking-wider">Associated Facilities</span>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {tech.labs.slice(0, 4).map((lab) => (
                                            <div key={lab.id} className="flex items-center gap-2.5 text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors">
                                                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: 'var(--accent)' }}></span>
                                                <span className="truncate">{lab.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Massive background number */}
                            <span className="absolute -bottom-4 -right-2 text-[120px] font-black text-slate-100/50 pointer-events-none font-mono tracking-tighter leading-none group-hover:scale-110 transition-transform duration-700">
                                {String(tech.id).padStart(2, "0")}
                            </span>
                        </motion.div>
                    );
                })}
            </section>
        </div>
    );
}

export default Zone3;