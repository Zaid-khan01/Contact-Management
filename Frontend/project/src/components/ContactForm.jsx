import { useState, useEffect } from "react";

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
      // Reset form when not editing
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

  const validateForm = () => {
    const e = {};
    if (!formData.name.trim()) e.name = "Name is required";
    if (!formData.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      e.email = "Invalid email format";
    if (!formData.phone.trim()) e.phone = "Phone is required";
    else if (formData.phone.length < 10)
      e.phone = "Phone must be at least 10 digits";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const url = editingContact
        ? `https://contact-management-9yc1.onrender.com/api/contacts/${editingContact._id}`
        : "https://contact-management-9yc1.onrender.com/api/contacts";

      const method = editingContact ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, score }),
      });

      if (res.ok) {
        const contact = await res.json();
        if (editingContact) {
          onContactUpdated(contact);
        } else {
          onContactAdded(contact);
        }
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
          category: "Lead",
          priority: "Medium",
        });
        setScore(0);
      }
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
    formData.phone.length >= 10;

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
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            NAME *
          </label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
              errors.name
                ? "border-red-400 focus:ring-red-300"
                : "border-gray-300 focus:ring-blue-500"
            }`}
          />
          {errors.name && (
            <p className="text-xs text-red-600 mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            EMAIL *
          </label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@company.com"
            className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
              errors.email
                ? "border-red-400 focus:ring-red-300"
                : "border-gray-300 focus:ring-blue-500"
            }`}
          />
          {errors.email && (
            <p className="text-xs text-red-600 mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            PHONE *
          </label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91 9876543210"
            className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
              errors.phone
                ? "border-red-400 focus:ring-red-300"
                : "border-gray-300 focus:ring-blue-500"
            }`}
          />
          {errors.phone && (
            <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
          )}
        </div>

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
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
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
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        <div className="rounded-lg border bg-gray-50 p-4">
          <div className="flex justify-between text-xs font-semibold text-gray-600 mb-2">
            <span>INTELLIGENCE SCORE</span>
            <span>{score}/100</span>
          </div>
          <div className="h-2 w-full bg-gray-200 rounded">
            <div
              className={`h-full rounded transition-all ${scoreColor}`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="flex-1 rounded-md bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? editingContact
                ? "Updating..."
                : "Adding..."
              : editingContact
              ? "Update Contact"
              : "Add Contact"}
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