import {
  BarChart,
  PieChart,
  Bar,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from "recharts";
import { FiUsers } from "react-icons/fi";
import { BsDroplet, BsMegaphone } from "react-icons/bs";
import { useOutletContext } from "react-router-dom";

const Statistics = () => {
  const { darkMode } = useOutletContext();
  const statsData = [
    {
      name: "Total Donations",
      value: 1500,
      icon: <BsDroplet />,
      color: "bg-gradient-to-tr from-red-400 to-red-600",
    },
    {
      name: "Registered Donors",
      value: 3200,
      icon: <FiUsers />,
      color: "bg-gradient-to-tr from-blue-400 to-blue-600",
    },
    {
      name: "Active Campaigns",
      value: 25,
      icon: <BsMegaphone />,
      color: "bg-gradient-to-tr from-green-400 to-green-600",
    },
  ];

  const chartData = [
    { month: "Jan", donations: 65 },
    { month: "Feb", donations: 59 },
    { month: "Mar", donations: 80 },
    { month: "Apr", donations: 81 },
    { month: "May", donations: 56 },
    { month: "Jun", donations: 55 },
  ];
  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {statsData.map((stat) => (
          <div
            key={stat.name}
            className={`p-6 rounded-lg shadow-md ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400">{stat.name}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
              </div>
              <div className={`${stat.color} p-3 rounded-full text-white`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div
          className={`p-6 rounded-lg shadow-md ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h3 className="text-lg font-semibold mb-4">Monthly Donations</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="donations">
  {chartData.map((entry, index) => {
    const colors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];
    return (
      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
    );
  })}
</Bar>

            </BarChart>
          </ResponsiveContainer>
        </div>
        <div
          className={`p-6 rounded-lg shadow-md ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h3 className="text-lg font-semibold mb-4">
            Blood Type Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: "A+", value: 30, fill: "#f87171" }, // light red
                  { name: "B+", value: 25, fill: "#60a5fa" }, // blue
                  { name: "O+", value: 45, fill: "#34d399" }, // green
                ]}
                dataKey="value"
                nameKey="name"
              />

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
