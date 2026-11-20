
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Users,
  UserRound,
  Eye,
  X,
  CalendarDays,
  Mail,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const formatDate = (date) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString("en-LK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/users/admin/customers`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch customers.");
      }

      setCustomers(data.customers || []);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    if (!searchText) return customers;

    return customers.filter(
      (customer) =>
        customer.fullName?.toLowerCase().includes(searchText) ||
        customer.email?.toLowerCase().includes(searchText) ||
        customer._id?.toLowerCase().includes(searchText)
    );
  }, [customers, search]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm text-[#d6bd91] tracking-widest uppercase mb-2">
            Store Management
          </p>

          <h1 className="text-3xl font-semibold">Customers</h1>

          <p className="text-gray-400 text-sm mt-2">
            View and manage your registered customers.
          </p>
        </div>

        <button
          onClick={fetchCustomers}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-white/10 hover:border-[#d6bd91] text-sm transition disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh Customers
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
          <AlertCircle size={20} />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[#111111] border border-white/10 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">Total Customers</p>
            <Users size={22} className="text-[#d6bd91]" />
          </div>

          <h2 className="text-3xl font-semibold mt-4">
            {loading ? "..." : customers.length}
          </h2>

          <p className="text-xs text-gray-500 mt-2">
            Registered customer accounts
          </p>
        </div>

        <div className="bg-[#111111] border border-white/10 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">Showing Customers</p>
            <UserRound size={22} className="text-blue-400" />
          </div>

          <h2 className="text-3xl font-semibold mt-4">
            {loading ? "..." : filteredCustomers.length}
          </h2>

          <p className="text-xs text-gray-500 mt-2">
            Customers matching your search
          </p>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-[#111111] border border-white/10 rounded-xl overflow-hidden">
        <div className="p-5 md:p-6 border-b border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">
                All Customers
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {filteredCustomers.length} customers found
              </p>
            </div>

            <div className="relative w-full sm:w-80">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, email or ID..."
                className="w-full bg-[#0b0b0b] border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm outline-none focus:border-[#d6bd91]"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-gray-400">
            <RefreshCw
              size={28}
              className="animate-spin mx-auto mb-3"
            />
            Loading customers...
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="py-20 text-center">
            <Users
              size={40}
              className="mx-auto text-gray-600 mb-4"
            />

            <h3 className="text-lg font-medium">
              No customers found
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              Try another search term.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead className="bg-[#0b0b0b] text-gray-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Customer ID</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {filteredCustomers.map((customer) => (
                  <tr
                    key={customer._id}
                    className="hover:bg-white/[0.02] transition"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#d6bd91]/10 text-[#d6bd91] flex items-center justify-center font-semibold">
                          {customer.fullName?.charAt(0)?.toUpperCase() || "C"}
                        </div>

                        <div>
                          <p className="text-sm font-medium">
                            {customer.fullName}
                          </p>

                          <p className="text-xs text-gray-500 mt-1">
                            {customer.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-sm text-gray-400">
                      {customer._id.slice(-8).toUpperCase()}
                    </td>

                    <td className="px-6 py-5 text-sm text-gray-400">
                      {formatDate(customer.createdAt)}
                    </td>

                    <td className="px-6 py-5">
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border border-blue-500/20 bg-blue-500/10 text-blue-400">
                        <UserRound size={13} />
                        Customer
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <button
                        onClick={() => setSelectedCustomer(customer)}
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#d6bd91] transition"
                      >
                        <Eye size={17} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedCustomer(null)}
        >
          <div
            className="bg-[#151515] border border-white/10 rounded-xl w-full max-w-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div>
                <p className="text-xs text-[#d6bd91] uppercase tracking-widest">
                  Customer Details
                </p>

                <h2 className="text-lg font-semibold mt-1">
                  Customer Profile
                </h2>
              </div>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-gray-400 hover:text-white"
              >
                <X size={22} />
              </button>
            </div>

            <div className="p-6">
              <div className="flex flex-col items-center text-center mb-7">
                <div className="w-20 h-20 rounded-full bg-[#d6bd91]/10 text-[#d6bd91] flex items-center justify-center text-3xl font-semibold">
                  {selectedCustomer.fullName?.charAt(0)?.toUpperCase() || "C"}
                </div>

                <h3 className="text-xl font-semibold mt-4">
                  {selectedCustomer.fullName}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Registered Customer
                </p>
              </div>

              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <Mail size={19} className="text-[#d6bd91] mt-1" />

                  <div>
                    <p className="text-xs text-gray-500">Email Address</p>
                    <p className="text-sm mt-1 break-all">
                      {selectedCustomer.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CalendarDays
                    size={19}
                    className="text-[#d6bd91] mt-1"
                  />

                  <div>
                    <p className="text-xs text-gray-500">Registered Date</p>
                    <p className="text-sm mt-1">
                      {formatDate(selectedCustomer.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ShieldCheck
                    size={19}
                    className="text-[#d6bd91] mt-1"
                  />

                  <div>
                    <p className="text-xs text-gray-500">Account Role</p>
                    <p className="text-sm mt-1">
                      {selectedCustomer.role}
                    </p>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <p className="text-xs text-gray-500">Customer ID</p>
                  <p className="text-sm mt-2 break-all text-gray-300">
                    {selectedCustomer._id}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
