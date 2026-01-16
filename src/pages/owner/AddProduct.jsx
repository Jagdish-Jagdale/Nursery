import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../lib/firebase";
import { useNavigate } from "react-router-dom";
import { Upload, X, Package } from "lucide-react";
import toast from "react-hot-toast";

export default function AddProduct() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        price: "",
        quantity: "",
        description: "",
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview(null);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!imageFile) {
            toast.error("Please upload a product image");
            return;
        }

        setLoading(true);
        try {
            // Upload image to storage
            const imageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
            await uploadBytes(imageRef, imageFile);
            const imageUrl = await getDownloadURL(imageRef);

            // Add product to Firestore
            await addDoc(collection(db, "sugarcanes"), {
                ...formData,
                price: parseFloat(formData.price),
                quantity: parseInt(formData.quantity),
                imageUrl,
                ownerId: user.uid,
                createdAt: serverTimestamp(),
            });

            toast.success("Product added successfully!");
            navigate("/owner/reports");
        } catch (error) {
            console.error("Error adding product:", error);
            toast.error("Failed to add product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full h-full bg-gray-50 py-6 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl text-white">
                            <Package size={24} />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
                    </div>
                    <p className="text-gray-600 ml-16">Add plants and products to your inventory</p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Product Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Product Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                placeholder="e.g., Rose Plant, Orchid, etc."
                            />
                        </div>

                        {/* Category & Price */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Category
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                >
                                    <option value="">Select Category</option>
                                    <option value="Flowering Plants">Flowering Plants</option>
                                    <option value="Succulents">Succulents</option>
                                    <option value="Indoor Plants">Indoor Plants</option>
                                    <option value="Outdoor Plants">Outdoor Plants</option>
                                    <option value="Herbs">Herbs</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Price (₹)
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        {/* Quantity */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Quantity
                            </label>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                required
                                min="0"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                placeholder="0"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows="4"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                                placeholder="Describe the product..."
                            />
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Product Image
                            </label>
                            {!imagePreview ? (
                                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gradient-to-br from-gray-50 to-green-50 hover:from-green-50 hover:to-emerald-50 transition-all group">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <div className="p-4 bg-white rounded-full mb-4 group-hover:scale-110 transition-transform shadow-sm">
                                            <Upload className="w-8 h-8 text-green-600" />
                                        </div>
                                        <p className="mb-2 text-sm font-semibold text-gray-700">
                                            Click to upload product image
                                        </p>
                                        <p className="text-xs text-gray-500">PNG, JPG or WEBP (MAX. 5MB)</p>
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            ) : (
                                <div className="relative">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-64 object-cover rounded-xl border-2 border-gray-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex items-center gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                            >
                                {loading ? "Adding Product..." : "Add Product"}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate("/owner/reports")}
                                className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
