import axios from "axios";
import { auth } from "./firebase";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 120000, // 2 min — AI analysis can take time
});

// Attach Firebase ID token to every request
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

/**
 * Upload an image for AI analysis.
 * @param {File} file - The image file to analyze
 * @returns {Promise<object>} - { report, scan_id, image_url, file_name }
 */
export const analyzeImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post("/analyze", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

/**
 * Get all reports for the current user.
 */
export const getUserReports = async () => {
  const res = await api.get("/reports");
  return res.data.reports;
};

/**
 * Get a single report by scan_id.
 */
export const getReport = async (scanId) => {
  const res = await api.get(`/reports/${scanId}`);
  return res.data.report;
};

/**
 * Delete a report by scan_id.
 */
export const deleteReport = async (scanId) => {
  const res = await api.delete(`/reports/${scanId}`);
  return res.data;
};
