import axios from "axios";

const API = "http://127.0.0.1:8000";

export const getProfileExists = async () => {
  const res = await axios.get(`${API}/profile/exists`);
  return res.data.exists;
};

export const saveProfile = async (profile) => {
  const res = await axios.post(`${API}/profile/save`, profile);
  return res.data;
};

export const getProfile = async () => {
  const res = await axios.get(`${API}/profile`);
  return res.data;
};