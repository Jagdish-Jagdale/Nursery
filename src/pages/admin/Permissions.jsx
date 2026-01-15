import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import {
  Search,
  Filter,
  Shield,
  User,
  Save,
  RotateCcw,
  AlertCircle,
  Check
} from "lucide-react";
import toast from "react-hot-toast";

/* --- Permission Definitions --- */
const PERMISSIONS = [
  // Dashboard & Overview
  { id: "view_dashboard", label: "View Dashboard", category: "Dashboard" },
  { id: "view_analytics", label: "View Analytics", category: "Dashboard" },
  {
    id: "export_dashboard",
    label: "Export Dashboard Data",
    category: "Dashboard",
  },

  // Plant Management
  { id: "view_plants", label: "View Plants", category: "Plant Management" },
  { id: "add_plants", label: "Add New Plants", category: "Plant Management" },
  {
    id: "edit_plants",
    label: "Edit Plant Details",
    category: "Plant Management",
  },
  { id: "delete_plants", label: "Delete Plants", category: "Plant Management" },
  {
    id: "manage_categories",
    label: "Manage Plant Categories",
    category: "Plant Management",
  },
  {
    id: "update_stock",
    label: "Update Stock Levels",
    category: "Plant Management",
  },

  // Inventory Management
  { id: "view_inventory", label: "View Inventory", category: "Inventory" },
  { id: "manage_inventory", label: "Manage Inventory", category: "Inventory" },
  { id: "stock_alerts", label: "Receive Stock Alerts", category: "Inventory" },
  { id: "bulk_import", label: "Bulk Import Products", category: "Inventory" },
  {
    id: "inventory_reports",
    label: "Generate Inventory Reports",
    category: "Inventory",
  },

  // Sales & Orders
  { id: "view_orders", label: "View Orders", category: "Sales & Orders" },
  { id: "create_orders", label: "Create Orders", category: "Sales & Orders" },
  { id: "edit_orders", label: "Edit Orders", category: "Sales & Orders" },
  { id: "cancel_orders", label: "Cancel Orders", category: "Sales & Orders" },
  {
    id: "process_refunds",
    label: "Process Refunds",
    category: "Sales & Orders",
  },
  { id: "view_invoices", label: "View Invoices", category: "Sales & Orders" },
  {
    id: "generate_invoices",
    label: "Generate Invoices",
    category: "Sales & Orders",
  },

  // Customer Management
  { id: "view_customers", label: "View Customers", category: "Customers" },
  { id: "add_customers", label: "Add Customers", category: "Customers" },
  {
    id: "edit_customers",
    label: "Edit Customer Details",
    category: "Customers",
  },
  { id: "delete_customers", label: "Delete Customers", category: "Customers" },
  {
    id: "customer_history",
    label: "View Customer History",
    category: "Customers",
  },

  // Staff Management
  { id: "view_staff", label: "View Staff", category: "Staff" },
  { id: "add_staff", label: "Add Staff Members", category: "Staff" },
  { id: "edit_staff", label: "Edit Staff Details", category: "Staff" },
  { id: "remove_staff", label: "Remove Staff", category: "Staff" },
  { id: "assign_roles", label: "Assign Roles", category: "Staff" },

  // Nursery Operations
  {
    id: "watering_schedule",
    label: "Manage Watering Schedule",
    category: "Operations",
  },
  {
    id: "fertilizer_management",
    label: "Manage Fertilizer Application",
    category: "Operations",
  },
  { id: "pest_control", label: "Manage Pest Control", category: "Operations" },
  {
    id: "maintenance_logs",
    label: "View/Edit Maintenance Logs",
    category: "Operations",
  },
  {
    id: "greenhouse_control",
    label: "Control Greenhouse Settings",
    category: "Operations",
  },

  // Financial Management
  { id: "view_revenue", label: "View Revenue Reports", category: "Financial" },
  { id: "view_expenses", label: "View Expenses", category: "Financial" },
  { id: "add_expenses", label: "Add Expenses", category: "Financial" },
  { id: "edit_pricing", label: "Edit Product Pricing", category: "Financial" },
  { id: "manage_discounts", label: "Manage Discounts", category: "Financial" },
  {
    id: "financial_reports",
    label: "Generate Financial Reports",
    category: "Financial",
  },

  // Reports & Analytics
  { id: "sales_reports", label: "View Sales Reports", category: "Reports" },
  { id: "growth_reports", label: "View Growth Reports", category: "Reports" },
  { id: "export_reports", label: "Export Reports", category: "Reports" },
  { id: "custom_reports", label: "Create Custom Reports", category: "Reports" },

  // Settings & Configuration
  {
    id: "nursery_settings",
    label: "Manage Nursery Settings",
    category: "Settings",
  },
  {
    id: "notification_settings",
    label: "Configure Notifications",
    category: "Settings",
  },
  {
    id: "payment_settings",
    label: "Manage Payment Settings",
    category: "Settings",
  },
  {
    id: "shipping_settings",
    label: "Configure Shipping Options",
    category: "Settings",
  },
  { id: "tax_settings", label: "Manage Tax Settings", category: "Settings" },
];

export default function Permissions() {
  const [search, setSearch] = useState("");
  const [selectedNursery, setSelectedNursery] = useState(null);
  const [permissions, setPermissions] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [nurseryOwners, setNurseryOwners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const q = query(
          collection(db, "owners"),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const fetchedOwners = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNurseryOwners(fetchedOwners);
      } catch (error) {
        console.error("Error fetching owners:", error);
        toast.error("Failed to load nursery owners");
      } finally {
        setLoading(false);
      }
    };

    fetchOwners();
  }, []);

  // Initialize permissions for selected nursery
  const initializePermissions = (nurseryId) => {
    if (!permissions[nurseryId]) {
      // Default permissions - basic access enabled by default
      const defaultPerms = {};
      PERMISSIONS.forEach((perm) => {
        defaultPerms[perm.id] =
          perm.id === "view_dashboard" ||
          perm.id === "view_plants" ||
          perm.id === "view_inventory" ||
          perm.id === "view_orders";
      });
      setPermissions((prev) => ({ ...prev, [nurseryId]: defaultPerms }));
    }
  };

  const handleNurserySelect = (nursery) => {
    if (hasChanges) {
      if (
        !window.confirm(
          "You have unsaved changes. Do you want to discard them?"
        )
      ) {
        return;
      }
    }
    setSelectedNursery(nursery);
    initializePermissions(nursery.id);
    setHasChanges(false);
  };

  const togglePermission = (permissionId) => {
    if (!selectedNursery) return;

    setPermissions((prev) => ({
      ...prev,
      [selectedNursery.id]: {
        ...prev[selectedNursery.id],
        [permissionId]: !prev[selectedNursery.id]?.[permissionId],
      },
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // Simulate API call
    toast.success(`Permissions saved for ${selectedNursery.nurseryName}`);
    setHasChanges(false);
  };

  const handleReset = () => {
    if (selectedNursery) {
      initializePermissions(selectedNursery.id);
      setHasChanges(false);
      toast.success("Permissions reset to default");
    }
  };

  const filteredNurseries = nurseryOwners.filter(
    (nursery) =>
      !search ||
      (nursery.ownerName && nursery.ownerName.toLowerCase().includes(search.toLowerCase())) ||
      (nursery.nurseryName && nursery.nurseryName.toLowerCase().includes(search.toLowerCase())) ||
      (nursery.email && nursery.email.toLowerCase().includes(search.toLowerCase())) ||
      (nursery.phone && nursery.phone.includes(search))
  );

  // Group permissions by category
  const groupedPermissions = PERMISSIONS.reduce((acc, perm) => {
    if (!acc[perm.category]) acc[perm.category] = [];
    acc[perm.category].push(perm);
    return acc;
  }, {});

  return (
    <div className="min-h-screen p-0 ">
      <div className="w-full px-4 py-2">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-xl mb-2 text-gray-900 font-extrabold">
            Owner Permissions
          </h3>
          <p className="text-base text-gray-600 mb-0 font-normal">
            Manage nursery owner permissions and system access levels
          </p>
        </div>
        <hr className="mt-4 mb-5 border-gray-100" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start h-[calc(100vh-180px)]">
          {/* Nursery Owners List */}
          <div className="lg:col-span-4 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
              <h6 className="mb-3 font-semibold text-base text-gray-900">
                Nursery Owners ({filteredNurseries.length})
              </h6>
              <div className="relative">
                <Search
                  className="absolute text-gray-400 left-3 top-1/2 -translate-y-1/2"
                  size={16}
                />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search nurseries..."
                  className="w-full pl-9 pr-4 py-2 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : filteredNurseries.length > 0 ? (
                filteredNurseries.map((nursery) => (
                  <div
                    key={nursery.id}
                    onClick={() => handleNurserySelect(nursery)}
                    className={`p-4 border-b border-gray-50 cursor-pointer transition-colors hover:bg-gray-50/80 ${selectedNursery?.id === nursery.id
                      ? "bg-green-50/50 border-l-4 border-l-green-500"
                      : "border-l-4 border-l-transparent"
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${nursery.status === "active"
                          ? "bg-green-50 text-green-600"
                          : "bg-gray-100 text-gray-500"
                          }`}
                      >
                        <User size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 text-base mb-0.5 truncate">
                          {nursery.ownerName || nursery.name || "Unknown Owner"}
                        </div>
                        <div className="text-sm text-gray-500 mb-1 truncate">
                          {nursery.nurseryName || "Unknown Nursery"}
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
                          <span className="truncate max-w-[120px]">{nursery.email || nursery.phone || "-"}</span>
                          <div className="flex gap-1.5">
                            <span className="px-1.5 py-0.5 rounded border border-gray-200 bg-gray-50 text-gray-600 truncate max-w-[80px]">
                              {nursery.location || "N/A"}
                            </span>
                            <span
                              className={`px-1.5 py-0.5 rounded border ${nursery.status === "active"
                                ? "bg-green-50 text-green-700 border-green-100"
                                : "bg-gray-50 text-gray-600 border-gray-200"
                                }`}
                            >
                              {nursery.status || "active"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500 text-sm">
                  No nurseries found.
                </div>
              )}
            </div>
          </div>

          {/* Permissions Panel */}
          <div className="lg:col-span-8 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
            {selectedNursery ? (
              <>
                <div className="p-4 border-b border-gray-100 bg-white flex justify-between items-start sticky top-0 z-10">
                  <div>
                    <h6 className="mb-1 font-semibold text-base text-gray-900">
                      Permissions for {selectedNursery.ownerName || selectedNursery.name || "Owner"}
                    </h6>
                    <p className="text-sm text-gray-500 mb-0">
                      {selectedNursery.nurseryName} • {selectedNursery.location || selectedNursery.email || "No Location"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleReset}
                      disabled={!hasChanges}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-full hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      style={{ borderRadius: "12px" }}
                    >
                      <RotateCcw size={14} />
                      Reset
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={!hasChanges}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                      style={{ borderRadius: "12px" }}
                    >
                      <Save size={14} />
                      Save Changes
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                  {hasChanges && (
                    <div className="mb-6 p-3 bg-orange-50 border border-orange-100 rounded-lg flex items-center gap-2 text-orange-800 text-sm">
                      <AlertCircle size={16} />
                      <span className="font-medium">You have unsaved changes</span>
                    </div>
                  )}

                  {Object.entries(groupedPermissions).map(([category, perms]) => (
                    <div key={category} className="mb-8 last:mb-0">
                      <h6 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 pb-2 border-b border-gray-100">
                        {category}
                      </h6>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {perms.map((perm) => {
                          const isChecked = permissions[selectedNursery.id]?.[perm.id] || false;
                          return (
                            <div
                              key={perm.id}
                              className="flex justify-between items-center p-3 rounded-lg bg-gray-50/50 hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all"
                            >
                              <div>
                                <div className="text-base font-medium text-gray-900">
                                  {perm.label}
                                </div>

                              </div>
                              <div
                                role="switch"
                                aria-checked={isChecked}
                                tabIndex={0}
                                onClick={() => togglePermission(perm.id)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    togglePermission(perm.id);
                                  }
                                }}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${isChecked ? 'bg-blue-600' : 'bg-gray-200'
                                  }`}
                                style={{ borderRadius: "9999px" }}
                              >
                                <span className="sr-only">Enable {perm.label}</span>
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isChecked ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                  style={{ borderRadius: "50%" }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Shield size={40} className="text-gray-300" />
                </div>
                <h5 className="font-semibold text-lg text-gray-900 mb-2">
                  Select a Nursery Owner
                </h5>
                <p className="text-base text-gray-500 max-w-xs mx-auto">
                  Choose a nursery owner from the list to manage their
                  permissions
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
