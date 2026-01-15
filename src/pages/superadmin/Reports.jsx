import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import {
  Printer,
  Download,
  Search,
  TrendingUp,
  Store,
  IndianRupee,
  Briefcase,
  TrendingDown,
  MoreVertical,
  BarChart2,
  History,
  ArrowRight,
  CheckCircle2,
  Archive,
  FileSpreadsheet,
  BarChart as BarChartIcon,
  Users
} from "lucide-react";

/* --- Dummy Data for Charts --- */
const ONBOARDING_DATA = [
  { name: "Jan", nurseries: 4 },
  { name: "Feb", nurseries: 12 },
  { name: "Mar", nurseries: 18 },
  { name: "Apr", nurseries: 25 },
  { name: "May", nurseries: 42 },
  { name: "Jun", nurseries: 65 },
];

const REVENUE_DATA = [
  { name: "Pune", value: 45000 },
  { name: "Mumbai", value: 38000 },
  { name: "Nashik", value: 25000 },
  { name: "Nagpur", value: 18000 },
  { name: "Bangalore", value: 32000 },
];

/* --- Report Table Data --- */
const REPORT_HISTORY = [
  {
    id: 1,
    name: "Monthly Financial Summary",
    date: "Oct 21, 2023",
    type: "Financial",
    size: "2.4 MB",
    status: "Ready",
    icon: BarChartIcon,
    color: "blue",
  },
  {
    id: 2,
    name: "Nursery Growth Report",
    date: "Oct 15, 2023",
    type: "Analytics",
    size: "1.8 MB",
    status: "Ready",
    icon: TrendingUp,
    color: "green",
  },
  {
    id: 3,
    name: "User Activity Log",
    date: "Oct 10, 2023",
    type: "Audit",
    size: "4.2 MB",
    status: "Archived",
    icon: Users,
    color: "cyan",
  },
  {
    id: 4,
    name: "Q3 Sales Performance",
    date: "Oct 01, 2023",
    type: "Financial",
    size: "3.1 MB",
    status: "Ready",
    icon: FileSpreadsheet,
    color: "yellow",
  },
];

const KPI_STATS = [
  {
    label: "Total Nurseries",
    value: "124",
    change: "+12%",
    trend: "up",
    icon: Store,
    color: "text-green-600",
    bgColor: "bg-green-50",
    trendColor: "text-green-600 bg-green-50",
  },
  {
    label: "Total Revenue",
    value: "₹4.2M",
    change: "+8.5%",
    trend: "up",
    icon: IndianRupee,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    trendColor: "text-green-600 bg-green-50",
  },
  {
    label: "Active Plans",
    value: "1,890",
    change: "+24%",
    trend: "up",
    icon: Briefcase,
    color: "text-cyan-600",
    bgColor: "bg-cyan-50",
    trendColor: "text-green-600 bg-green-50",
  },
  {
    label: "Churn Rate",
    value: "2.4%",
    change: "-0.5%",
    trend: "down",
    icon: TrendingDown,
    color: "text-red-600",
    bgColor: "bg-red-50",
    trendColor: "text-green-600 bg-green-50",
  },
];

export default function Reports() {
  const [dateRange, setDateRange] = useState("This Month");
  const [reportType, setReportType] = useState("All Reports");

  return (
    <div className="font-sans min-h-screen p-0 bg-[#f4f6f9]">
      <div className="w-full px-4 py-3">
        {/* 1. Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Reports & Analytics
            </h1>
            <p className="text-lg text-gray-600 font-normal">
              Comprehensive insights into nursery performance
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
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors shadow-sm"
              style={{ borderRadius: "12px" }}
            >
              <Download size={16} />
              <span>Export</span>
            </button>
          </div>
        </div>
        <hr className="mt-4 mb-5 border-gray-200 opacity-10" />

        {/* 2. Advanced Filter Bar */}
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
            <div className="lg:col-span-3 relative">
              <Search
                className="absolute text-gray-400 left-3 top-1/2 -translate-y-1/2"
                size={16}
              />
              <input
                type="text"
                placeholder="Search reports..."
                className="w-full pl-9 pr-4 py-2 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
              />
            </div>
            <div className="lg:col-span-2">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3 py-2 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 cursor-pointer"
              >
                <option>Today</option>
                <option>This Week</option>
                <option>This Month</option>
                <option>Last 3 Months</option>
              </select>
            </div>
            <div className="lg:col-span-2">
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-3 py-2 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 cursor-pointer"
              >
                <option>All Reports</option>
                <option>Financial</option>
                <option>Analytics</option>
                <option>Audit Logs</option>
              </select>
            </div>
            <div className="lg:col-span-2">
              <select className="w-full px-3 py-2 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 cursor-pointer">
                <option>All Regions</option>
                <option>Maharashtra</option>
                <option>Karnataka</option>
                <option>Gujarat</option>
              </select>
            </div>

          </div>
        </div>

        {/* 3. KPI Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          {KPI_STATS.map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className="flex justify-between items-start mb-3">
                <div className={`p-2.5 rounded-lg ${stat.bgColor} ${stat.color}`}>
                  <stat.icon size={22} />
                </div>
                <div className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 ${stat.trend === "up" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                  {stat.trend === "up" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {stat.change}
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-0.5">
                  {stat.value}
                </h3>
                <p className="text-base text-gray-500 font-medium">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 4. Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Onboarding Trend */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
              <div>
                <h6 className="font-semibold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="text-green-600" size={18} />
                  Nursery Growth Trend
                </h6>
                <p className="text-sm text-gray-500 mt-1">
                  New registrations over time
                </p>
              </div>
              <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
                <MoreVertical size={18} />
              </button>
            </div>
            <div className="p-5" style={{ height: "300px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ONBOARDING_DATA}>
                  <defs>
                    <linearGradient id="colorNurseries" x1="0" y1="0" x2="0" y2="1">
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
                    dataKey="nurseries"
                    stroke="#16a34a"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorNurseries)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Regional Revenue */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
              <div>
                <h6 className="font-semibold text-gray-900 flex items-center gap-2">
                  <BarChart2 className="text-blue-600" size={18} />
                  Regional Revenue
                </h6>
                <p className="text-sm text-gray-500 mt-1">
                  Top performing locations
                </p>
              </div>
              <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
                <MoreVertical size={18} />
              </button>
            </div>
            <div className="p-5" style={{ height: "300px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={REVENUE_DATA} layout="vertical" barSize={24}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f3f4f6" />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#4b5563", fontSize: 13, fontWeight: 500 }}
                    width={80}
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
                    {REVENUE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#2563eb" : "#60a5fa"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 5. Recent Reports Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
            <div>
              <h6 className="font-semibold text-gray-900 flex items-center gap-2">
                <History className="text-cyan-600" size={18} />
                Reports History
              </h6>
              <p className="text-sm text-gray-500 mt-1">
                Recent generated reports
              </p>
            </div>
            <button className="flex items-center gap-1 text-base font-medium text-green-600 hover:text-green-700 transition-colors">
              View All <ArrowRight size={16} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="py-3 px-5 text-sm font-bold text-gray-500 uppercase tracking-wider">
                    Report Name
                  </th>
                  <th className="py-3 px-5 text-sm font-bold text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="py-3 px-5 text-sm font-bold text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="py-3 px-5 text-sm font-bold text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="py-3 px-5 text-sm font-bold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-3 px-5 text-sm font-bold text-gray-500 uppercase tracking-wider text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {REPORT_HISTORY.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-${report.color}-50 text-${report.color}-600`}>
                          <report.icon size={18} />
                        </div>
                        <span className="font-medium text-gray-900 text-base">
                          {report.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-base text-gray-500">
                      {report.date}
                    </td>
                    <td className="px-5 py-3">
                      <span className="px-2.5 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-600 border border-gray-200">
                        {report.type}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-base text-gray-500">
                      {report.size}
                    </td>
                    <td className="px-5 py-3">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium border ${report.status === "Ready"
                        ? "bg-green-50 text-green-700 border-green-100"
                        : "bg-gray-100 text-gray-600 border-gray-200"
                        }`}>
                        {report.status === "Ready" ? <CheckCircle2 size={12} /> : <Archive size={12} />}
                        {report.status}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-transparent hover:border-green-100">
                        <Download size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
