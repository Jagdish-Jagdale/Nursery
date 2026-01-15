import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../lib/firebase";
import {
    LayoutGrid,
    Package,
    TrendingUp,
    AlertTriangle,
    PlusCircle,
    FileText,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";

export default function OwnerDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalProducts: 0,
        lowStock: 0,
        nurseries: 0,
    });
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            try {
                // Fetch sugarcanes (products)
                const sugarcanesSnap = await getDocs(
                    query(collection(db, "sugarcanes"), where("ownerId", "==", user.uid))
                );

                // Fetch nurseries
                const nurseriesSnap = await getDocs(
                    query(collection(db, "nurseries"), where("ownerId", "==", user.uid))
                );

                const products = sugarcanesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                const lowStockCount = products.filter(p => (p.quantity || 0) < 10).length;

                setStats({
                    totalProducts: products.length,
                    lowStock: lowStockCount,
                    nurseries: nurseriesSnap.size,
                });

                // Generate sample chart data (last 7 days)
                const mockChartData = [
                    { day: "Mon", sales: 12 },
                    { day: "Tue", sales: 19 },
                    { day: "Wed", sales: 15 },
                    { day: "Thu", sales: 25 },
                    { day: "Fri", sales: 22 },
                    { day: "Sat", sales: 30 },
                    { day: "Sun", sales: 28 },
                ];
                setChartData(mockChartData);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const StatCard = ({ icon: Icon, label, value, colorClass, onClick }) => (
        <div
            onClick={onClick}
            className={`h-full shadow-sm rounded-2xl bg-white border border-gray-200 p-5 hover:shadow-md transition-all cursor-pointer transform hover:scale-[1.02] ${onClick ? '' : 'cursor-default'}`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
                    <p className="text-3xl font-bold text-gray-900">{value}</p>
                </div>
                <div className={`p-3 rounded-full border border-gray-100 bg-white ${colorClass}`}>
                    <Icon size={24} />
                </div>
            </div>
        </div>
    );

    const QuickAction = ({ icon: Icon, label, onClick }) => (
        <button
            onClick={onClick}
            className="flex items-center gap-3 p-4 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all transform hover:scale-[1.02] w-full text-left"
        >
            <div className="p-2 rounded-lg bg-white border border-gray-100 text-green-600">
                <Icon size={20} />
            </div>
            <span className="font-medium text-gray-900">{label}</span>
        </button>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-white py-2 px-4 font-['Inter',sans-serif]">
            {/* Header */}
            <div className="mb-6">
                <h3 className="text-xl mb-2 text-gray-900 font-extrabold">
                    Dashboard Overview
                </h3>
                <p className="text-base text-gray-600 mb-0 font-normal">
                    Welcome back! Here's what's happening with your nursery.
                </p>
                <hr className="mt-4 border-gray-100 opacity-50" />
            </div>

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard
                        icon={Package}
                        label="Total Products"
                        value={stats.totalProducts}
                        colorClass="text-blue-600"
                        onClick={() => navigate("/owner/reports")}
                    />
                    <StatCard
                        icon={AlertTriangle}
                        label="Low Stock Items"
                        value={stats.lowStock}
                        colorClass="text-orange-600"
                    />
                    <StatCard
                        icon={LayoutGrid}
                        label="Nurseries"
                        value={stats.nurseries}
                        colorClass="text-green-600"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Quick Actions */}
                    <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        <div className="flex justify-between items-center mb-6">
                            <h5 className="mb-0 font-bold text-gray-900 text-base">Quick Actions</h5>
                        </div>
                        <div className="space-y-4">
                            <QuickAction
                                icon={PlusCircle}
                                label="Add New Product"
                                onClick={() => navigate("/owner/addproduct")}
                            />
                            <QuickAction
                                icon={FileText}
                                label="View Reports"
                                onClick={() => navigate("/owner/reports")}
                            />
                        </div>
                    </div>

                    {/* Sales Chart */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        <div className="flex justify-between items-center mb-6">
                            <h5 className="mb-0 font-bold text-gray-900 text-base">Sales Trend (Last 7 Days)</h5>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                                <XAxis dataKey="day" stroke="#9ca3af" tickLine={false} axisLine={false} />
                                <YAxis stroke="#9ca3af" tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#fff",
                                        border: "none",
                                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                        borderRadius: "8px",
                                    }}
                                    cursor={{ fill: '#f3f4f6' }}
                                />
                                <Bar dataKey="sales" fill="url(#colorGradient)" radius={[6, 6, 0, 0]} maxBarSize={50} />
                                <defs>
                                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#059669" stopOpacity={1} />
                                    </linearGradient>
                                </defs>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
