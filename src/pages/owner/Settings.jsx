import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { updatePassword } from "firebase/auth";
import { User, Building2, Lock, Save } from "lucide-react";
import toast from "react-hot-toast";

export default function OwnerSettings() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [activeTab, setActiveTab] = useState("profile");

    const [profileData, setProfileData] = useState({
        ownerName: "",
        email: "",
        phone: "",
    });

    const [nurseryData, setNurseryData] = useState({
        nurseryName: "",
        location: "",
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
                    });
                    setNurseryData({
                        nurseryName: data.nurseryName || "",
                        location: data.location || "",
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

    const handleSaveProfile = async () => {
        if (!user) return;

        setLoading(true);
        try {
            const ownerRef = doc(db, "owners", user.uid);
            await updateDoc(ownerRef, {
                ownerName: profileData.ownerName,
                phone: profileData.phone,
                ...nurseryData,
            });
            toast.success("Settings updated successfully!");
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

    if (loadingData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-white py-2 px-4 font-['Inter',sans-serif]">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h3 className="text-xl mb-2 text-gray-900 font-extrabold">Settings</h3>
                    <p className="text-base text-gray-600 mb-0 font-normal">
                        Manage your account and nursery information.
                    </p>
                    <hr className="mt-4 border-gray-100 opacity-50" />
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab("profile")}
                        className={`px-6 py-3 font-medium transition-all ${activeTab === "profile"
                            ? "text-green-600 border-b-2 border-green-600"
                            : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <User size={18} />
                            Profile
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab("nursery")}
                        className={`px-6 py-3 font-medium transition-all ${activeTab === "nursery"
                            ? "text-green-600 border-b-2 border-green-600"
                            : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <Building2 size={18} />
                            Nursery
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab("password")}
                        className={`px-6 py-3 font-medium transition-all ${activeTab === "password"
                            ? "text-green-600 border-b-2 border-green-600"
                            : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <Lock size={18} />
                            Password
                        </div>
                    </button>
                </div>

                {/* Tab Content */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    {/* Profile Tab */}
                    {activeTab === "profile" && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Profile Information</h2>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Owner Name
                                </label>
                                <input
                                    type="text"
                                    name="ownerName"
                                    value={profileData.ownerName}
                                    onChange={handleProfileChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                    placeholder="Enter your name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={profileData.email}
                                    disabled
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                                />
                                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={profileData.phone}
                                    onChange={handleProfileChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                    placeholder="Enter phone number"
                                />
                            </div>

                            <button
                                onClick={handleSaveProfile}
                                disabled={loading}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all transform hover:scale-[1.02]"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save size={20} />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {/* Nursery Tab */}
                    {activeTab === "nursery" && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Nursery Information</h2>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nursery Name
                                </label>
                                <input
                                    type="text"
                                    name="nurseryName"
                                    value={nurseryData.nurseryName}
                                    onChange={handleNurseryChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                    placeholder="Enter nursery name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={nurseryData.location}
                                    onChange={handleNurseryChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                    placeholder="Enter location"
                                />
                            </div>

                            <button
                                onClick={handleSaveProfile}
                                disabled={loading}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all transform hover:scale-[1.02]"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save size={20} />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {/* Password Tab */}
                    {activeTab === "password" && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Change Password</h2>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                    placeholder="Enter new password"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                    placeholder="Confirm new password"
                                />
                            </div>

                            <button
                                onClick={handleChangePassword}
                                disabled={loading || !passwordData.newPassword || !passwordData.confirmPassword}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all transform hover:scale-[1.02]"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Changing Password...
                                    </>
                                ) : (
                                    <>
                                        <Lock size={20} />
                                        Change Password
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
