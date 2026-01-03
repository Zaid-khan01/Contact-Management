import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api", 
  headers: {
    "Content-Type": "application/json",
  },
});

// CREATE CONTACT
export const createContact = (data) => API.post("/contacts/", data);

// GET CONTACTS
export const getContacts = () => API.get("/contacts/");

// DELETE CONTACT 
export const deleteContact = (id) => API.delete(`/contacts/${id}/`);

export default API;
