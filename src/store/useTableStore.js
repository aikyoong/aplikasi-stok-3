import { create } from "zustand";

const useTableStore = create((set) => ({
  table: null,
  setTable: (table) => set({ table }),
}));

export default useTableStore;
