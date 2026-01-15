import { useEffect, useState } from "react";
import {
    collection,
    getDocs,
    query,
    addDoc,
    serverTimestamp,
    setDoc,
    doc,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "../../lib/firebase";
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
} from "lucide-react";

export default function ManageOwners() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        nurseryName: "",
        ownerName: "",
        email: "",
        phone: "",
        password: "",
    });

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
            password: "",
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
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
            !formData.email ||
            !formData.password
        ) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters");
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

        try {
            setSubmitting(true);

            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email.trim(),
                formData.password
            );

            const userId = userCredential.user.uid;

            // Create owner document in 'owners' collection
            await addDoc(collection(db, "owners"), {
                uid: userId,
                nurseryName: formData.nurseryName,
                ownerName: formData.ownerName,
                email: formData.email,
                phone: formData.phone || "",
                role: ROLES.OWNER,
                createdAt: serverTimestamp(),
                status: "active",
            });

            // IMPORTANT: Also create user document in 'users' collection for authentication
            await setDoc(doc(db, "users", userId), {
                uid: userId,
                email: formData.email,
                role: ROLES.OWNER,
                createdAt: serverTimestamp(),
            });

            toast.success("Owner added successfully!");
            handleCloseModal();

            // Reload users
            const q = query(
                collection(db, "owners")
            );
            const snap = await getDocs(q);
            const ownerUsers = snap.docs
                .map((d) => ({ id: d.id, ...d.data() }))
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setUsers(ownerUsers);
        } catch (error) {
            console.error("Error:", error);
            if (error.code === "auth/email-already-in-use") {
                toast.error("Email already in use");
            } else {
                toast.error("Failed to add owner");
            }
        } finally {
            setSubmitting(false);
        }
    };

    const filteredUsers = users.filter(
        (u) =>
            !search ||
            (u.nurseryName && u.nurseryName.toLowerCase().includes(search.toLowerCase())) ||
            (u.ownerName && u.ownerName.toLowerCase().includes(search.toLowerCase())) ||
            (u.email && u.email.toLowerCase().includes(search.toLowerCase()))
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
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-100 border-b border-gray-200">
                                <tr>
                                    <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-[60px]">
                                        SR NO
                                    </th>
                                    <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        NURSERY / OWNER
                                    </th>
                                    <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        CONTACT
                                    </th>
                                    <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        ROLE
                                    </th>
                                    <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                                        ACTIONS
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-8">
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
                                            className="group odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-0"
                                        >
                                            <td className="px-4 py-3 text-sm text-gray-500 font-medium">
                                                {String(startIndex + index + 1).padStart(2, "0")}
                                            </td>

                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 min-w-[40px] rounded-full flex items-center justify-center shadow-sm bg-green-50 text-green-600">
                                                        <Trees size={20} />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="flex flex-col">
                                                            <span className="text-base font-semibold text-gray-900 truncate max-w-[200px]">
                                                                {u.nurseryName || u.name?.split(" - ")[0] || "Unknown Nursery"}
                                                            </span>
                                                            <span className="text-sm text-gray-400 truncate max-w-[200px] font-medium">
                                                                {u.ownerName || u.name?.split(" - ")[1] || "Owner"}
                                                            </span>
                                                        </div>

                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-4 py-3">
                                                <div className="flex flex-col gap-1">
                                                    {u.email && (
                                                        <div className="flex items-center gap-2 text-base text-gray-700">
                                                            <Mail size={14} className="text-gray-400 shrink-0" />
                                                            <span className="truncate max-w-[200px]">{u.email}</span>
                                                        </div>
                                                    )}
                                                    {u.phone && (
                                                        <div className="flex items-center gap-2 text-base text-gray-700">
                                                            <Phone size={14} className="text-gray-400 shrink-0" />
                                                            <span>{u.phone}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="px-4 py-3">
                                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-semibold bg-green-50 text-blue-700 border border-green-100/50">
                                                    <Shield size={12} />
                                                    <span>Owner</span>
                                                </div>
                                            </td>

                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-1 opacity-100 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                        title="Edit Owner"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete Owner"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                    <button
                                                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                        title="More Options"
                                                    >
                                                        <MoreVertical size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center">
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
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

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
                                    Add Nursery Owner
                                </h3>
                                <button
                                    onClick={handleCloseModal}
                                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 overflow-y-auto max-h-[80vh]">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Nursery Name */}
                                        <div className="space-y-1.5">
                                            <label className="text-base font-medium text-gray-700 block">
                                                Nursery Name <span className="text-red-500">*</span>
                                            </label>
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
                                            <label className="text-base font-medium text-gray-700 block">
                                                Owner Name <span className="text-red-500">*</span>
                                            </label>
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
                                            <label className="text-base font-medium text-gray-700 block">
                                                Email <span className="text-red-500">*</span>
                                            </label>
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
                                            <label className="text-base font-medium text-gray-700 block">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                placeholder="+91 98765 43210"
                                                className="w-full px-3 py-2.5 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                                                disabled={submitting}
                                            />
                                        </div>

                                        {/* Password */}
                                        <div className="col-span-1 md:col-span-2 space-y-1.5">
                                            <label className="text-base font-medium text-gray-700 block">
                                                Password <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                placeholder="Enter password (min 6 characters)"
                                                className="w-full px-3 py-2.5 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                                                disabled={submitting}
                                                required
                                                minLength={6}
                                            />
                                            <p className="text-xs text-gray-500">Password must be at least 6 characters</p>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            {/* Modal Footer */}
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
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
                                            <Plus size={18} />
                                            <span>Add Owner</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
