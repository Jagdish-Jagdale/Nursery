import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext"
import { collection, getDocs, query, where, doc, onSnapshot } from "firebase/firestore";
import { db } from "../../lib/firebase";
import {
    Users,
    Package,
    DollarSign,
    Clock,
    UserCheck,
    Search,
    Bell,
    ChevronDown,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function OwnerDashboard() {
    const { user } = useAuth();
    const [ownerName, setOwnerName] = useState("");
    const [stats, setStats] = useState({
        totalProducts: 0,
        admitted: 0,
        revenue: 0,
        avgTime: 0,
        staff: 0,
    });
    const [loading, setLoading] = useState(true);

    // Fetch owner name in real-time
    useEffect(() => {
        if (!user) return;

        const unsubscribe = onSnapshot(doc(db, "owners", user.uid), (docSnap) => {
            if (docSnap.exists()) {
                setOwnerName(docSnap.data().ownerName || "Owner");
            }
        });

        return () => unsubscribe();
    }, [user]);

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            try {
                const sugarcanesSnap = await getDocs(
                    query(collection(db, "sugarcanes"), where("ownerId", "==", user.uid))
                );
                const nurseriesSnap = await getDocs(
                    query(collection(db, "nurseries"), where("ownerId", "==", user.uid))
                );

                const products = sugarcanesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                const totalRevenue = products.reduce((sum, p) => sum + (p.price * p.quantity || 0), 0);

                setStats({
                    totalProducts: products.length,
                    admitted: products.filter(p => p.quantity > 0).length,
                    revenue: totalRevenue,
                    avgTime: 53,
                    staff: nurseriesSnap.size * 10,
                });
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    // Sample data for charts - Nursery specific
    const weeklyData = [
        { week: "Week 42", instock: 1200, sold: 850 },
        { week: "Week 43", instock: 1400, sold: 920 },
        { week: "Week 44", instock: 1100, sold: 780 },
        { week: "Week 45", instock: 1350, sold: 890 },
        { week: "Week 46", instock: 980, sold: 650 },
        { week: "Week 47", instock: 1250, sold: 820 },
        { week: "Week 48", instock: 1180, sold: 910 },
        { week: "Week 49", instock: 1420, sold: 1050 },
        { week: "Week 50", instock: 1300, sold: 980 },
        { week: "Week 51", instock: 1450, sold: 1100 },
        { week: "Week 52", instock: 1280, sold: 950 },
        { week: "Week 53", instock: 1380, sold: 1020 },
    ];

    const divisionData = [
        { division: "Flowering Plants", inpatient: "3,245", outpatient: "8,521" },
        { division: "Succulents", inpatient: "2,180", outpatient: "5,432" },
        { division: "Indoor Plants", inpatient: "1,890", outpatient: "4,123" },
    ];

    const waitingTimeData = [
        { name: "Flowering Plants", value: 85, label: "85%" },
        { name: "Succulents", value: 72, label: "72%" },
        { name: "Indoor Plants", value: 68, label: "68%" },
    ];

    const satisfactionData = [
        { label: "Excellent Quality", value: 48 },
        { label: "Good Quality", value: 32 },
        { label: "Average Quality", value: 12 },
        { label: "Poor Quality", value: 5 },
        { label: "No Review", value: 3 },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-gray-50 font-['Inter',sans-serif] overflow-y-auto">
            {/* Top Header */}


            {/* Main Content */}
            <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <StatCard
                        icon={<Users size={20} className="text-green-600" />}
                        value={stats.totalProducts.toLocaleString()}
                        label="Total Plants"
                    />
                    <StatCard
                        icon={<Package size={20} className="text-blue-600" />}
                        value={stats.admitted.toLocaleString()}
                        label="Plants Available"
                    />
                    <StatCard
                        icon={<span className="text-purple-600 font-bold text-xl">₹</span>}
                        value={` ${(stats.revenue / 1000).toFixed(1)}`}
                        label="Total Revenue"
                    />
                    <StatCard
                        icon={<Clock size={20} className="text-orange-600" />}
                        value={"4.2 "}
                        label="Avg Rating"
                    />

                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Bar Chart - Takes 2 columns */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Inventory vs. Sales Trend</h3>
                        <ResponsiveContainer width="100%" height={350}>
                            <LineChart data={weeklyData} margin={{ top: 5, right: 20, left: 0, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="week"
                                    tick={{ fill: '#6b7280', fontSize: 11 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fill: '#6b7280', fontSize: 12 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#fff",
                                        border: "none",
                                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                        borderRadius: "8px",
                                    }}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    height={50}
                                    iconType="circle"
                                    wrapperStyle={{ paddingTop: '20px', paddingBottom: '10px' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="instock"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    dot={{ fill: '#10b981', r: 4 }}
                                    activeDot={{ r: 6 }}
                                    name="In Stock"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="sold"
                                    stroke="#059669"
                                    strokeWidth={3}
                                    dot={{ fill: '#059669', r: 4 }}
                                    activeDot={{ r: 6 }}
                                    name="Sold"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Donut Chart - Takes 1 column */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Customer Satisfaction</h3>
                        <div className="flex items-center justify-center mb-6">
                            <DonutChart />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-green-600"></div>
                                    <span className="text-gray-600">Excellent</span>
                                </div>
                                <span className="font-medium">48%</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                    <span className="text-gray-600">Good</span>
                                </div>
                                <span className="font-medium">32%</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                                    <span className="text-gray-600">Average/Below</span>
                                </div>
                                <span className="font-medium">20%</span>
                            </div>
                        </div>
                        <div className="mt-6 pt-4 border-t border-gray-100">
                            <p className="text-sm text-gray-600 mb-3">Customer feedback on plant quality</p>
                            {satisfactionData.map((item, idx) => (
                                <div key={idx} className="mb-2">
                                    <div className="flex items-center justify-between text-xs mb-1">
                                        <span className="text-gray-600">{item.label}</span>
                                        <span className="text-gray-900 font-medium">{item.value}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500 rounded-full"
                                            style={{ width: `${item.value}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Tables */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Division Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Product By Division</h3>
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 text-sm font-semibold text-gray-700">Division</th>
                                    <th className="text-right py-3 text-sm font-semibold text-gray-700">In Stock</th>
                                    <th className="text-right py-3 text-sm font-semibold text-gray-700">Sold</th>
                                </tr>
                            </thead>
                            <tbody>
                                {divisionData.map((div, idx) => (
                                    <tr key={idx} className="border-b border-gray-100">
                                        <td className="py-3 text-sm text-gray-900">{div.division}</td>
                                        <td className="py-3 text-sm text-gray-600 text-right">{div.inpatient}</td>
                                        <td className="py-3 text-sm text-gray-600 text-right">{div.outpatient}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Waiting Time Chart */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Avg Sales Rate By Division</h3>
                        <div className="space-y-4">
                            {waitingTimeData.map((item, idx) => (
                                <div key={idx}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-gray-700">{item.name}</span>
                                        <span className="text-sm font-medium text-gray-900">{item.label}</span>
                                    </div>
                                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-cyan-500 rounded-full transition-all"
                                            style={{ width: `${item.value}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, value, label }) {
    return (
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-2">
                <div className="mt-0.5">{icon}</div>
                <div>
                    <div className="text-xl font-bold text-gray-900 mb-0.5">{value}</div>
                    <div className="text-sm text-gray-600">{label}</div>
                </div>
            </div>
        </div>
    );
}

function DonutChart() {
    return (
        <div className="relative w-48 h-48">
            <svg viewBox="0 0 100 100" className="transform -rotate-90">
                {/* Excellent - 42% */}
                <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="20"
                    strokeDasharray="105 263"
                    strokeDashoffset="0"
                />
                {/* Good - 30% */}
                <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#059669"
                    strokeWidth="20"
                    strokeDasharray="79 263"
                    strokeDashoffset="-105"
                />
                {/* Neutral - 20% */}
                <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#d1d5db"
                    strokeWidth="20"
                    strokeDasharray="53 263"
                    strokeDashoffset="-184"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">80%</div>
                    <div className="text-sm text-gray-600">Positive</div>
                </div>
            </div>
        </div>
    );
}
