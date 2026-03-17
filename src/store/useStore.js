import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useStore = create(
  persist(
    (set, get) => ({
      sharesDetails: {},
      investDetails: {},
      depositDetails: {},
      accounts: [],
      membership: {},
      membership_mobile: null,

      // Specific action for investments
      setInvestDetails: (details) => set({ investDetails: details }),
      setDepositDetails: (details) => set({ depositDetails: details }),
      setAccounts: (accounts) => set({ accounts: accounts }),
      setSharesDetails: (details) => set({ sharesDetails: details }),
      setMembership: (data) => set({ membership: data }),
      setMembershipMobile: (mobile) => set({ membership_mobile: mobile }),

      setAllData: (data) => set({ ...data }),
    }),
    {
      name: "my-storage",
    },
  ),
);
