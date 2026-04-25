import axios from "axios";

import { supabase } from "../lib/supabase";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use(async (config) => {
  if (!supabase) {
    return config;
  }

  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (session?.access_token) {
    if (typeof config.headers.set === "function") {
      config.headers.set("Authorization", `Bearer ${session.access_token}`);
    } else {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
  }

  return config;
});

export const getApiErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error ?? error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
};
