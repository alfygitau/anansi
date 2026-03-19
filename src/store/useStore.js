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
};

export const useStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      // Actions
      setInvestDetails: (details) => set({ investDetails: details }),
      setDepositDetails: (details) => set({ depositDetails: details }),
      setAccounts: (accounts) => set({ accounts: accounts }),
      setSharesDetails: (details) => set({ sharesDetails: details }),
      setMembership: (data) => set({ membership: data }),
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
