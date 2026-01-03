import React from "react";
import { deleteContact } from "../api"; // use the centralized API

function ContactCard({ contact, refreshContacts }) {
  const handleDelete = async (id) => {
    try {
      await deleteContact(id); // call the API function
      refreshContacts(); // refresh the contact list
    } catch (error) {
      console.error("Delete failed:", error.response?.data || error.message);
      alert("Failed to delete contact. Check console for details.");
    }
  };

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition">
      <div className="flex justify-between">
        <div>
          <h3 className="font-semibold text-gray-800">{contact.name}</h3>
          <p className="text-xs text-gray-500">{contact.email}</p>
          <p className="text-xs text-gray-500">{contact.phone}</p>
        </div>

        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${
            contact.priority === "High"
              ? "bg-red-100 text-red-700"
              : contact.priority === "Medium"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {contact.priority}
        </span>
      </div>

      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
        {contact.message}
      </p>

      <div className="mt-3 flex justify-between text-xs text-gray-400">
        <span>Score: {contact.score}</span>
        <span>{contact.category}</span>
      </div>

      <button
        onClick={() => handleDelete(contact._id)}
        className="mt-3 text-xs text-red-500 hover:underline"
      >
        Remove
      </button>
    </div>
  );
}

export default ContactCard;
