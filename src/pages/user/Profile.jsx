import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  User,
  Heart,
  Edit2,
  Plus,
  Trash2,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Camera,
  Package,
  Award,
  Shield,
  Settings,
  Bell,
  Briefcase,
  Globe,
  CreditCard,
  Star,
  ChevronRight,
  Check,
  X,
  Lock,
  LogOut,
  HelpCircle,
  TrendingUp,
} from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);

  const [personalInfo, setPersonalInfo] = useState({
    fullName: user?.displayName || "John Doe",
    email: user?.email || "john.doe@example.com",
    phone: "+91 98765 43210",
    dateOfBirth: "1995-06-15",
    gender: "Male",
    alternatePhone: "",
    occupation: "Software Engineer",
    company: "Tech Corp",
    bio: "Passionate about bringing greenery into urban spaces. Love exploring rare plant species and sustainable gardening practices.",
  });

  const [addresses] = useState([
    {
      id: 1,
      type: "Home",
      name: "John Doe",
      address: "123 Garden Street, Green Valley",
      city: "Mumbai",
      pin: "400001",
      phone: "+91 98765 43210",
      isDefault: true,
    },
    {
      id: 2,
      type: "Work",
      name: "John Doe",
      address: "456 Tech Park, Andheri East",
      city: "Mumbai",
      pin: "400069",
      phone: "+91 87654 32109",
      isDefault: false,
    },
  ]);

  const [favorites] = useState([
    {
      id: 1,
      name: "Monstera Deliciosa",
      price: 850,
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=200",
    },
    {
      id: 2,
      name: "Fiddle Leaf Fig",
      price: 1200,
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1617173944883-fa3c44e999c8?auto=format&fit=crop&q=80&w=200",
    },
    {
      id: 3,
      name: "Snake Plant",
      price: 450,
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1620127598463-b829da48b673?auto=format&fit=crop&q=80&w=200",
    },
    {
      id: 4,
      name: "Peace Lily",
      price: 550,
      rating: 4.6,
      image:
        "https://images.unsplash.com/photo-1593691509543-c55fb32e6c8d?auto=format&fit=crop&q=80&w=200",
    },
  ]);

  const handleInputChange = (field, value) => {
    setPersonalInfo((prev) => ({ ...prev, [field]: value }));
  };

  const menuItems = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "favorites", label: "Wishlist", icon: Heart },
  ];

  const quickLinks = [
    { label: "My Orders", icon: Package, count: 12 },
    { label: "Notifications", icon: Bell, count: 3 },
    { label: "Payment Methods", icon: CreditCard },
    { label: "Settings", icon: Settings },
  ];

  return (
    <div
      className="min-h-screen bg-[#fafafa]"
      style={{
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {/* Cover with subtle pattern */}
              <div className="h-28 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 relative">
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                ></div>
              </div>

              <div className="px-6 pb-6 -mt-12 relative">
                <div className="inline-block relative">
                  <div className="w-24 h-24 rounded-2xl bg-white p-1.5 shadow-xl">
                    <div className="w-full h-full rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-inner">
                      <span className="text-3xl font-bold text-white">
                        {personalInfo.fullName[0]}
                      </span>
                    </div>
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white border-2 border-gray-100 rounded-xl flex items-center justify-center text-gray-700 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-all shadow-lg group">
                    <Camera
                      size={14}
                      strokeWidth={2.5}
                      className="group-hover:scale-110 transition-transform"
                    />
                  </button>
                </div>

                <div className="mt-4">
                  <h3 className="text-base font-semibold text-gray-900">
                    {personalInfo.fullName}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {personalInfo.email}
                  </p>

                  <div className="mt-2 inline-flex items-center gap-1.5 text-[10px] text-emerald-700 bg-emerald-50/80 px-2 py-0.5 rounded-md font-medium border border-emerald-100">
                    <Shield size={10} strokeWidth={2.5} />
                    Verified Member
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 border-t border-gray-100">
                {[
                  {
                    value: "12",
                    label: "Orders",
                    icon: Package,
                    color: "text-blue-600",
                    bg: "bg-blue-50",
                  },
                  {
                    value: favorites.length,
                    label: "Saved",
                    icon: Heart,
                    color: "text-pink-600",
                    bg: "bg-pink-50",
                  },
                  {
                    value: "240",
                    label: "Points",
                    icon: TrendingUp,
                    color: "text-amber-600",
                    bg: "bg-amber-50",
                  },
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className={`py-4 text-center ${idx !== 2 ? "border-r border-gray-100" : ""
                      } hover:bg-gray-50/50 transition-colors cursor-pointer group`}
                  >
                    <div
                      className={`w-8 h-8 ${stat.bg} rounded-lg mx-auto mb-1.5 flex items-center justify-center group-hover:scale-110 transition-transform`}
                    >
                      <stat.icon
                        size={14}
                        className={stat.color}
                        strokeWidth={2.5}
                      />
                    </div>
                    <p className={`text-base font-bold ${stat.color}`}>
                      {stat.value}
                    </p>
                    <p className="text-[10px] text-gray-500 font-medium">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-2 shadow-sm">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all mb-1 last:mb-0 ${activeTab === item.id
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/25"
                    : "text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  <span className="flex items-center gap-2.5">
                    <item.icon size={18} strokeWidth={2.5} />
                    {item.label}
                  </span>
                  {activeTab === item.id && (
                    <ChevronRight size={16} strokeWidth={2.5} />
                  )}
                </button>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-3 shadow-sm">
              <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-2 mb-2">
                Quick Actions
              </h4>
              {quickLinks.map((link, idx) => (
                <button
                  key={idx}
                  className="w-full flex items-center justify-between px-2.5 py-2.5 text-sm text-gray-700 hover:text-emerald-600 hover:bg-gray-50 rounded-lg transition-all mb-0.5 last:mb-0"
                >
                  <span className="flex items-center gap-2.5">
                    <link.icon
                      size={16}
                      className="text-gray-400"
                      strokeWidth={2}
                    />
                    <span className="font-medium">{link.label}</span>
                  </span>
                  {link.count && (
                    <span className="min-w-[20px] h-5 text-[10px] font-bold bg-emerald-600 text-white rounded-full flex items-center justify-center px-1.5">
                      {link.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-12 lg:col-span-9">
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
              {/* Personal Info Tab */}
              {activeTab === "personal" && (
                <>
                  {/* Header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Personal Information
                      </h2>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Manage your personal details and preferences
                      </p>
                    </div>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition-colors shadow-sm hover:shadow-md"
                      >
                        <Edit2 size={16} strokeWidth={2.5} /> Edit Profile
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setIsEditing(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
                        >
                          <X size={16} strokeWidth={2.5} /> Cancel
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition-colors shadow-sm hover:shadow-md"
                        >
                          <Check size={16} strokeWidth={2.5} /> Save Changes
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Basic Info */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                          <User
                            size={14}
                            className="text-gray-600"
                            strokeWidth={2.5}
                          />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">
                            Basic Information
                          </h3>
                          <p className="text-[10px] text-gray-500">
                            Your personal details
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={personalInfo.fullName}
                            onChange={(e) =>
                              handleInputChange("fullName", e.target.value)
                            }
                            readOnly={!isEditing}
                            className={`w-full px-4 py-3 text-sm rounded-xl border transition-all ${isEditing
                              ? "bg-white border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                              : "bg-gray-50 border-gray-200 text-gray-600"
                              }`}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                            Gender
                          </label>
                          <select
                            value={personalInfo.gender}
                            onChange={(e) =>
                              handleInputChange("gender", e.target.value)
                            }
                            disabled={!isEditing}
                            className={`w-full px-4 py-3 text-sm rounded-xl border transition-all ${isEditing
                              ? "bg-white border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                              : "bg-gray-50 border-gray-200 text-gray-600"
                              }`}
                          >
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                            <option>Prefer not to say</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                            Date of Birth
                          </label>
                          <input
                            type="date"
                            value={personalInfo.dateOfBirth}
                            onChange={(e) =>
                              handleInputChange("dateOfBirth", e.target.value)
                            }
                            readOnly={!isEditing}
                            className={`w-full px-4 py-3 text-sm rounded-xl border transition-all ${isEditing
                              ? "bg-white border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                              : "bg-gray-50 border-gray-200 text-gray-600"
                              }`}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-100"></div>

                    {/* Contact Info */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                          <Mail
                            size={14}
                            className="text-blue-600"
                            strokeWidth={2.5}
                          />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">
                            Contact Information
                          </h3>
                          <p className="text-[10px] text-gray-500">
                            How we can reach you
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                            Email Address
                          </label>
                          <div className="relative">
                            <input
                              type="email"
                              value={personalInfo.email}
                              readOnly
                              className="w-full px-4 py-3 pr-10 text-sm rounded-xl border bg-gray-50 border-gray-200 text-gray-500"
                            />
                            <Lock
                              size={16}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                              strokeWidth={2}
                            />
                          </div>
                          <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-1">
                            <Shield size={10} strokeWidth={2.5} /> Email address
                            is protected
                          </p>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={personalInfo.phone}
                            onChange={(e) =>
                              handleInputChange("phone", e.target.value)
                            }
                            readOnly={!isEditing}
                            className={`w-full px-4 py-3 text-sm rounded-xl border transition-all ${isEditing
                              ? "bg-white border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                              : "bg-gray-50 border-gray-200 text-gray-600"
                              }`}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-100"></div>

                    {/* Professional Info */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                          <Briefcase
                            size={14}
                            className="text-purple-600"
                            strokeWidth={2.5}
                          />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">
                            Professional Details
                          </h3>
                          <p className="text-[10px] text-gray-500">
                            Your work and occupation
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                            Occupation
                          </label>
                          <input
                            type="text"
                            value={personalInfo.occupation}
                            onChange={(e) =>
                              handleInputChange("occupation", e.target.value)
                            }
                            placeholder="e.g., Software Engineer"
                            readOnly={!isEditing}
                            className={`w-full px-4 py-3 text-sm rounded-xl border transition-all ${isEditing
                              ? "bg-white border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none placeholder:text-gray-400"
                              : "bg-gray-50 border-gray-200 text-gray-600"
                              }`}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                            Company
                          </label>
                          <input
                            type="text"
                            value={personalInfo.company}
                            onChange={(e) =>
                              handleInputChange("company", e.target.value)
                            }
                            placeholder="e.g., Tech Corp"
                            readOnly={!isEditing}
                            className={`w-full px-4 py-3 text-sm rounded-xl border transition-all ${isEditing
                              ? "bg-white border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none placeholder:text-gray-400"
                              : "bg-gray-50 border-gray-200 text-gray-600"
                              }`}
                          />
                        </div>
                      </div>
                    </div>


                  </div>
                </>
              )}

              {/* Addresses Tab */}
              {activeTab === "addresses" && (
                <>
                  <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Delivery Addresses
                      </h2>
                      <p className="text-sm text-gray-500 mt-0.5">
                        Manage your saved addresses
                      </p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition-colors shadow-sm hover:shadow-md">
                      <Plus size={16} strokeWidth={2.5} /> Add Address
                    </button>
                  </div>
                  <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`relative p-6 rounded-2xl border-2 transition-all hover:shadow-lg ${addr.isDefault
                          ? "border-emerald-500 bg-emerald-50/30"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                          }`}
                      >
                        {addr.isDefault && (
                          <span className="absolute top-4 right-4 text-[10px] font-bold text-white bg-emerald-600 px-2 py-1 rounded-md uppercase tracking-wide">
                            Default
                          </span>
                        )}
                        <div className="flex gap-4">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${addr.isDefault
                              ? "bg-emerald-600 text-white"
                              : "bg-gray-100 text-gray-600"
                              }`}
                          >
                            <MapPin size={20} strokeWidth={2.5} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 text-base">
                              {addr.type}
                            </h4>
                            <p className="text-sm text-gray-700 mt-1 font-medium">
                              {addr.name}
                            </p>
                            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                              {addr.address}
                            </p>
                            <p className="text-sm text-gray-600">
                              {addr.city} - {addr.pin}
                            </p>
                            <p className="text-sm text-gray-500 mt-2 flex items-center gap-1.5">
                              <Phone size={12} strokeWidth={2.5} /> {addr.phone}
                            </p>
                            <div className="flex gap-4 mt-4 pt-4 border-t border-gray-200">
                              <button className="text-sm text-emerald-600 font-medium hover:text-emerald-700 flex items-center gap-1">
                                <Edit2 size={13} strokeWidth={2.5} /> Edit
                              </button>
                              <button className="text-sm text-red-500 font-medium hover:text-red-600 flex items-center gap-1">
                                <Trash2 size={13} strokeWidth={2.5} /> Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Wishlist Tab */}
              {activeTab === "favorites" && (
                <>
                  <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        My Wishlist
                      </h2>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {favorites.length} items saved for later
                      </p>
                    </div>
                  </div>
                  <div className="p-8 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {favorites.map((item) => (
                      <div
                        key={item.id}
                        className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all hover:-translate-y-1"
                      >
                        <div className="aspect-square bg-gray-100 relative overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <button className="absolute top-3 right-3 w-9 h-9 bg-white/95 backdrop-blur rounded-xl flex items-center justify-center text-red-500 shadow-lg hover:scale-110 transition-all">
                            <Heart
                              size={16}
                              fill="currentColor"
                              strokeWidth={2}
                            />
                          </button>
                        </div>
                        <div className="p-4">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">
                            {item.name}
                          </h4>
                          <div className="flex items-center gap-1.5 mt-2">
                            <Star
                              size={13}
                              className="text-amber-400 fill-amber-400"
                              strokeWidth={2}
                            />
                            <span className="text-sm text-gray-600 font-medium">
                              {item.rating}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                            <span className="text-lg font-bold text-emerald-600">
                              ₹{item.price}
                            </span>
                            <button className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-sm">
                              Add
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
