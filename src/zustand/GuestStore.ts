export interface GuestStore {
  guestUuid: string | null;
  guestScores: number[];
  initGuestUuid: () => void;
  addGuestScore: (score: number) => void;
  clearGuestData: () => void;
  migrateToUser: () => Promise<void>;
}

export const createGuestStore = (
  set: (partial: Partial<GuestStore>) => void,
  get: () => GuestStore
): GuestStore => ({
  guestUuid: null,
  guestScores: [],

  initGuestUuid: () => {
    const stored = localStorage.getItem("guestUuid");
    if (stored) {
      set({ guestUuid: stored });
    } else {
      const uuid = `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("guestUuid", uuid);
      set({ guestUuid: uuid });
    }
  },

  addGuestScore: (score: number) => {
    const scores = [...get().guestScores, score];
    set({ guestScores: scores });
  },

  clearGuestData: () => {
    localStorage.removeItem("guestUuid");
    set({ guestUuid: null, guestScores: [] });
  },

  migrateToUser: async () => {
    // Guest scores are already on the server with guestUuid
    // After login, backend will handle migration
    // Just clear local guest data
    get().clearGuestData();
  },
});
