import { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import {
  Users,
  ShoppingBag,
  Trees,
  XCircle,
  TrendingUp,
  DollarSign,
  Package,
  Clock,
  Activity,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

/* -------------------- Stat Card -------------------- */
function StatCard({ title, value, change, icon, color, iconBg }) {
  return (
    <div className="h-full border-0 shadow-sm rounded-lg bg-white">
      <div className="p-3">
        <div className="flex gap-3 items-center">
          <div className="flex-1">
            <h6 className="uppercase text-gray-500 mb-2 font-semibold text-sm tracking-wider">
              {title}
            </h6>
            <h3 className="mb-0 font-bold text-gray-900 text-3xl">
              {value}
            </h3>
            <div
              className={`flex items-center mt-2 text-base ${change >= 0 ? "text-green-600" : "text-red-600"
                }`}
            >
              {change >= 0 ? (
                <TrendingUp size={14} className="mr-1" />
              ) : (
                <TrendingUp
                  size={14}
                  className="mr-1"
                  style={{ transform: "rotate(180deg)" }}
                />
              )}
              <small className="font-medium text-sm">
                {Math.abs(change)}% vs last month
              </small>
            </div>
          </div>
          <div className="text-right">
            <div
              className={`${iconBg} text-${color} rounded-xl p-3 inline-flex items-center justify-center`}
              style={{ width: "56px", height: "56px" }}
            >
              {icon}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------- Activity Item -------------------- */
function ActivityItem({ type, title, time, isPositive = true }) {
  return (
    <div className="flex items-start mb-3 pb-3 border-b border-gray-100">
      <div
        className={`rounded-full flex items-center justify-center mr-3 ${isPositive
          ? "bg-green-100 text-green-600"
          : "bg-red-100 text-red-600"
          }`}
        style={{ width: "36px", height: "36px", minWidth: "36px" }}
      >
        {isPositive ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
      </div>
      <div className="flex-1 min-w-0">
        <h6 className="mb-1 text-gray-900 font-semibold text-base">
          {title}
        </h6>
        <p className="text-gray-500 mb-0 text-sm">
          {time} ago
        </p>
      </div>
      <div className="ml-2">
        <ArrowUpRight size={16} className="text-gray-400" />
      </div>
    </div>
  );
}

/* -------------------- Dashboard -------------------- */
export default function Dashboard() {
  const growthData = useMemo(
    () => [
      { month: "Jan", planted: 250, harvested: 200 },
      { month: "Feb", planted: 280, harvested: 220 },
      { month: "Mar", planted: 320, harvested: 280 },
      { month: "Apr", planted: 400, harvested: 350 },
      { month: "May", planted: 450, harvested: 400 },
      { month: "Jun", planted: 500, harvested: 450 },
    ],
    []
  );

  const plantCategories = useMemo(
    () => [
      { name: "Flowering Plants", value: 350, color: "#10b981" },
      { name: "Indoor Plants", value: 280, color: "#3b82f6" },
      { name: "Outdoor Plants", value: 220, color: "#8b5cf6" },
      { name: "Cacti & Succulents", value: 180, color: "#f59e0b" },
    ],
    []
  );

  const recentActivities = useMemo(
    () => [
      {
        id: 1,
        type: "planting",
        title: "New batch of 50 Monstera planted",
        time: "2 hours",
        isPositive: true,
      },
      {
        id: 2,
        type: "alert",
        title: "Water level low in Greenhouse #2",
        time: "5 hours",
        isPositive: false,
      },
      {
        id: 3,
        type: "harvest",
        title: "100 Peace Lilies ready for sale",
        time: "1 day",
        isPositive: true,
      },
      {
        id: 4,
        type: "maintenance",
        title: "Scheduled maintenance: Irrigation system",
        time: "2 days",
        isPositive: true,
      },
    ],
    []
  );

  const maintenanceTasks = useMemo(
    () => [
      { id: 1, task: "Fertilize roses", status: "pending", priority: "high" },
      {
        id: 2,
        task: "Prune hedges",
        status: "in-progress",
        priority: "medium",
      },
      {
        id: 3,
        task: "Check irrigation",
        status: "completed",
        priority: "high",
      },
      { id: 4, task: "Pest control", status: "pending", priority: "medium" },
    ],
    []
  );

  return (
    <div className="w-full py-4 px-4 font-['Inter',sans-serif]">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl mb-2 text-gray-900 font-bold">Dashboard</h1>
          <p
            className="text-lg text-gray-600 font-normal mb-0"
          >
            Welcome back! Here's an overview of your nursery's performance and
            activities.
          </p>
        </div>
      </div>
      <hr className="mt-4 mb-5 border-gray-200 opacity-10" />

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 mb-4">
        <StatCard
          title="Plants in Stock"
          value="1,250"
          change={8.2}
          icon={<Trees size={24} />}
          color="success"
          iconBg="bg-green-100"
        />
        <StatCard
          title="Monthly Sales"
          value="$12,450"
          change={15.3}
          icon={<DollarSign size={24} />}
          color="primary"
          iconBg="bg-blue-100"
        />
        <StatCard
          title="New Plants"
          value="320"
          change={12.5}
          icon={<Activity size={24} />}
          color="info"
          iconBg="bg-cyan-100"
        />
        <StatCard
          title="Pending Tasks"
          value="18"
          change={-2.3}
          icon={<Clock size={24} />}
          color="warning"
          iconBg="bg-yellow-100"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 mb-4">
        {/* Revenue Chart */}
        <div className="xl:col-span-8">
          <div className="h-full border-0 shadow-sm rounded-lg bg-white">
            <div className="p-3">
              <div className="flex justify-between items-center mb-3">
                <h5 className="mb-0 font-semibold text-gray-900 text-lg">
                  Plant Growth Tracking
                </h5>
                <div>
                  <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 mr-2">
                    Monthly
                  </button>
                  <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                    Weekly
                  </button>
                </div>
              </div>
              <div style={{ height: "300px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={growthData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorPlanted"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#10b981"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#10b981"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorHarvested"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3b82f6"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" style={{ fontSize: "0.75rem" }} />
                    <YAxis style={{ fontSize: "0.75rem" }} />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <Tooltip
                      contentStyle={{
                        fontSize: "0.813rem",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="planted"
                      name="Planted"
                      stroke="#10b981"
                      fillOpacity={1}
                      fill="url(#colorPlanted)"
                    />
                    <Area
                      type="monotone"
                      dataKey="harvested"
                      name="Harvested"
                      stroke="#3b82f6"
                      fillOpacity={1}
                      fill="url(#colorHarvested)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Stock Distribution */}
        <div className="xl:col-span-4">
          <div className="h-full border-0 shadow-sm rounded-lg bg-white">
            <div className="p-3">
              <h5 className="mb-3 font-semibold text-gray-900 text-lg">
                Plant Categories
              </h5>
              <div style={{ height: "250px" }} className="mb-3">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={plantCategories}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                      label={(entry) => entry.value}
                      labelStyle={{ fontSize: "0.75rem", fontWeight: 600 }}
                    >
                      {plantCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value} plants`, "Count"]}
                      contentStyle={{
                        fontSize: "0.813rem",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3">
                {plantCategories.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center mb-2"
                  >
                    <div className="flex items-center">
                      <span
                        className="mr-2 inline-block rounded-full"
                        style={{
                          backgroundColor: item.color,
                          width: "10px",
                          height: "10px",
                        }}
                      ></span>
                      <span className="text-gray-500 text-base">
                        {item.name}
                      </span>
                    </div>
                    <span className="font-semibold text-gray-900 text-base">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Recent Activities */}
        <div>
          <div className="h-full border-0 shadow-sm rounded-lg bg-white">
            <div className="p-3">
              <div className="flex justify-between items-center mb-3">
                <h5 className="mb-0 font-semibold text-gray-900 text-lg">
                  Recent Activities
                </h5>
                <a
                  href="#"
                  className="text-sm text-green-600 hover:text-green-700 no-underline"
                >
                  View All
                </a>
              </div>
              <div>
                {recentActivities.map((activity) => (
                  <ActivityItem
                    key={activity.id}
                    type={activity.type}
                    title={activity.title}
                    time={activity.time}
                    isPositive={activity.isPositive}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Performance */}
        <div>
          <div className="h-full border-0 shadow-sm rounded-lg bg-white">
            <div className="p-3">
              <h5 className="mb-3 font-semibold text-gray-900 text-lg">
                Maintenance Schedule
              </h5>
              <div className="mb-3">
                <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
                  <span className="text-gray-900 text-base">
                    Irrigation System
                  </span>
                  <span className="px-2 py-1 bg-green-500 text-white text-sm rounded">
                    Active
                  </span>
                </div>
                <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
                  <span className="text-gray-900 text-base">
                    Greenhouse Temp
                  </span>
                  <span className="text-green-600 font-semibold text-base">
                    24°C
                  </span>
                </div>
                <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
                  <span className="text-gray-900 text-base">
                    Soil Moisture
                  </span>
                  <span className="text-green-600 font-semibold text-base">
                    Optimal
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <h6 className="mb-3 font-semibold text-gray-900 text-lg">
                  Upcoming Tasks
                </h6>
                {maintenanceTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex justify-between items-center mb-2 pb-2 border-b border-gray-100"
                  >
                    <div className="flex items-center min-w-0">
                      <div
                        className={`mr-2 text-lg ${task.priority === "high"
                          ? "text-red-500"
                          : "text-yellow-500"
                          }`}
                      >
                        {task.priority === "high" ? "❗" : "🔸"}
                      </div>
                      <span
                        className={`text-base ${task.status === "completed"
                          ? "line-through text-gray-400"
                          : "text-gray-900"
                          }`}
                      >
                        {task.task}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-0.5 ml-2 text-sm whitespace-nowrap rounded ${task.status === "completed"
                        ? "bg-green-500 text-white"
                        : task.status === "in-progress"
                          ? "bg-cyan-500 text-white"
                          : "bg-gray-500 text-white"
                        }`}
                    >
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
