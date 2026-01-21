import { useEffect, useState } from "react";
import {
    collection,
    getDocs,
    query,
    addDoc,
    serverTimestamp,
    doc,
    deleteDoc,
    updateDoc,
} from "firebase/firestore";
import { createUserWithEmailAndPassword, getAuth, signOut } from "firebase/auth";
import { initializeApp, deleteApp } from "firebase/app";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, auth, storage } from "../../lib/firebase";
import { ROLES } from "../../utils/roles";
import toast from "react-hot-toast";
import {
    Search,
    Plus,
    MoreVertical,
    Edit2,
    Trash2,
    Shield,
    User,
    Mail,
    Phone,
    Trees,
    Building,
    X,
    ChevronLeft,
    ChevronRight,
    MapPin,
    Lock,
    Calendar,
    Clock,
    Eye,
    EyeOff,
} from "lucide-react";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";

export default function ManageOwners() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showViewPassword, setShowViewPassword] = useState(false); // For View Modal
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedOwner, setSelectedOwner] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    // const [activeTab, setActiveTab] = useState("active"); // Removed Tab State
    const [formData, setFormData] = useState({
        nurseryName: "",
        ownerName: "",
        email: "",
        phone: "",
        address: "",
        password: "",
        status: "active",
    });

    // Delete Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [ownerToDelete, setOwnerToDelete] = useState(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Reset page when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const q = query(
                    collection(db, "owners")
                );
                const snap = await getDocs(q);
                const ownerUsers = snap.docs
                    .map((d) => ({ id: d.id, ...d.data() }))
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setUsers(ownerUsers);
            } catch (e) {
                console.error(e);
                toast.error("Failed to load owners");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleOpenModal = () => {
        setFormData({
            nurseryName: "",
            ownerName: "",
            email: "",
            phone: "",
            address: "",
            password: "",
            status: "active",
        });
        setImageFile(null);
        setImagePreview(null);
        setShowModal(true);
        setShowPassword(false); // Reset password visibility
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setIsEditing(false);
        setEditId(null);
        setImagePreview(null);
        setImageFile(null);
        setShowPassword(false); // Reset password visibility
    };

    const handleEdit = (owner, e) => {
        e.stopPropagation();
        setFormData({
            nurseryName: owner.nurseryName || "",
            ownerName: owner.ownerName || "",
            email: owner.email || "",
            phone: owner.phone || "",
            address: owner.address || "",
            password: "", // Password not populated for security
            status: owner.status || "active",
        });
        setImagePreview(owner.profileImage || null);
        setEditId(owner.id);
        setIsEditing(true);
        setShowModal(true);
        setShowPassword(false); // Reset password visibility
    };

    const handleDelete = (owner, e) => {
        e.stopPropagation();
        setOwnerToDelete(owner);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!ownerToDelete) return;

        try {
            await deleteDoc(doc(db, "owners", ownerToDelete.id));
            setUsers(prev => prev.filter(u => u.id !== ownerToDelete.id));
            toast.success("Owner deleted successfully");
            setShowDeleteModal(false);
            setOwnerToDelete(null);
        } catch (error) {
            console.error("Error deleting owner:", error);
            toast.error("Failed to delete owner");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "phone") {
            const numericValue = value.replace(/\D/g, "");
            if (numericValue.length <= 10) {
                setFormData((prev) => ({ ...prev, [name]: numericValue }));
            }
            return;
        }

        if (name === "email") {
            setFormData((prev) => ({ ...prev, [name]: value.toLowerCase() }));
            return;
        }

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !formData.nurseryName ||
            !formData.ownerName ||
            !formData.email
        ) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (!isEditing && !formData.password) {
            toast.error("Password is required for new owners");
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d\W]).{8,}$/;
        if (formData.password && !passwordRegex.test(formData.password)) {
            toast.error("Password must be at least 8 chars with 1 uppercase, 1 lowercase & 1 number/symbol");
            return;
        }

        if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
            toast.error("Phone number must be exactly 10 digits");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            toast.error("Please enter a valid email address");
            return;
        }

        let secondaryApp = null;

        try {
            setSubmitting(true);

            let imageUrl = imagePreview; // Default to existing preview (if editing and no new file)

            // Upload Image if selected
            if (imageFile) {
                // Extract file extension
                const fileExtension = imageFile.name.split('.').pop();
                // Create storage ref using email and extension
                const storageRef = ref(storage, `profiles/owners/${formData.email}`);
                await uploadBytes(storageRef, imageFile);
                imageUrl = await getDownloadURL(storageRef);
            }

            if (isEditing) {
                // Update Logic
                await updateDoc(doc(db, "owners", editId), {
                    nurseryName: formData.nurseryName,
                    ownerName: formData.ownerName,
                    email: formData.email,
                    phone: formData.phone || "",
                    address: formData.address || "",
                    profileImage: imageUrl,
                    ...(formData.password ? { password: formData.password } : {}), // Update password if provided
                    updatedAt: serverTimestamp(),
                    status: formData.status,
                });

                toast.success("Owner updated successfully!");
                // Update local state without reload
                setUsers(prev => prev.map(u => u.id === editId ? {
                    ...u,
                    nurseryName: formData.nurseryName,
                    ownerName: formData.ownerName,
                    email: formData.email,
                    phone: formData.phone || "",
                    address: formData.address || "",
                    profileImage: imageUrl,
                    ...(formData.password ? { password: formData.password } : {}),
                    updatedAt: { seconds: Date.now() / 1000 },
                    status: formData.status,
                } : u));

            } else {
                // Create Logic
                // Initialize a secondary app to create user without logging out the current admin
                secondaryApp = initializeApp(auth.app.options, "Secondary");
                const secondaryAuth = getAuth(secondaryApp);

                const userCredential = await createUserWithEmailAndPassword(
                    secondaryAuth,
                    formData.email.trim(),
                    formData.password
                );

                const userId = userCredential.user.uid;

                // Immediately sign out the secondary user to be safe (though deleting app does cleanup)
                await signOut(secondaryAuth);

                // Create owner document in 'owners' collection using MAIN DB (authenticated as Admin)
                await addDoc(collection(db, "owners"), {
                    uid: userId,
                    nurseryName: formData.nurseryName,
                    ownerName: formData.ownerName,
                    email: formData.email,
                    phone: formData.phone || "",
                    address: formData.address || "",
                    password: formData.password, // Store password
                    profileImage: imageUrl,
                    role: ROLES.OWNER,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                    status: formData.status || "active",
                });

                toast.success("Owner added successfully!");

                // Reload users for fresh sort/data
                const q = query(
                    collection(db, "owners")
                );
                const snap = await getDocs(q);
                const ownerUsers = snap.docs
                    .map((d) => ({ id: d.id, ...d.data() }))
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setUsers(ownerUsers);
            }

            handleCloseModal();

        } catch (error) {
            console.error("Error:", error);
            if (error.code === "auth/email-already-in-use") {
                toast.error("Email already in use");
            } else {
                toast.error("Failed to add owner: " + error.message);
            }
        } finally {
            // Clean up the secondary app
            if (secondaryApp) {
                await deleteApp(secondaryApp);
            }
            setSubmitting(false);
        }
    };

    const handleStatusToggle = async (id, currentStatus, e) => {
        e.stopPropagation();
        const newStatus = currentStatus === "active" ? "inactive" : "active";
        if (!window.confirm(`Are you sure you want to ${newStatus === "active" ? "activate" : "deactivate"} this owner?`)) return;

        try {
            await updateDoc(doc(db, "owners", id), {
                status: newStatus,
                updatedAt: serverTimestamp(),
            });

            setUsers(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u));
            toast.success(`Owner ${newStatus === "active" ? "activated" : "deactivated"} successfully`);
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status");
        }
    };

    const filteredUsers = users.filter(
        (u) =>
        // ((u.status || "active") === activeTab) && // Removed Tab Filter
        (!search ||
            (u.nurseryName && u.nurseryName.toLowerCase().includes(search.toLowerCase())) ||
            (u.ownerName && u.ownerName.toLowerCase().includes(search.toLowerCase())) ||
            (u.email && u.email.toLowerCase().includes(search.toLowerCase())))
    );

    // Pagination Logic
    const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + rowsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="font-sans min-h-screen p-0 ">
            <div className="w-full px-4 py-2">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4">
                    <div>
                        <h3 className="text-xl mb-2 text-gray-900 font-extrabold">
                            Manage Owners
                        </h3>
                        <p className="text-base text-gray-600 font-normal mb-0">
                            Admin Dashboard
                        </p>
                    </div>
                </div>
                <hr className="mt-4 mb-5 border-gray-100" />

                {/* Tabs Removed */}

                {/* Search */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-3">
                    <div className="flex justify-between items-center mb-4">
                        <h5 className="font-semibold text-gray-900 text-base">Search & Filters</h5>
                        <button
                            className="flex items-center gap-2 shadow-sm text-sm bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition"
                            style={{ borderRadius: "12px" }}
                            onClick={handleOpenModal}
                        >
                            <Plus size={18} />
                            <span>Add Owner</span>
                        </button>
                    </div>
                    <hr className="mt-0 mb-4 border-gray-200 opacity-10" />
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                        <div className="md:col-span-8 relative">
                            <Search
                                className="absolute text-gray-400 left-3 top-1/2 -translate-y-1/2"
                                size={18}
                            />
                            <input
                                type="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name or email..."
                                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                        </div>

                        <div className="md:col-span-4 flex justify-end items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">Rows per page:</span>
                                <select
                                    value={rowsPerPage}
                                    onChange={(e) => {
                                        setRowsPerPage(Number(e.target.value));
                                        setCurrentPage(1);
                                    }}
                                    className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5"
                                >
                                    {[5, 10, 25, 50].map((pageSize) => (
                                        <option key={pageSize} value={pageSize}>
                                            {pageSize}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-gray-500"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <span className="text-sm text-gray-700">
                                    Page {currentPage} of {Math.max(1, totalPages)}
                                </span>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                    className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-gray-500"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full border-separate border-spacing-0">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-100">
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Sr No
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Image
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Owner Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Nursery Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-12">
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                                <span className="text-sm text-gray-500 font-medium">
                                                    Loading owner data...
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : paginatedUsers.length ? (
                                    paginatedUsers.map((u, index) => (
                                        <tr
                                            key={u.id}
                                            onClick={() => setSelectedOwner(u)}
                                            style={{ borderBottom: '1px solid #dae2eeff' }}
                                            className="bg-white transition-colors cursor-pointer hover:!bg-blue-50"
                                        >
                                            <td className="px-6 py-2.5 whitespace-nowrap text-center">
                                                <span className="text-sm text-gray-900">
                                                    {String(startIndex + index + 1).padStart(2, "0")}
                                                </span>
                                            </td>

                                            <td className="px-6 py-2.5 whitespace-nowrap">
                                                <div className="flex items-center justify-center relative w-10 h-10 mx-auto">
                                                    <img
                                                        src={u.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.ownerName || "User")}&background=random`}
                                                        alt={u.ownerName}
                                                        className="w-full h-full rounded-full object-cover border-2 border-gray-200 shadow-sm"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(u.ownerName || "User")}&background=random`;
                                                        }}
                                                    />
                                                </div >
                                            </td >

                                            <td className="px-6 py-2.5 whitespace-nowrap">
                                                <span className="text-sm font-medium text-gray-900">
                                                    {u.ownerName || "Unknown Owner"}
                                                </span>
                                            </td>

                                            <td className="px-6 py-2.5 whitespace-nowrap">
                                                <span className="text-sm text-gray-900">
                                                    {u.nurseryName || "N/A"}
                                                </span>
                                            </td>

                                            <td className="px-6 py-2.5 whitespace-nowrap">
                                                <span className="text-sm text-gray-900">
                                                    {u.email}
                                                </span>
                                            </td>

                                            <td className="px-6 py-2.5 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${(u.status || "active") === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                                                    {(u.status || "active") === "active" ? "Active" : "Inactive"}
                                                </span>
                                            </td>

                                            <td className="px-6 py-2.5 whitespace-nowrap text-center">
                                                <div className="flex items-center justify-center gap-2">

                                                    <button
                                                        onClick={(e) => handleEdit(u, e)}
                                                        className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
                                                        title="Edit Owner"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => handleDelete(u, e)}
                                                        className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors"
                                                        title="Delete Owner"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr >
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-400">
                                                <div className="bg-gray-50 p-4 rounded-full mb-3">
                                                    <User size={32} className="opacity-50" />
                                                </div>
                                                <p className="text-sm font-medium">
                                                    No owners found matching your search.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody >
                        </table >
                    </div >
                </div >
            </div >

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                title="Delete Owner?"
                message="This action cannot be undone. This will permanently delete the owner and remove their access to the system."
                confirmText="DELETE OWNER"
                itemName={ownerToDelete?.ownerName}
            />

            {/* Tailwind Modal */}
            {
                showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                            onClick={handleCloseModal}
                        ></div>
                        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden transform transition-all">
                            {/* Modal Header */}
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
                                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                    <Building className="text-green-600" size={24} />
                                    {isEditing ? "Edit Nursery Owner" : "Add Nursery Owner"}
                                </h3>
                                <button
                                    onClick={handleCloseModal}
                                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 overflow-y-auto max-h-[80vh] relative">
                                {/* Status Toggle Top Right */}
                                <div className="absolute top-6 right-6 z-10 flex flex-col items-center gap-1">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.status === "active"}
                                            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.checked ? "active" : "inactive" }))}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                    <span className={`text-xs font-semibold ${formData.status === "active" ? "text-green-600" : "text-gray-400"}`}>
                                        {formData.status === "active" ? "Active" : "Inactive"}
                                    </span>
                                </div>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Image Upload */}
                                    <div className="flex flex-col items-center mb-4">
                                        <div className="relative group cursor-pointer inline-block">
                                            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-green-100 bg-gray-50 flex items-center justify-center">
                                                {imagePreview ? (
                                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <User size={32} className="text-gray-400" />
                                                )}
                                            </div>

                                            {/* Status Dot (Bottom Right) */}
                                            <div className={`absolute bottom-0 right-1 w-5 h-5 rounded-full border-2 border-white ${formData.status === "active" ? "bg-green-500" : "bg-gray-400"}`}></div>

                                            {/* Top Right Toggle Switch Removed */}

                                            <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            setImageFile(file);
                                                            setImagePreview(URL.createObjectURL(file));
                                                        }
                                                    }}
                                                />
                                                <span className="text-white text-xs font-medium">Change</span>
                                            </label>
                                        </div>
                                        {imagePreview ? (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setImageFile(null);
                                                    setImagePreview(null);
                                                }}
                                                className="text-xs text-red-500 mt-2 hover:text-red-700 font-medium"
                                            >
                                                Remove Profile
                                            </button>
                                        ) : (
                                            <p className="text-xs text-gray-500 mt-2">Upload Profile Picture</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Nursery Name */}
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-2">
                                                <Building size={16} className="text-green-600" />
                                                <label className="text-base font-medium text-gray-700">
                                                    Nursery Name <span className="text-red-500">*</span>
                                                </label>
                                            </div>
                                            <input
                                                type="text"
                                                name="nurseryName"
                                                value={formData.nurseryName}
                                                onChange={handleInputChange}
                                                placeholder="Enter nursery name"
                                                className="w-full px-3 py-2.5 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                                                disabled={submitting}
                                                required
                                            />
                                        </div>

                                        {/* Owner Name */}
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-2">
                                                <User size={16} className="text-blue-600" />
                                                <label className="text-base font-medium text-gray-700">
                                                    Owner Name <span className="text-red-500">*</span>
                                                </label>
                                            </div>
                                            <input
                                                type="text"
                                                name="ownerName"
                                                value={formData.ownerName}
                                                onChange={handleInputChange}
                                                placeholder="Enter owner name"
                                                className="w-full px-3 py-2.5 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                                                disabled={submitting}
                                                required
                                            />
                                        </div>

                                        {/* Email */}
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-2">
                                                <Mail size={16} className="text-purple-600" />
                                                <label className="text-base font-medium text-gray-700">
                                                    Email <span className="text-red-500">*</span>
                                                </label>
                                            </div>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="Enter email"
                                                className="w-full px-3 py-2.5 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                                                disabled={submitting}
                                                required
                                            />
                                        </div>

                                        {/* Phone */}
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-2">
                                                <Phone size={16} className="text-orange-600" />
                                                <label className="text-base font-medium text-gray-700">
                                                    Phone Number
                                                </label>
                                            </div>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                placeholder="Enter phone number"
                                                className="w-full px-3 py-2.5 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                                                disabled={submitting}
                                            />
                                        </div>

                                        {/* Address */}
                                        <div className="space-y-1.5 md:col-span-2">
                                            <div className="flex items-center gap-2">
                                                <MapPin size={16} className="text-red-600" />
                                                <label className="text-base font-medium text-gray-700">
                                                    Address
                                                </label>
                                            </div>
                                            <textarea
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                placeholder="Enter address"
                                                rows={3}
                                                className="w-full px-3 py-2.5 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 resize-none"
                                                disabled={submitting}
                                            />
                                        </div>

                                        {/* Status Toggle Removed from here */}

                                        {/* Password */}
                                        <div className="col-span-1 md:col-span-2 space-y-1.5">
                                            <div className="flex items-center gap-2">
                                                <Lock size={16} className="text-gray-400" />
                                                <label className="text-base font-medium text-gray-700">
                                                    Password {isEditing ? "" : <span className="text-red-500">*</span>}
                                                </label>
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleInputChange}
                                                    placeholder={isEditing ? "Leave blank to keep current password" : "Enter password"}
                                                    className="w-full pl-3 pr-10 py-2.5 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                                                    disabled={submitting}
                                                    required={!isEditing}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                                >
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                            {isEditing && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Only enter if you want to change the password
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </form>
                            </div>

                            {/* Modal Footer */}
                            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    disabled={submitting}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all font-sans"
                                    style={{ borderRadius: "12px" }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm border border-transparent font-sans"
                                    style={{ borderRadius: "12px" }}
                                >
                                    {submitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span>Adding...</span>
                                        </>
                                    ) : (
                                        <>

                                            <span>{isEditing ? "Update Owner" : "Add Owner"}</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
            {/* View Owner Modal */}
            {
                selectedOwner && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                            onClick={() => {
                                setSelectedOwner(null);
                                setShowViewPassword(false);
                            }}
                        ></div>
                        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden transform transition-all">
                            {/* Modal Header */}
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
                                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                    <Building className="text-blue-600" size={24} />
                                    Owner Details
                                </h3>
                                <button
                                    onClick={() => {
                                        setSelectedOwner(null);
                                        setShowViewPassword(false);
                                    }}
                                    className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 transition-colors"
                                    style={{ borderRadius: "12px" }}
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            < div className="p-6 overflow-y-auto max-h-[80vh]" >
                                <div className="space-y-6">
                                    {/* Image Display */}
                                    <div className="flex flex-col items-center mb-4">
                                        <div className="relative group inline-block">
                                            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-green-100 bg-gray-50 flex items-center justify-center">
                                                {selectedOwner.profileImage ? (
                                                    <img
                                                        src={selectedOwner.profileImage}
                                                        alt={selectedOwner.ownerName}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <User size={32} className="text-gray-400" />
                                                )}
                                            </div>
                                            <div className={`absolute bottom-0 right-1 w-5 h-5 rounded-full border-2 border-white ${(selectedOwner.status || "active") === "active" ? "bg-green-500" : "bg-gray-400"}`}></div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Nursery Name */}
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-2">
                                                <Building size={16} className="text-green-600" />
                                                <label className="text-base font-medium text-gray-700">
                                                    Nursery Name
                                                </label>
                                            </div>
                                            <div className="w-full px-3 py-2.5 text-base border border-gray-200 rounded-lg bg-gray-50 text-gray-900">
                                                {selectedOwner.nurseryName || "N/A"}
                                            </div>
                                        </div>

                                        {/* Owner Name */}
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-2">
                                                <User size={16} className="text-blue-600" />
                                                <label className="text-base font-medium text-gray-700">
                                                    Owner Name
                                                </label>
                                            </div>
                                            <div className="w-full px-3 py-2.5 text-base border border-gray-200 rounded-lg bg-gray-50 text-gray-900">
                                                {selectedOwner.ownerName || "N/A"}
                                            </div>
                                        </div>

                                        {/* Email */}
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-2">
                                                <Mail size={16} className="text-purple-600" />
                                                <label className="text-base font-medium text-gray-700">
                                                    Email
                                                </label>
                                            </div>
                                            <div className="w-full px-3 py-2.5 text-base border border-gray-200 rounded-lg bg-gray-50 text-gray-900">
                                                {selectedOwner.email || "N/A"}
                                            </div>
                                        </div>

                                        {/* Phone */}
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-2">
                                                <Phone size={16} className="text-orange-600" />
                                                <label className="text-base font-medium text-gray-700">
                                                    Phone Number
                                                </label>
                                            </div>
                                            <div className="w-full px-3 py-2.5 text-base border border-gray-200 rounded-lg bg-gray-50 text-gray-900">
                                                {selectedOwner.phone || "N/A"}
                                            </div>
                                        </div>

                                        {/* Address */}
                                        <div className="space-y-1.5 md:col-span-2">
                                            <div className="flex items-center gap-2">
                                                <MapPin size={16} className="text-red-600" />
                                                <label className="text-base font-medium text-gray-700">
                                                    Address
                                                </label>
                                            </div>
                                            <div className="w-full px-3 py-2.5 text-base border border-gray-200 rounded-lg bg-gray-50 text-gray-900 min-h-[3rem] whitespace-pre-wrap">
                                                {selectedOwner.address || "N/A"}
                                            </div>
                                        </div>

                                        {/* Password (View Mode) */}
                                        <div className="space-y-1.5 md:col-span-2">
                                            <div className="flex items-center gap-2">
                                                <Lock size={16} className="text-gray-400" />
                                                <label className="text-base font-medium text-gray-700">
                                                    Password
                                                </label>
                                            </div>
                                            <div className="relative">
                                                <div className="w-full px-3 py-2.5 text-base border border-gray-200 rounded-lg bg-gray-50 text-gray-900">
                                                    {showViewPassword ? (selectedOwner.password || "N/A") : "••••••••"}
                                                </div>
                                                <button
                                                    onClick={() => setShowViewPassword(!showViewPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                                >
                                                    {showViewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Created */}
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={16} className="text-teal-600" />
                                                <label className="text-base font-medium text-gray-700">
                                                    Created
                                                </label>
                                            </div>
                                            <div className="w-full px-3 py-2.5 text-base border border-gray-200 rounded-lg bg-gray-50 text-gray-900">
                                                {selectedOwner.createdAt?.seconds
                                                    ? new Date(selectedOwner.createdAt.seconds * 1000).toLocaleString('en-GB', { hour12: true })
                                                    : "N/A"}
                                            </div>
                                        </div>

                                        {/* Updated */}
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-2">
                                                <Clock size={16} className="text-teal-600" />
                                                <label className="text-base font-medium text-gray-700">
                                                    Updated
                                                </label>
                                            </div>
                                            <div className="w-full px-3 py-2.5 text-base border border-gray-200 rounded-lg bg-gray-50 text-gray-900">
                                                {selectedOwner.updatedAt?.seconds
                                                    ? new Date(selectedOwner.updatedAt.seconds * 1000).toLocaleString('en-GB', { hour12: true })
                                                    : selectedOwner.createdAt?.seconds
                                                        ? new Date(selectedOwner.createdAt.seconds * 1000).toLocaleString('en-GB', { hour12: true })
                                                        : "N/A"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div >


                        </div >
                    </div >
                )
            }
        </div >
    );
}
