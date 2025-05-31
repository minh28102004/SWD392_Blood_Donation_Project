import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiEye,
  FiRotateCw,
  FiUser,
  FiPhone,
  FiHeart,
  FiCalendar,
  FiDroplet,
  FiClipboard,
  FiActivity,
  FiFilter,
} from "react-icons/fi";
import TableComponent from "@components/Table";

const BloodDonationTracker = () => {
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter states
  const [statusFilter, setStatusFilter] = useState("all");
  const [bloodTypeFilter, setBloodTypeFilter] = useState("all");
  const [submissionTypeFilter, setSubmissionTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    // Mock data
    const mockData = [
      {
        id: 1,
        fullName: "John Doe",
        age: 28,
        bloodType: "A+",
        phone: "12345678900",
        height: "175cm",
        weight: "70kg",
        submissionType: "Donation",
        status: "pending",
        bloodComponent: "Whole Blood",
        quantity: 1,
        preferredDate: "2024-02-15",
        medicalHistory: "No chronic conditions",
      },
      {
        id: 2,
        fullName: "John Doe",
        age: 28,
        bloodType: "O-",
        phone: "2345678901",
        height: "162cm",
        weight: "60kg",
        submissionType: "Request",
        status: "approved",
        bloodComponent: "Platelets",
        quantity: 2,
        preferredDate: "2024-02-16",
        medicalHistory: "Previous surgery in 2020",
      },
      {
        id: 3,
        fullName: "John Doe",
        age: 28,
        bloodType: "B+",
        phone: "345678902",
        height: "180cm",
        weight: "80kg",
        submissionType: "Donation",
        status: "rejected",
        bloodComponent: "Plasma",
        quantity: 1,
        preferredDate: "2024-02-17",
        medicalHistory: "Hypertension",
      },
    ];
    setSubmissions(mockData);
  }, []);

  const getStatusColor = (status) => {
    const statusColors = {
      pending:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-200",
      approved:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      inProgress:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    };
    return (
      statusColors[status] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
    );
  };

  const getDetailBgColor = (status) => {
    const map = {
      pending:
        "bg-gradient-to-br from-yellow-50 to-yellow-50 dark:from-gray-700 dark:to-gray-700",
      approved:
        "bg-gradient-to-br from-emerald-50 to-green-50 dark:from-gray-700 dark:to-gray-700",
      rejected:
        "bg-gradient-to-br from-rose-50 to-red-50 dark:from-gray-700 dark:to-gray-700",
      inProgress:
        "bg-gradient-to-br from-sky-50 to-blue-50 dark:from-gray-700 dark:to-gray-700",
    };
    return (
      map[status] ||
      "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-700"
    );
  };

  // Options lọc
  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "inProgress", label: "In Progress" },
  ];
  const bloodTypeOptions = [
    { value: "all", label: "All Blood Types" },
    { value: "A+", label: "A+" },
    { value: "A-", label: "A-" },
    { value: "B+", label: "B+" },
    { value: "B-", label: "B-" },
    { value: "AB+", label: "AB+" },
    { value: "AB-", label: "AB-" },
    { value: "O+", label: "O+" },
    { value: "O-", label: "O-" },
  ];
  const submissionTypeOptions = [
    { value: "all", label: "All Types" },
    { value: "Donation", label: "Donation" },
    { value: "Request", label: "Request" },
  ];

  // Lọc dữ liệu
  const filteredSubmissions = submissions.filter((submission) => {
    const matchesStatus =
      statusFilter === "all" || submission.status === statusFilter;

    const matchesBloodType =
      bloodTypeFilter === "all" || submission.bloodType === bloodTypeFilter;

    const matchesSubmissionType =
      submissionTypeFilter === "all" ||
      submission.submissionType === submissionTypeFilter;

    const matchesDate =
      dateFilter === "" || submission.preferredDate === dateFilter;

    return (
      matchesStatus && matchesBloodType && matchesSubmissionType && matchesDate
    );
  });

  // Cấu hình bảng
  const columns = [
    { key: "fullName", title: "Name", width: "18%" },
    { key: "age", title: "Age", width: "8%" },
    { key: "bloodType", title: "Blood Type", width: "12%" },
    { key: "quantity", title: "Quantity Unit", width: "10%" },
    { key: "preferredDate", title: "Date", width: "15%" },
    { key: "submissionType", title: "Type", width: "12%" },
    {
      key: "status",
      title: "Status",
      width: "12%",
      render: (value) => (
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
            value
          )}`}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      width: "13%",
      render: (_, row) => (
        <button
          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-500 font-medium transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedSubmission(row);
            setIsModalOpen(true);
          }}
          aria-label={`View details of ${row.fullName}`}
          type="button"
        >
          <FiEye />
          View Details
        </button>
      ),
    },
  ];

  // Thêm onRowClick cho mỗi dòng
  const dataWithClick = filteredSubmissions.map((item) => ({
    ...item,
    onRowClick: () => {
      setSelectedSubmission(item);
      setIsModalOpen(true);
    },
  }));

  // Nút reset filter
  const clearFilters = () => {
    setStatusFilter("all");
    setBloodTypeFilter("all");
    setSubmissionTypeFilter("all");
    setDateFilter("");
  };

  // Detail item component with icon
  const DetailItem = ({ label, value, bgColor, icon: Icon }) => (
    <div
      className={`${bgColor} rounded-md p-4 shadow-md hover:shadow-lg transition-shadow duration-300 select-text flex flex-col items-center cursor-default transform hover:scale-105`}
    >
      <Icon className="text-xl mb-1 text-gray-500 dark:text-white" />
      <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-white mb-1">
        {label}
      </p>
      <p className="text-lg font-medium text-center">{value}</p>
    </div>
  );

  // Modal hiển thị chi tiết theo yêu cầu
  const SubmissionModal = ({ submission, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-6 z-50">
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl ring-1 ring-black ring-opacity-5">
        {/* Header */}
        <div className="relative flex items-center justify-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white truncate max-w-[80%] text-center">
            {submission.fullName}
          </h2>
          <button
            onClick={onClose}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-4xl font-bold leading-none"
            aria-label="Close modal"
            type="button"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-gray-800 dark:text-gray-300">
          {/* Personal Details */}
          <section
            className={`${getDetailBgColor(
              submission.status
            )} rounded-xl p-4 shadow-inner`}
          >
            <h3
              className={`text-xl font-semibold mb-4 border-b pb-2 ${
                submission.status === "pending"
                  ? "border-yellow-200 dark:border-white text-yellow-700 dark:text-white"
                  : submission.status === "approved"
                  ? "border-green-300 dark:border-white text-green-700 dark:text-white"
                  : submission.status === "rejected"
                  ? "border-red-300 dark:border-white text-red-700 dark:text-white"
                  : submission.status === "inProgress"
                  ? "border-blue-300 dark:border-white text-blue-700 dark:text-white"
                  : "border-gray-300 dark:border-white text-gray-900 dark:text-white"
              }`}
            >
              Personal Details
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <DetailItem
                label="Age"
                value={submission.age}
                bgColor="bg-white dark:bg-gray-800"
                icon={FiUser}
              />
              <DetailItem
                label="Phone"
                value={submission.phone ? `+84${submission.phone}` : ""}
                bgColor="bg-white dark:bg-gray-800"
                icon={FiPhone}
              />
              <DetailItem
                label="Status"
                value={
                  <span
                    className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                      submission.status
                    )}`}
                  >
                    {submission.status.charAt(0).toUpperCase() +
                      submission.status.slice(1)}
                  </span>
                }
                bgColor="bg-white dark:bg-gray-800"
                icon={FiHeart}
              />
              <DetailItem
                label="Preferred Date"
                value={submission.preferredDate}
                bgColor="bg-white dark:bg-gray-800"
                icon={FiCalendar}
              />
            </div>
          </section>

          {/* Medical History */}
          <section className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-700 rounded-lg p-4 shadow-inner">
            <h3 className="text-xl font-semibold mb-4 border-b border-blue-300 dark:border-white pb-2 text-blue-700 dark:text-white">
              Medical History
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
              <DetailItem
                label="Blood Type"
                value={submission.bloodType}
                bgColor="bg-white dark:bg-gray-800"
                icon={FiDroplet}
              />
              <DetailItem
                label="Blood Component"
                value={submission.bloodComponent}
                bgColor="bg-white dark:bg-gray-800"
                icon={FiClipboard}
              />
              <DetailItem
                label="Quantity (Units)"
                value={submission.quantity}
                bgColor="bg-white dark:bg-gray-800"
                icon={FiActivity}
              />
              <DetailItem
                label="Height"
                value={submission.height || "N/A"}
                bgColor="bg-white dark:bg-gray-800"
                icon={FiUser}
              />
              <DetailItem
                label="Weight"
                value={submission.weight || "N/A"}
                bgColor="bg-white dark:bg-gray-800"
                icon={FiActivity}
              />
              <DetailItem
                label="Medical History"
                value={
                  submission.medicalHistory || "No medical history provided."
                }
                bgColor="bg-white dark:bg-gray-800"
                icon={FiFilter}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 dark:text-white rounded-xl shadow-md p-6 mb-8 space-y-6">
          <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white select-none">
            Request History
          </h1>
          {/* Filters & Search */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            {/* Status filter */}
            <select
              className="flex-shrink-0 h-10 rounded-lg border border-gray-300 dark:border-gray-400 bg-gray-50 dark:bg-gray-700 px-4 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition min-w-[140px]"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* Blood type filter */}
            <select
              className="flex-shrink-0 h-10 rounded-lg border border-gray-300 dark:border-gray-400 bg-gray-50 dark:bg-gray-700 px-4 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition min-w-[140px]"
              value={bloodTypeFilter}
              onChange={(e) => setBloodTypeFilter(e.target.value)}
            >
              {bloodTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* Submission type filter */}
            <select
              className="flex-shrink-0 h-10 rounded-lg border border-gray-300 dark:border-gray-400 bg-gray-50 dark:bg-gray-700 px-4 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition min-w-[140px]"
              value={submissionTypeFilter}
              onChange={(e) => setSubmissionTypeFilter(e.target.value)}
            >
              {submissionTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* Date filter */}
            <input
              type="date"
              className="flex-shrink-0 h-10 rounded-lg border border-gray-300 dark:border-gray-400 bg-gray-50 dark:bg-gray-700 px-4 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition min-w-[140px]"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              placeholder="Select date"
              aria-label="Filter by date"
            />

            {/* Clear button */}
            <button
              type="button"
              onClick={clearFilters}
              title="Clear all filters"
              className="flex items-center bg-gradient-to-br from-sky-400 to-blue-500 justify-center p-1.5 rounded-lg text-white hover:brightness-90 transition-transform duration-200 hover:scale-105"
            >
              <FiRotateCw size={22} />
            </button>
          </div>

          {/* Data table */}
          <TableComponent columns={columns} data={dataWithClick} />
        </div>
      </div>

      {/* Modal detail */}
      {isModalOpen && selectedSubmission && (
        <SubmissionModal
          submission={selectedSubmission}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedSubmission(null);
          }}
        />
      )}
    </div>
  );
};

export default BloodDonationTracker;
