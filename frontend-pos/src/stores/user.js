import { create } from "zustand";
import Api from "../service/api";
import Cookies from "js-cookie";

export const useStore = create ((set) => ({

    user : Cookies.get("user") ? JSON.parse(Cookies.get("user")) : {},
    token : Cookies.get("token") || "",

    login : async (credentials) => {
        const response = await Api.post("/api/login",credentials);
        set({ user: response.data.data.user});
        set({ token: response.data.data.token});

        Cookies.set("user",JSON.stringify(response.data.data.user));
        Cookies.set("token", response.data.data.token);
    },

    logout: () => {
        Cookies.remove("user");
        Cookies.remove("token");

        set({ user :  {}, token: "" });
    },
}));