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
import RequestColumn from "./RequestColumn";
import { useState } from 'react';
const Statistics = () => {
  const [showModal, setShowModal] = useState(false);
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
    { ID: "1", Date: "1/6/2025",From:"Tri", To:"Thuc",BloodType:"O",Quantity:"400cc",Note:"HIV",Status:"Pending" },
    { ID: "2", Date: "22/3/2024",From:"Tri", To:"Thuc",BloodType:"O",Quantity:"400cc",Note:"...",Status:"Pending" },
    { ID: "3", Date: "10/2/2023",From:"Tri", To:"Thuc",BloodType:"O",Quantity:"400cc",Note:"...",Status:"Accepted" },
    { ID: "4", Date: "10/6/2023",From:"Tri", To:"Thuc",BloodType:"O",Quantity:"400cc",Note:"...",Status:"Rejected" },
    { ID: "5", Date: "10/3/2021",From:"Tri", To:"Thuc",BloodType:"O",Quantity:"400cc",Note:"...",Status:"Pending" },
    { ID: "6", Date: "10/6/2019",From:"Tri", To:"Thuc",BloodType:"O",Quantity:"400cc",Note:"...",Status:"Rejected" },
  ];
  return (
    <div className="flex justify-between">
      <RequestColumn data={chartData} status="Pending"/>
      <RequestColumn data={chartData} status="Rejected"/>
      <RequestColumn data={chartData} status="Accepted"/>
      
    </div>
  );
};

export default Statistics;
