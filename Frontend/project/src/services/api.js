import axios from "axios";

// Replace this with your actual deployed backend URL
const API_BASE_URL = "https://contact-management-9yc1.onrender.com/api"; 

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

// DELETE CONTACT 
export const deleteContact = (id) => API.delete(`/contacts/${id}`);

export default API;
