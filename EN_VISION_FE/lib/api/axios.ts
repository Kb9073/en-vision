import axios from "axios"

export const apiClient = axios.create({
  baseURL: "http://localhost:8000", // 🔁 change if deployed
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})
