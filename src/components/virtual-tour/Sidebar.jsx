import React, { useState, useMemo } from 'react';
import { usePanoramaStore } from '../../store/usePanoramaStore';
import { FiSearch, FiMapPin, FiCompass, FiHome, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const navigate = useNavigate();
  const panoramas = usePanoramaStore((state) => state.panoramas);
  const currentPanoramaId = usePanoramaStore((state) => state.currentPanoramaId);
  const isSidebarOpen = usePanoramaStore((state) => state.isSidebarOpen);
  const toggleSidebar = usePanoramaStore((state) => state.toggleSidebar);

  const selectedBuilding = usePanoramaStore((state) => state.selectedBuilding);
  const selectedFloor = usePanoramaStore((state) => state.selectedFloor);
  const setSelectedBuilding = usePanoramaStore((state) => state.setSelectedBuilding);
  const setSelectedFloor = usePanoramaStore((state) => state.setSelectedFloor);

  const [searchVal, setSearchVal] = useState('');

  // Get current active panorama object
  const currentPano = useMemo(() => {
    return panoramas.find((p) => p.id === currentPanoramaId);
  }, [panoramas, currentPanoramaId]);

  // Extract unique buildings and floors for quick navigation menus
  const buildings = useMemo(() => {
    return Array.from(new Set(panoramas.map((p) => p.building)));
  }, [panoramas]);

  const floors = useMemo(() => {
    return Array.from(new Set(panoramas.map((p) => p.floor)));
  }, [panoramas]);

  // Search filter
  const searchResults = useMemo(() => {
    if (!searchVal.trim()) return [];
    const query = searchVal.toLowerCase();
    return panoramas.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query)) ||
        p.building.toLowerCase().includes(query) ||
        p.floor.toLowerCase().includes(query)
    );
  }, [searchVal, panoramas]);

  const handleSelectResult = (id) => {
    navigate(`/tour/${id}`);
    setSearchVal('');
  };

  return (
    <div className="absolute top-24 left-6 z-40 flex h-[calc(100vh-140px)] select-none pointer-events-none">
      
      {/* Sidebar Content Card */}
      <div 
        className={`bg-slate-900/80 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl h-full flex flex-col transition-all duration-300 pointer-events-auto ${
          isSidebarOpen ? 'w-80 opacity-100' : 'w-0 opacity-0 overflow-hidden border-none'
        }`}
      >
        {isSidebarOpen && (
          <>
            {/* Search Bar Section */}
            <div className="p-4 border-b border-white/5 relative">
              <div className="relative">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search labs, offices, entrances..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  className="w-full bg-slate-950/70 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white text-xs placeholder-slate-400 focus:outline-none focus:border-blue-500/80 transition-all font-sans"
                />
              </div>

              {/* Autocomplete suggestions */}
              {searchResults.length > 0 && (
                <div className="absolute top-full left-4 right-4 mt-2 bg-slate-950 border border-slate-700/50 rounded-xl shadow-2xl max-h-60 overflow-y-auto z-50 divide-y divide-slate-800">
                  {searchResults.map((res) => (
                    <button
                      key={res.id}
                      onClick={() => handleSelectResult(res.id)}
                      className="w-full px-4 py-3 text-left hover:bg-slate-900 flex items-center gap-3 transition-colors text-white cursor-pointer"
                    >
                      <FiMapPin className="text-blue-400 shrink-0 w-3.5 h-3.5" />
                      <div className="flex-grow min-w-0">
                        <div className="text-xs font-semibold truncate text-slate-100">{res.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {res.building} • {res.floor}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Main scrollable layout */}
            <div className="flex-grow overflow-y-auto p-4 space-y-5 custom-scrollbar">
              
              {/* Location Information Card */}
              {currentPano && (
                <div className="bg-white/5 border border-white/5 p-4 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-[10px] text-blue-400 uppercase font-bold tracking-wider">
                    <FiCompass className="w-3.5 h-3.5 animate-spin-slow" />
                    <span>Active Location</span>
                  </div>
                  <h3 className="text-sm font-extrabold text-white leading-snug">{currentPano.name}</h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                    <FiHome className="w-3 h-3 text-slate-400" />
                    <span>{currentPano.building}</span>
                    <span className="text-slate-500">•</span>
                    <span>{currentPano.floor}</span>
                  </div>
                  <p className="text-[11.5px] text-slate-400 leading-relaxed pt-1">
                    {currentPano.description}
                  </p>
                </div>
              )}

              {/* Building & Floor Selector */}
              <div className="space-y-2.5">
                <h4 className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Quick Navigation</h4>
                
                {/* Building Selector */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500">Select Building</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {buildings.map((b) => (
                      <button
                        key={b}
                        onClick={() => {
                          setSelectedBuilding(b);
                          // Select the first node in this building automatically
                          const target = panoramas.find((p) => p.building === b);
                          if (target) {
                            navigate(`/tour/${target.id}`);
                          }
                        }}
                        className={`text-[11px] font-semibold py-2 px-3 rounded-lg border text-center transition-all cursor-pointer ${
                          selectedBuilding === b
                            ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/10'
                            : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Floor Selector */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-[10px] text-slate-500">Select Floor</label>
                  <div className="flex flex-col gap-1">
                    {floors.map((f) => (
                      <button
                        key={f}
                        onClick={() => {
                          setSelectedFloor(f);
                          // Select the first node on this floor automatically
                          const target = panoramas.find((p) => p.building === selectedBuilding && p.floor === f);
                          if (target) {
                            navigate(`/tour/${target.id}`);
                          }
                        }}
                        className={`text-[11px] font-semibold py-2 px-4 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                          selectedFloor === f
                            ? 'bg-blue-600 text-white border-blue-500'
                            : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <span>{f}</span>
                        <span className="text-[9px] bg-slate-950/40 text-slate-400 py-0.5 px-1.5 rounded-full">
                          {panoramas.filter((p) => p.building === selectedBuilding && p.floor === f).length} views
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Viewpoints list on the active floor */}
              <div className="space-y-2">
                <h4 className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Points on this Floor</h4>
                <div className="space-y-1">
                  {panoramas
                    .filter((p) => p.building === selectedBuilding && p.floor === selectedFloor)
                    .map((item) => (
                      <button
                        key={item.id}
                        onClick={() => navigate(`/tour/${item.id}`)}
                        className={`w-full text-left py-2.5 px-3 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer ${
                          item.id === currentPanoramaId
                            ? 'bg-blue-500/10 border-blue-500/40 text-blue-300'
                            : 'bg-transparent border-transparent hover:bg-white/5 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <FiMapPin className={`w-3.5 h-3.5 ${item.id === currentPanoramaId ? 'text-blue-400' : 'text-slate-500'}`} />
                        <span className="text-xs font-medium truncate">{item.name}</span>
                      </button>
                    ))}
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/5 bg-slate-950/20 text-[10px] text-slate-500 text-center font-mono">
              PANORAMA TOUR SYSTEM v1.0
            </div>
          </>
        )}
      </div>

      {/* Floating Toggle Tab */}
      <div className="flex items-center h-full pl-2">
        <button
          onClick={toggleSidebar}
          className="bg-slate-900/90 hover:bg-slate-900 border border-white/10 hover:border-white/20 p-2.5 rounded-xl shadow-2xl text-white/80 hover:text-white backdrop-blur-md active:scale-90 transition-all pointer-events-auto cursor-pointer flex items-center justify-center"
          title={isSidebarOpen ? 'Collapse Panel' : 'Expand Panel'}
        >
          {isSidebarOpen ? <FiChevronLeft className="w-4 h-4" /> : <FiChevronRight className="w-4 h-4" />}
        </button>
      </div>

    </div>
  );
}
