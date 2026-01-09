import { useState, useEffect } from "react";
import { createContact, updateContact } from "../api";

function ContactForm({ onContactAdded, onContactUpdated, editingContact, onCancelEdit }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    category: "Lead",
    priority: "Medium",
  });

  const [errors, setErrors] = useState({});
  const [score, setScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (editingContact) {
      setFormData({
        name: editingContact.name,
        email: editingContact.email,
        phone: editingContact.phone,
        message: editingContact.message || "",
        category: editingContact.category,
        priority: editingContact.priority,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        category: "Lead",
        priority: "Medium",
      });
    }
  }, [editingContact]);

  // Calculate intelligence score
  useEffect(() => {
    let s = 0;
    if (formData.name.trim()) s += 25;
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) s += 25;
    if (formData.phone.trim().length >= 10) s += 25;
    if (formData.message.trim()) s += 15;
    if (formData.category) s += 5;
    if (formData.priority) s += 5;
    setScore(s);
  }, [formData]);

  // Form validation
  const validateForm = () => {
    const e = {};
    if (!formData.name.trim()) e.name = "Name is required";
    if (!formData.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      e.email = "Invalid email format";
    if (!formData.phone.trim()) e.phone = "Phone is required";
    else if (formData.phone.replace(/\D/g, '').length < 10)
      e.phone = "Phone must be at least 10 digits";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error for this field when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      if (editingContact) {
        const res = await updateContact(editingContact._id, { ...formData, score });
        onContactUpdated(res.data);
      } else {
        const res = await createContact({ ...formData, score });
        onContactAdded(res.data);
      }

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        category: "Lead",
        priority: "Medium",
      });
      setScore(0);
      setErrors({});
    } catch (error) {
      console.error("Failed to save contact:", error.response?.data || error.message);
      // You could add an error state here to show in the UI
      alert("Failed to save contact. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
      category: "Lead",
      priority: "Medium",
    });
    setScore(0);
    setErrors({});
    onCancelEdit();
  };

  const isFormValid =
    formData.name &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
    formData.phone.replace(/\D/g, '').length >= 10;

  const scoreColor =
    score >= 75 ? "bg-green-600" : score >= 50 ? "bg-yellow-500" : "bg-red-600";

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-6 py-5 border-b">
        <h2 className="text-lg font-semibold text-gray-900">
          {editingContact ? "Edit Contact" : "New Contact"}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {editingContact
            ? "Update contact details below"
            : "Capture details and get instant intelligence scoring"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Name */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            NAME *
          </label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 transition ${
              errors.name 
                ? "border-red-400 focus:ring-red-300" 
                : "border-gray-300 focus:ring-blue-500"
            }`}
          />
          {errors.name && (
            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              {errors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            EMAIL *
          </label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@company.com"
            className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 transition ${
              errors.email 
                ? "border-red-400 focus:ring-red-300" 
                : "border-gray-300 focus:ring-blue-500"
            }`}
          />
          {errors.email && (
            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              {errors.email}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            PHONE *
          </label>
          <input
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91 9876543210"
            className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 transition ${
              errors.phone 
                ? "border-red-400 focus:ring-red-300" 
                : "border-gray-300 focus:ring-blue-500"
            }`}
          />
          {errors.phone && (
            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              {errors.phone}
            </p>
          )}
        </div>

        {/* Message */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            MESSAGE
          </label>
          <textarea
            name="message"
            rows="3"
            value={formData.message}
            onChange={handleChange}
            placeholder="Context, notes, or background info"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {/* Category & Priority */}
        <div className="grid grid-cols-2 gap-3">
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          >
            <option>Lead</option>
            <option>Client</option>
            <option>Partner</option>
            <option>Vendor</option>
          </select>

          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        {/* Intelligence Score */}
        <div className="rounded-lg border bg-gray-50 p-4">
          <div className="flex justify-between text-xs font-semibold text-gray-600 mb-2">
            <span>INTELLIGENCE SCORE</span>
            <span>{score}/100</span>
          </div>
          <div className="h-2 w-full bg-gray-200 rounded overflow-hidden">
            <div 
              className={`h-full rounded transition-all duration-500 ${scoreColor}`} 
              style={{ width: `${score}%` }} 
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {score >= 75 ? "Excellent quality contact!" : 
             score >= 50 ? "Good contact information" : 
             "Add more details to improve score"}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="flex-1 rounded-md bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting && (
              <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            )}
            {isSubmitting 
              ? (editingContact ? "Updating..." : "Adding...") 
              : (editingContact ? "Update Contact" : "Add Contact")
            }
          </button>

          {editingContact && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 rounded-md border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default ContactForm;