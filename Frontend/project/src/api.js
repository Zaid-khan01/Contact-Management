import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false, 
});

export const createContact = async (data) => {
  return API.post("/contacts", JSON.stringify(data));
};

export const getContacts = async () => {
  return API.get("/contacts");
};

export const updateContact = async (id, data) => {
  return API.put(`/contacts/${id}`, JSON.stringify(data));
};

export const deleteContact = async (id) => {
  return API.delete(`/contacts/${id}`);
};

export default API;
