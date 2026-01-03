import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// CREATE CONTACT
export const createContact = (data) => API.post("/contacts", data);

// GET CONTACTS
export const getContacts = () => API.get("/contacts");

// UPDATE CONTACT
export const updateContact = (id, data) => API.put(`/contacts/${id}`, data);

// DELETE CONTACT 
export const deleteContact = (id) => API.delete(`/contacts/${id}`);

export default API;
