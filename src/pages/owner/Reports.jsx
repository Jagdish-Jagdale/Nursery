import { useEffect, useMemo, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from "recharts";
import {
  Printer, Download, Search, TrendingUp, Store, IndianRupee,
  Briefcase, TrendingDown, MoreVertical, BarChart2,
  Package, ShoppingBag, ArrowRight, Layers
} from "lucide-react";

export default function OwnerReports() {
  const { user } = useAuth();
  const [sugarcanes, setSugarcanes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("This Month");

  /* --- Dummy Data for Demo --- */
  const DUMMY_SUGARCANES = [
    { id: '1', variety: 'Co 86032', stock: 15000 },
    { id: '2', variety: 'CoM 0265', stock: 12000 },
    { id: '3', variety: 'Co 92005', stock: 8500 },
    { id: '4', variety: 'VSI 434', stock: 6700 },
    { id: '5', variety: 'MS 10001', stock: 4500 },
    { id: '6', variety: 'CoVSI 9805', stock: 3200 },
  ];

  const DUMMY_ORDERS = [
    { id: 'ORD-001', userName: 'Rajesh Patil', createdAt: new Date(new Date().setMonth(new Date().getMonth() - 0)), totalAmount: 45000, status: 'Completed', items: [1, 2] },
    { id: 'ORD-002', userName: 'Amit Deshmukh', createdAt: new Date(new Date().setMonth(new Date().getMonth() - 0)), totalAmount: 12500, status: 'Pending', items: [1] },
    { id: 'ORD-003', userName: 'Suresh More', createdAt: new Date(new Date().setMonth(new Date().getMonth() - 1)), totalAmount: 32000, status: 'Delivered', items: [1, 2, 3] },
    { id: 'ORD-004', userName: 'Vijay Shinde', createdAt: new Date(new Date().setMonth(new Date().getMonth() - 1)), totalAmount: 18000, status: 'Completed', items: [1] },
    { id: 'ORD-005', userName: 'Prakash Kale', createdAt: new Date(new Date().setMonth(new Date().getMonth() - 2)), totalAmount: 55000, status: 'Completed', items: [1, 2, 3, 4] },
    { id: 'ORD-006', userName: 'Deepak Sawant', createdAt: new Date(new Date().setMonth(new Date().getMonth() - 2)), totalAmount: 22000, status: 'Delivered', items: [1, 2] },
    { id: 'ORD-007', userName: 'Nitin Kadam', createdAt: new Date(new Date().setMonth(new Date().getMonth() - 3)), totalAmount: 15000, status: 'Pending', items: [1] },
    { id: 'ORD-008', userName: 'Ganesh Pawar', createdAt: new Date(new Date().setMonth(new Date().getMonth() - 3)), totalAmount: 28000, status: 'Completed', items: [1, 2] },
    { id: 'ORD-009', userName: 'Rahul Jadhav', createdAt: new Date(new Date().setMonth(new Date().getMonth() - 4)), totalAmount: 42000, status: 'Delivered', items: [1, 2, 3] },
    { id: 'ORD-010', userName: 'Santosh Mane', createdAt: new Date(new Date().setMonth(new Date().getMonth() - 5)), totalAmount: 19000, status: 'Completed', items: [1] },
  ];

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      try {
        const [sSnap, oSnap] = await Promise.all([
          getDocs(query(collection(db, 'sugarcanes'), where('ownerId', '==', user.uid))),
          getDocs(query(collection(db, 'orders'), where('ownerId', '==', user.uid))),
        ]);

        // Use real data if available, otherwise fallback to dummy data
        const realSugarcanes = sSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        const realOrders = oSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

        if (realSugarcanes.length > 0) {
          setSugarcanes(realSugarcanes);
        } else {
          setSugarcanes(DUMMY_SUGARCANES);
        }

        if (realOrders.length > 0) {
          setOrders(realOrders);
        } else {
          setOrders(DUMMY_ORDERS);
        }

      } catch (error) {
        console.error("Error loading reports data:", error);
        // Fallback on error
        setSugarcanes(DUMMY_SUGARCANES);
        setOrders(DUMMY_ORDERS);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  // --- Data Processing for Charts & KPIs ---

  const stockByVariety = useMemo(() => {
    const map = new Map();
    sugarcanes.forEach((s) => {
      const key = s.variety || s.name || "Unknown";
      map.set(key, (map.get(key) || 0) + (Number(s.stock) || 0));
    });
    return Array.from(map, ([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5 varieties
  }, [sugarcanes]);

  const ordersByMonth = useMemo(() => {
    const map = new Map();
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = d.toLocaleString('default', { month: 'short' });
      map.set(key, 0);
    }

    orders.forEach((o) => {
      if (o.createdAt) {
        // Handle Firestore Timestamp or Date object or string
        let d;
        if (o.createdAt.toDate) {
          d = o.createdAt.toDate();
        } else if (o.createdAt instanceof Date) {
          d = o.createdAt;
        } else {
          d = new Date(o.createdAt);
        }

        if (!isNaN(d.getTime())) { // Check if valid date
          const key = d.toLocaleString('default', { month: 'short' });
          if (map.has(key)) {
            map.set(key, map.get(key) + 1);
          }
        }
      }
    });

    return Array.from(map, ([name, orders]) => ({ name, orders }));
  }, [orders]);

  const totalStock = useMemo(() => sugarcanes.reduce((sum, item) => sum + (Number(item.stock) || 0), 0), [sugarcanes]);
  const totalOrders = useMemo(() => orders.length, [orders]);
  const totalRevenue = useMemo(() => orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0), [orders]);
  const totalVarieties = useMemo(() => new Set(sugarcanes.map(s => s.variety || s.name)).size, [sugarcanes]);

  const stats = [
    {
      label: "Total Inventory",
      value: totalStock.toLocaleString(),
      change: "+12%", // Dummy trend for now
      trend: "up",
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Total Revenue",
      value: `₹${(totalRevenue / 1000).toFixed(1)}k`,
      change: "+8.5%",
      trend: "up",
      icon: IndianRupee,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Total Orders",
      value: totalOrders.toLocaleString(),
      change: "+24%",
      trend: "up",
      icon: ShoppingBag,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      label: "Varieties",
      value: totalVarieties,
      change: "Stable",
      trend: "neutral",
      icon: Layers,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-0 font-['Inter',sans-serif]">
      <div className="w-full px-4 py-2">
        {/* 1. Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4">
          <div>
            <h3 className="text-xl mb-2 text-gray-900 font-extrabold">
              Reports & Analytics
            </h3>
            <p className="text-base text-gray-600 font-normal mb-0">
              Overview of your nursery's performance
            </p>
          </div>
          <div className="flex gap-2">
            <button
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
              style={{ borderRadius: "12px" }}
            >
              <Printer size={16} />
              <span>Print</span>
            </button>
            <button
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
              style={{ borderRadius: "12px" }}
            >
              <Download size={16} />
              <span>Export</span>
            </button>
          </div>
        </div>
        <hr className="mt-4 mb-5 border-gray-100" />

        {/* 2. Filter Bar */}
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
            <div className="lg:col-span-10 relative">
              <Search
                className="absolute text-gray-400 left-3 top-1/2 -translate-y-1/2"
                size={16}
              />
              <input
                type="text"
                placeholder="Search reports..."
                className="w-full pl-9 pr-4 py-2 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
            <div className="lg:col-span-2">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3 py-2 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
              >
                <option>This Month</option>
                <option>Last 3 Months</option>
                <option>This Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3. KPI Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    {stat.label}
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </h3>
                  <div className={`inline-flex items-center gap-1 text-xs font-medium ${stat.trend === "up" ? "text-green-600" : "text-gray-600"}`}>
                    {stat.trend === "up" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {stat.change}
                    <span className="text-gray-400 font-normal ml-1">vs last month</span>
                  </div>
                </div>
                <div className={`p-2 rounded-lg ${stat.bgColor} ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 4. Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Order Trend */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
              <div>
                <h6 className="font-semibold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="text-green-600" size={18} />
                  Order Volume Trend
                </h6>
                <p className="text-sm text-gray-500 mt-1">
                  Orders over the last 6 months
                </p>
              </div>
            </div>
            <div style={{ minHeight: '320px', padding: '20px' }}>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={ordersByMonth}>
                  <defs>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                    dx={-10}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      fontSize: "13px",
                    }}
                    cursor={{ stroke: "#e5e7eb", strokeWidth: 1 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="orders"
                    stroke="#16a34a"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorOrders)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Stock by Variety */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
              <div>
                <h6 className="font-semibold text-gray-900 flex items-center gap-2">
                  <BarChart2 className="text-blue-600" size={18} />
                  Stock Distribution
                </h6>
                <p className="text-sm text-gray-500 mt-1">
                  Top varieties by stock quantity
                </p>
              </div>
            </div>
            <div style={{ minHeight: '320px', padding: '20px' }}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stockByVariety} layout="vertical" barSize={24}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f3f4f6" />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#4b5563", fontSize: 13, fontWeight: 500 }}
                    width={100}
                  />
                  <Tooltip
                    cursor={{ fill: "#f9fafb" }}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      fontSize: "13px",
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {stockByVariety.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#2563eb" : "#60a5fa"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 5. Recent Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
            <div>
              <h6 className="font-semibold text-gray-900 flex items-center gap-2">
                <Store className="text-purple-600" size={18} />
                Recent Orders
              </h6>
              <p className="text-sm text-gray-500 mt-1">
                Latest customer orders
              </p>
            </div>
            <button className="flex items-center gap-1 text-base font-medium text-blue-600 hover:text-blue-700 transition-colors">
              View All <ArrowRight size={16} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="py-3 px-5 text-sm font-bold text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="py-3 px-5 text-sm font-bold text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="py-3 px-5 text-sm font-bold text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="py-3 px-5 text-sm font-bold text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="py-3 px-5 text-sm font-bold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-3 px-5 text-sm font-bold text-gray-500 uppercase tracking-wider text-right">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3 text-sm font-medium text-gray-900">
                      #{order.id.slice(0, 6)}
                    </td>
                    <td className="px-5 py-3 text-base text-gray-500">
                      {order.userName || "Guest"}
                    </td>
                    <td className="px-5 py-3 text-base text-gray-500">
                      {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : (!isNaN(new Date(order.createdAt).getTime()) ? new Date(order.createdAt).toLocaleDateString() : "N/A")}
                    </td>
                    <td className="px-5 py-3 text-base text-gray-500">
                      {order.items?.length || 0}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-sm font-medium border ${order.status === 'Completed' || order.status === 'Delivered'
                        ? "bg-green-50 text-green-700 border-green-100"
                        : order.status === 'Pending'
                          ? "bg-amber-50 text-amber-700 border-amber-100"
                          : "bg-blue-50 text-blue-700 border-blue-100"
                        }`}>
                        {order.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right font-semibold text-gray-900">
                      ₹{(order.totalAmount || 0).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-5 py-6 text-center text-gray-500">
                      No recent orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
