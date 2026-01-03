import { useState } from "react";

function ContactList({ contacts, onDeleteContact, onEditContact }) {
  const [sortBy, setSortBy] = useState("recent");
  const [filterCategory, setFilterCategory] = useState("all");

  // Safe sorting and filtering
  const sortedContacts = [...(contacts || [])]
    .filter((c) => filterCategory === "all" || c?.category === filterCategory)
    .sort((a, b) => {
      if (sortBy === "recent")
        return new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0);
      if (sortBy === "name") return (a?.name || "").localeCompare(b?.name || "");
      if (sortBy === "score") return (b?.score || 0) - (a?.score || 0);
      return 0;
    });

  const priorityClasses = {
    High: "bg-red-100 text-red-700",
    Medium: "bg-yellow-100 text-yellow-800",
    Low: "bg-gray-200 text-gray-700",
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    const days = Math.floor((Date.now() - date) / 86400000);
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Contacts</h2>
          <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            {sortedContacts.length} total
          </span>
        </div>

        {/* Filters & Sort */}
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase text-gray-500">
              Filter
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="Lead">Leads</option>
              <option value="Client">Clients</option>
              <option value="Partner">Partners</option>
              <option value="Vendor">Vendors</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase text-gray-500">
              Sort
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="recent">Most Recent</option>
              <option value="name">Name (A–Z)</option>
              <option value="score">Highest Score</option>
            </select>
          </div>
        </div>
      </div>

      {/* No Contacts */}
      {sortedContacts.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <svg
            className="w-12 h-12 mx-auto mb-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
            />
            <circle cx="9" cy="7" r="4" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
            />
          </svg>
          <h3 className="text-lg font-semibold mb-2">No contacts yet</h3>
          <p>Add your first contact to get started with intelligent contact management.</p>
        </div>
      ) : (
        // Contacts Grid
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedContacts.map((contact) => (
            <div
              key={contact?._id || Math.random()}
              className="bg-white border border-gray-200 rounded shadow-sm hover:shadow-md transition flex flex-col"
            >
              {/* Top section */}
              <div className="flex items-start gap-3 p-5 border-b">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-lg flex-shrink-0">
                  {contact?.name ? contact.name.charAt(0).toUpperCase() : "?"}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {contact?.name || "Unnamed Contact"}
                  </h3>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    <span className="text-xs px-2 py-0.5 bg-gray-100 rounded uppercase font-semibold text-gray-600">
                      {contact?.category || "Lead"}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded font-semibold ${
                        priorityClasses[contact?.priority] || "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {contact?.priority || "Medium"}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-100 px-3 py-2 rounded text-center flex-shrink-0">
                  <div className="text-lg font-bold text-blue-600">
                    {contact?.score ?? 0}
                  </div>
                  <div className="text-[10px] uppercase text-gray-500">score</div>
                </div>
              </div>

              {/* Contact info */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="mb-3">
                  <p className="text-xs font-semibold uppercase text-gray-500">Email</p>
                  <a
                    href={`mailto:${contact?.email || ""}`}
                    className="text-sm text-blue-600 hover:underline break-all"
                  >
                    {contact?.email || "No Email"}
                  </a>
                </div>

                <div className="mb-3">
                  <p className="text-xs font-semibold uppercase text-gray-500">Phone</p>
                  <a
                    href={`tel:${contact?.phone || ""}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {contact?.phone || "No Phone"}
                  </a>
                </div>

                {contact?.message && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold uppercase text-gray-500">Message</p>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {contact.message}
                    </p>
                  </div>
                )}

                {/* Bottom actions */}
                <div className="mt-auto pt-4 border-t flex items-center justify-between">
                  <span className="text-xs text-gray-500">{formatDate(contact?.createdAt)}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEditContact(contact)}
                      className="border border-gray-300 text-gray-700 px-3 py-1 rounded text-xs font-medium hover:bg-blue-600 hover:text-white hover:border-blue-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteContact(contact?._id)}
                      className="border border-gray-300 text-gray-700 px-3 py-1 rounded text-xs font-medium hover:bg-red-600 hover:text-white hover:border-red-600 transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ContactList;
