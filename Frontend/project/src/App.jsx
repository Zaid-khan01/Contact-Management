import { useState, useEffect, useRef } from "react";
import ContactForm from "./components/ContactForm";
import ContactList from "./components/ContactList";
import { getContacts, deleteContact } from "./api";
import "./App.css";

function App() {
  const [contacts, setContacts] = useState([]); // always array
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const formRef = useRef(null);

  useEffect(() => {
    fetchAllContacts();
  }, []);

  const fetchAllContacts = async () => {
    setLoading(true);
    try {
      const response = await getContacts();

      if (Array.isArray(response.data)) {
        setContacts(response.data);
      } else {
        setContacts([]);
      }
    } catch (error) {
      console.error(
        "Error fetching contacts:",
        error.response?.data || error.message
      );
      setContacts([]); 
    } finally {
      setLoading(false);
    }
  };

  // SAFE ADD
  const handleContactAdded = (newContact) => {
    if (!newContact || !newContact._id) return;
    setContacts((prev) => [newContact, ...prev]);
    setShowForm(false);
  };

  // SAFE UPDATE
  const handleContactUpdated = (updatedContact) => {
    if (!updatedContact || !updatedContact._id) return;

    setContacts((prev) =>
      prev.map((contact) =>
        contact._id === updatedContact._id ? updatedContact : contact
      )
    );
    setEditingContact(null);
    setShowForm(false);
  };

  const handleEditContact = (contact) => {
    if (!contact || !contact._id) return;

    setEditingContact(contact);
    setShowForm(true);

    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  const handleCancelEdit = () => {
    setEditingContact(null);
  };

  // AFE DELETE 
  const handleDeleteContact = async (id) => {
    if (!id) return;

    try {
      await deleteContact(id);
      setContacts((prev) => prev.filter((contact) => contact._id !== id));
    } catch (error) {
      console.error(
        "Error deleting contact:",
        error.response?.data || error.message
      );
      alert("Failed to delete contact. Check console for details.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="h-10 w-10 rounded-full border-4 border-blue-500 border-t-transparent animate-spin mb-4" />
        <p className="text-gray-600 text-sm font-medium">
          Loading contacts...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:h-screen bg-gray-50 flex flex-col">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              SC
            </div>
            <span className="font-semibold text-gray-900 text-sm tracking-wide">
              Smart Contacts
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setShowForm((prev) => !prev);
                if (showForm) setEditingContact(null);
              }}
              className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700 transition"
            >
              {showForm ? "Close" : "New Contact"}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-visible lg:overflow-hidden">
        <div
          className={`max-w-7xl mx-auto h-full px-4 py-6 grid gap-8 ${
            showForm
              ? "grid-cols-1 lg:grid-cols-[380px_1fr]"
              : "grid-cols-1"
          }`}
        >
          {showForm && (
            <div
              ref={formRef}
              className="lg:h-full lg:overflow-y-auto no-scrollbar pr-2"
            >
              <ContactForm
                onContactAdded={handleContactAdded}
                onContactUpdated={handleContactUpdated}
                editingContact={editingContact}
                onCancelEdit={handleCancelEdit}
              />
            </div>
          )}

          <div className="lg:h-full lg:overflow-y-auto no-scrollbar">
            <ContactList
              contacts={contacts.filter(
                (c) => c && c._id // ONLY REAL CONTACTS
              )}
              onDeleteContact={handleDeleteContact}
              onEditContact={handleEditContact}
              isFormOpen={showForm}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
