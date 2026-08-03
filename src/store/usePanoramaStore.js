import { create } from 'zustand';

export const usePanoramaStore = create((set, get) => ({
  panoramas: [],
  currentPanoramaId: null,
  history: [],
  historyIndex: -1,
  searchQuery: '',
  isSidebarOpen: true,
  isCoordsPanelOpen: false,
  selectedBuilding: 'Main Block',
  selectedFloor: 'Floor 2',
  
  // Real-time camera direction (updated by Marzipano container)
  currentView: {
    yaw: 0,
    pitch: 0,
    fov: 1.2,
  },

  setPanoramas: (panoramas) => {
    set({ panoramas });
    if (panoramas.length > 0 && !get().currentPanoramaId) {
      get().setCurrentPanoramaId(panoramas[0].id);
    }
  },

  setCurrentPanoramaId: (id, skipHistory = false) => {
    const { history, historyIndex, panoramas } = get();
    const target = panoramas.find((p) => p.id === id);
    if (!target) return;

    let newHistory = [...history];
    let newIndex = historyIndex;

    if (!skipHistory) {
      // Cut off any forward history if we are in the middle of history and do a new action
      newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(id);
      newIndex = newHistory.length - 1;
    }

    set({
      currentPanoramaId: id,
      selectedBuilding: target.building,
      selectedFloor: target.floor,
      history: newHistory,
      historyIndex: newIndex,
    });
  },

  goBack: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const targetId = history[newIndex];
      set({ historyIndex: newIndex, currentPanoramaId: targetId });
      return targetId;
    }
    return null;
  },

  goForward: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const targetId = history[newIndex];
      set({ historyIndex: newIndex, currentPanoramaId: targetId });
      return targetId;
    }
    return null;
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  
  toggleCoordsPanel: () => set((state) => ({ isCoordsPanelOpen: !state.isCoordsPanelOpen })),
  
  setSelectedBuilding: (building) => set({ selectedBuilding: building }),
  
  setSelectedFloor: (floor) => set({ selectedFloor: floor }),

  setCurrentView: (yaw, pitch, fov) => set({
    currentView: { yaw, pitch, fov }
  }),

  // Helpers
  getCurrentPanorama: () => {
    const { panoramas, currentPanoramaId } = get();
    return panoramas.find((p) => p.id === currentPanoramaId) || null;
  },
}));
