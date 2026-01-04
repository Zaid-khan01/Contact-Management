import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// CREATE CONTACT
export const createContact = (data) => API.post("/api/contacts", data);

// GET CONTACTS
export const getContacts = () => API.get("/api/contacts");

// UPDATE CONTACT
export const updateContact = (id, data) => API.put(`/api/contacts/${id}`, data);

// DELETE CONTACT 
export const deleteContact = (id) => API.delete(`/api/contacts/${id}`);

export default API;