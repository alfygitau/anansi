import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useStore = create(
  persist(
    (set, get) => ({
      sharesDetails: {},
      investDetails: {},
      depositDetails: {},
      accounts: [],

      // Specific action for investments
      setInvestDetails: (details) => set({ investDetails: details }),
      setDepositDetails: (details) => set({ depositDetails: details }),
      setAccounts: (accounts) => set({ accounts: accounts }),
      setSharesDetails: (details) => set({ sharesDetails: details }),

      setAllData: (data) => set({ ...data }),
    }),
    {
      name: "my-storage",
    },
  ),
);
