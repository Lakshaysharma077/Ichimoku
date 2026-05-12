import { create } from 'zustand';

interface EditStore {
  isEditMode: boolean;
  setEditMode: (mode: boolean) => void;
  pendingChanges: Record<string, any>;
  addChange: (section: string, path: string[], value: any) => void;
  clearChanges: () => void;
}

export const useEditStore = create<EditStore>((set) => ({
  isEditMode: false,
  setEditMode: (mode) => set({ isEditMode: mode }),
  pendingChanges: {},
  addChange: (section, path, value) => set((state) => {
    const sectionChanges = state.pendingChanges[section] || {};
    // Simplify: for now, we'll store the whole section or deep-merge
    // To keep it simple for a visual editor, we'll just track if anything changed
    return {
      pendingChanges: {
        ...state.pendingChanges,
        [section]: { ...sectionChanges, [path.join('.')]: value }
      }
    };
  }),
  clearChanges: () => set({ pendingChanges: {} }),
}));
