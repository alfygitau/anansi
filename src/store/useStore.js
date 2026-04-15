import { create } from "zustand";
import { persist } from "zustand/middleware";

const initialState = {
  sharesDetails: {},
  investDetails: {},
  depositDetails: {},
  accounts: [],
  membership: {},
  membership_mobile: null,
  forgetEmail: null,
  kyc_details: null,
  id_images: null,
  registeredUser: {},
};

export const useStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      // Actions
      setInvestDetails: (details) => set({ investDetails: details }),
      clearInvestDetails: () => set({ investDetails: {} }),

      setDepositDetails: (details) => set({ depositDetails: details }),
      clearDepositDetails: () => set({ depositDetails: {} }),

      setAccounts: (accounts) => set({ accounts: accounts }),

      setSharesDetails: (details) => set({ sharesDetails: details }),
      clearSharesDetails: () => set({ sharesDetails: {} }),

      setMembership: (data) => set({ membership: data }),
      clearMembership: () => set({ membership: {} }),

      setRegisteredUser: (data) => set({ registeredUser: data }),
      clearRegisteredUser: () => set({ registeredUser: {} }),

      setMembershipMobile: (mobile) => set({ membership_mobile: mobile }),
      setForgetEmail: (data) => set({ forgetEmail: data }),
      setKycDetails: (data) => set({ kyc_details: data }),
      setIdImages: (urls) => set({ id_images: urls }),
      setAllData: (data) => set({ ...data }),

      // 2. The Reset Function
      resetStore: () => {
        set(initialState);
      },
    }),
    {
      name: "my-storage",
    },
  ),
);
