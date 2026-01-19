import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../lib/firebase";
import { updatePassword } from "firebase/auth";
import { User, Building2, Lock, Save, Camera, Mail, Phone, MapPin, X } from "lucide-react";
import toast from "react-hot-toast";

export default function OwnerSettings() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [activeTab, setActiveTab] = useState("profile");
    const [isEditing, setIsEditing] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [profileData, setProfileData] = useState({
        ownerName: "",
        email: "",
        phone: "",
        address: "",
        profileImage: "",
    });

    const [nurseryData, setNurseryData] = useState({
        nurseryName: "",
        location: "",
        nurseryImage: "",
    });

    const [passwordData, setPasswordData] = useState({
        newPassword: "",
        confirmPassword: "",
    });

    useEffect(() => {
        if (!user) return;

        const fetchOwnerData = async () => {
            try {
                const ownerDoc = await getDoc(doc(db, "owners", user.uid));
                if (ownerDoc.exists()) {
                    const data = ownerDoc.data();
                    setProfileData({
                        ownerName: data.ownerName || "",
                        email: data.email || user.email || "",
                        phone: data.phone || "",
                        address: data.address || "",
                        profileImage: data.profileImage || "",
                    });
                    setNurseryData({
                        nurseryName: data.nurseryName || "",
                        location: data.location || "",
                        nurseryImage: data.nurseryImage || "",
                    });
                }
            } catch (error) {
                console.error("Error fetching owner data:", error);
            } finally {
                setLoadingData(false);
            }
        };

        fetchOwnerData();
    }, [user]);

    // Reset editing state when tab changes
    useEffect(() => {
        setIsEditing(false);
    }, [activeTab]);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prev) => ({ ...prev, [name]: value }));
    };

    const handleNurseryChange = (e) => {
        const { name, value } = e.target;
        setNurseryData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const path = type === 'profile' ? `profile_${Date.now()}` : `nursery_${Date.now()}`;
            const storageRef = ref(storage, `owners/${user.uid}/${path}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);

            if (type === 'profile') {
                setProfileData(prev => ({ ...prev, profileImage: url }));
            } else {
                setNurseryData(prev => ({ ...prev, nurseryImage: url }));
            }

            toast.success("Image uploaded successfully!");
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Failed to upload image.");
        } finally {
            setUploading(false);
        }
    };

    const handleSaveProfile = async () => {
        if (!user) return;

        setLoading(true);
        try {
            const ownerRef = doc(db, "owners", user.uid);
            await updateDoc(ownerRef, {
                ownerName: profileData.ownerName,
                phone: profileData.phone,
                address: profileData.address,
                profileImage: profileData.profileImage,
                ...nurseryData,
            });
            toast.success("Settings updated successfully!");
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update settings.");
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (!user) return;

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters long.");
            return;
        }

        setLoading(true);
        try {
            await updatePassword(user, passwordData.newPassword);
            toast.success("Password changed successfully!");
            setPasswordData({ newPassword: "", confirmPassword: "" });
        } catch (error) {
            console.error("Error changing password:", error);
            if (error.code === "auth/requires-recent-login") {
                toast.error("Please log out and log in again to change your password.");
            } else {
                toast.error("Failed to change password.");
            }
        } finally {
            setLoading(false);
        }
    };

    const truncateText = (text, maxLength = 25) => {
        if (!text) return "";
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    };

    if (loadingData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-0 font-['Inter',sans-serif]">
            <div className="w-full px-4 py-2">
                {/* Header */}
                <div className="mb-4">
                    <h3 className="text-xl mb-2 text-gray-900 font-extrabold">Settings</h3>
                    <p className="text-base text-gray-600 mb-0 font-normal">
                        Manage your account and nursery information.
                    </p>
                </div>
                <hr className="mt-4 mb-5 border-gray-100" />

                {/* Tabs */}
                <div
                    className="flex gap-2 mb-6 bg-white border border-gray-200 p-1 w-fit shadow-sm"
                    style={{ borderRadius: "19px" }}
                >
                    <button
                        onClick={() => setActiveTab("profile")}
                        className={`px-4 py-2 text-sm font-medium transition-all  ${activeTab === "profile"
                            ? "bg-green-50 text-green-700 shadow-sm border-green-500"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-transparent"
                            }`}
                        style={{ borderRadius: "19px" }}
                    >
                        <div className="flex items-center gap-2">
                            <User size={16} />
                            Profile
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab("nursery")}
                        className={`px-4 py-2 text-sm font-medium transition-all  ${activeTab === "nursery"
                            ? "bg-green-50 text-green-700 shadow-sm border-green-500"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-transparent"
                            }`}
                        style={{ borderRadius: "19px" }}
                    >
                        <div className="flex items-center gap-2">
                            <Building2 size={16} />
                            Nursery
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab("password")}
                        className={`px-4 py-2 text-sm font-medium transition-all  ${activeTab === "password"
                            ? "bg-green-50 text-green-700 shadow-sm border-green-500"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-transparent"
                            }`}
                        style={{ borderRadius: "12px" }}
                    >
                        <div className="flex items-center gap-2">
                            <Lock size={16} />
                            Password
                        </div>
                    </button>
                </div>

                {/* Tab Content */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    {/* Profile Tab */}
                    {activeTab === "profile" && (
                        <div className="max-w-6xl mx-auto">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                                {/* Left Column: Profile Card */}
                                <div className="md:col-span-4">
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col items-center text-center h-full">
                                        <div className="relative group mb-6">
                                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-green-50 shadow-md mx-auto">
                                                {profileData.profileImage ? (
                                                    <img
                                                        src={profileData.profileImage}
                                                        alt="Profile"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                                                        <User size={48} />
                                                    </div>
                                                )}
                                            </div>

                                            {isEditing && (
                                                <label
                                                    htmlFor="profile-upload"
                                                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white"
                                                >
                                                    <Camera size={24} />
                                                    <input
                                                        id="profile-upload"
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleImageUpload(e, 'profile')}
                                                        className="hidden"
                                                        disabled={uploading}
                                                    />
                                                </label>
                                            )}

                                            {isEditing && uploading && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="text-[18px] font-bold text-gray-900 mb-1" title={profileData.ownerName}>
                                            {truncateText(profileData.ownerName || "Owner")}
                                        </div>
                                        <p className="text-sm text-gray-500 mb-6" title={profileData.email}>
                                            {truncateText(profileData.email)}
                                        </p>

                                        {!isEditing ? (
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="w-full py-2.5 px-4 bg-green-50 text-green-700 font-medium rounded-xl hover:bg-green-100 transition-colors text-sm border border-green-100 shadow-sm"
                                            >
                                                Edit Profile
                                            </button>
                                        ) : (
                                            <div className="w-full">
                                                <p className="text-xs text-green-600 font-medium bg-green-50 px-3 py-1.5 rounded-full border border-green-100 inline-block mb-3">
                                                    Editing Mode Enabled
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    Update your details on the right
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Right Column: Details Form */}
                                <div className="md:col-span-8">
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 h-full">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-lg font-bold text-gray-900">Personal Details</h3>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Full Name
                                                    </label>
                                                    <div className={`relative transition-all rounded-xl border ${!isEditing ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300 focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500'}`}>
                                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                            <User size={18} className="text-gray-400" />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            name="ownerName"
                                                            value={profileData.ownerName}
                                                            onChange={handleProfileChange}
                                                            readOnly={!isEditing}
                                                            className={`block w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-transparent sm:text-sm focus:outline-none ${!isEditing ? 'text-gray-500' : 'text-gray-900'}`}
                                                            placeholder="John Doe"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Email Address
                                                    </label>
                                                    <div className="relative rounded-xl border border-gray-200 bg-gray-50">
                                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                            <Mail size={18} className="text-gray-400" />
                                                        </div>
                                                        <input
                                                            type="email"
                                                            name="email"
                                                            value={profileData.email}
                                                            disabled
                                                            className="block w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-transparent text-gray-500 sm:text-sm focus:outline-none cursor-not-allowed"
                                                        />
                                                    </div>
                                                    <p className="mt-1.5 text-xs text-gray-400">Email cannot be changed</p>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Phone Number
                                                    </label>
                                                    <div className={`relative transition-all rounded-xl border ${!isEditing ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300 focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500'}`}>
                                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                            <Phone size={18} className="text-gray-400" />
                                                        </div>
                                                        <input
                                                            type="tel"
                                                            name="phone"
                                                            value={profileData.phone}
                                                            onChange={handleProfileChange}
                                                            readOnly={!isEditing}
                                                            className={`block w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-transparent sm:text-sm focus:outline-none ${!isEditing ? 'text-gray-500' : 'text-gray-900'}`}
                                                            placeholder="+1 (555) 000-0000"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Address
                                                    </label>
                                                    <div className={`relative transition-all rounded-xl border ${!isEditing ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300 focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500'}`}>
                                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                            <MapPin size={18} className="text-gray-400" />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            name="address"
                                                            value={profileData.address}
                                                            onChange={handleProfileChange}
                                                            readOnly={!isEditing}
                                                            className={`block w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-transparent sm:text-sm focus:outline-none ${!isEditing ? 'text-gray-500' : 'text-gray-900'}`}
                                                            placeholder="123 Nursery Lane"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {isEditing && (
                                                <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
                                                    <button
                                                        onClick={() => {
                                                            setIsEditing(false);
                                                            // Optionally reset data here if needed
                                                        }}
                                                        disabled={loading}
                                                        className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={handleSaveProfile}
                                                        disabled={loading}
                                                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-md hover:shadow-lg transition-all transform hover:scale-[1.02]"
                                                    >
                                                        {loading ? (
                                                            <>
                                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                                Saving...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Save size={18} />
                                                                Save Changes
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Nursery Tab */}
                    {activeTab === "nursery" && (
                        <div className="max-w-6xl mx-auto">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                                {/* Left Column: Nursery Card */}
                                <div className="md:col-span-4">
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col items-center text-center h-full">
                                        <div className="relative group mb-6">
                                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-green-50 shadow-md mx-auto">
                                                {nurseryData.nurseryImage ? (
                                                    <img
                                                        src={nurseryData.nurseryImage}
                                                        alt="Nursery"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                                                        <Building2 size={48} />
                                                    </div>
                                                )}
                                            </div>

                                            {isEditing && (
                                                <label
                                                    htmlFor="nursery-upload"
                                                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white"
                                                >
                                                    <Camera size={24} />
                                                    <input
                                                        id="nursery-upload"
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleImageUpload(e, 'nursery')}
                                                        className="hidden"
                                                        disabled={uploading}
                                                    />
                                                </label>
                                            )}

                                            {isEditing && uploading && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="text-[13px] font-semibold text-gray-900 mb-1" title={nurseryData.nurseryName}>
                                            {truncateText(nurseryData.nurseryName || "My Nursery")}
                                        </div>
                                        <p className="text-sm text-gray-500 mb-6" title={nurseryData.location}>
                                            {truncateText(nurseryData.location || "No Location")}
                                        </p>

                                        {!isEditing ? (
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="w-full py-2.5 px-4 bg-green-50 text-green-700 font-medium rounded-xl hover:bg-green-100 transition-colors text-sm border border-green-100 shadow-sm"
                                            >
                                                Edit Nursery
                                            </button>
                                        ) : (
                                            <div className="w-full">
                                                <p className="text-xs text-green-600 font-medium bg-green-50 px-3 py-1.5 rounded-full border border-green-100 inline-block mb-3">
                                                    Editing Mode Enabled
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    Update nursery details on the right
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Right Column: Nursery Details Form */}
                                <div className="md:col-span-8">
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 h-full">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-lg font-bold text-gray-900">Nursery Information</h3>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 gap-6">
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Nursery Name
                                                    </label>
                                                    <div className={`relative transition-all rounded-xl border ${!isEditing ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300 focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500'}`}>
                                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                            <Building2 size={18} className="text-gray-400" />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            name="nurseryName"
                                                            value={nurseryData.nurseryName}
                                                            onChange={handleNurseryChange}
                                                            readOnly={!isEditing}
                                                            className={`block w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-transparent sm:text-sm focus:outline-none ${!isEditing ? 'text-gray-500' : 'text-gray-900'}`}
                                                            placeholder="Green Valley Nursery"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Location
                                                    </label>
                                                    <div className={`relative transition-all rounded-xl border ${!isEditing ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300 focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500'}`}>
                                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                            <MapPin size={18} className="text-gray-400" />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            name="location"
                                                            value={nurseryData.location}
                                                            onChange={handleNurseryChange}
                                                            readOnly={!isEditing}
                                                            className={`block w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-transparent sm:text-sm focus:outline-none ${!isEditing ? 'text-gray-500' : 'text-gray-900'}`}
                                                            placeholder="Pune, Maharashtra"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {isEditing && (
                                                <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
                                                    <button
                                                        onClick={() => {
                                                            setIsEditing(false);
                                                        }}
                                                        disabled={loading}
                                                        className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={handleSaveProfile}
                                                        disabled={loading}
                                                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-md hover:shadow-lg transition-all transform hover:scale-[1.02]"
                                                    >
                                                        {loading ? (
                                                            <>
                                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                                Saving...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Save size={18} />
                                                                Save Changes
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Password Tab */}
                    {activeTab === "password" && (
                        <div className="max-w-2xl space-y-5">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 mb-1">Change Password</h2>
                                <p className="text-sm text-gray-500">Ensure your account is secure.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-sm"
                                    placeholder="Enter new password"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-sm"
                                    placeholder="Confirm new password"
                                />
                            </div>

                            <div className="pt-2">
                                <button
                                    onClick={handleChangePassword}
                                    disabled={loading || !passwordData.newPassword || !passwordData.confirmPassword}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all transform hover:scale-[1.02] text-sm"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Changing Password...
                                        </>
                                    ) : (
                                        <>
                                            <Lock size={18} />
                                            Change Password
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
