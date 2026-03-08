import { create } from "zustand";
import Api from "../service/api";
import Cookies from "js-cookie";

export const useCustomerStore = create((set) => ({
    customer: Cookies.get("customer") ? JSON.parse(Cookies.get("customer")) : {},
    customerToken: Cookies.get("customerToken") || "",

    customerLogin: async (credentials) => {
        const response = await Api.post("/api/customers/login", credentials);
        set({ customer: response.data.data.customer });
        set({ customerToken: response.data.data.token });

        Cookies.set("customer", JSON.stringify(response.data.data.customer));
        Cookies.set("customerToken", response.data.data.token);
    },

    customerRegister: async (data) => {
        await Api.post("/api/customers/register", data);
    },

    getCustomerTransactions: async (page = 1) => {
        const token = useCustomerStore.getState().customerToken;
        const response = await Api.get(`/api/customers/transactions?page=${page}&limit=5`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    customerLogout: () => {
        Cookies.remove("customer");
        Cookies.remove("customerToken");
        set({ customer: {}, customerToken: "" });
    },
}));
