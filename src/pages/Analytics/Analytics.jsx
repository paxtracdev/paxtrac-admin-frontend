import React, { useState, useEffect } from "react";
import Breadcrumbs from "../../Components/Breadcrumbs";
import CustomDropdown from "../../Components/CustomDropdown";
import CommonCard from "../../Components/CommonCard";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line, Bar } from "react-chartjs-2";
import {
  Briefcase,
  CheckCircle,
  DollarSign,
  Download,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
);

/* ---------------- DATE RANGE OPTIONS ---------------- */

const dateRangeOptions = [
  { label: "Last 7 Days", value: "last7days" },
  { label: "Last 30 Days", value: "last30days" },
  { label: "Last 90 Days", value: "last90days" },
  { label: "This Month", value: "thisMonth" },
  { label: "This Year", value: "thisYear" },
];

/* ---------------- STATIC ANALYTICS DATA ---------------- */

const STATIC_ANALYTICS = {
  jobStats: {
    totalJobs: 1240,
    completedJobs: 980,
    pendingJobs: 180,
    cancelledJobs: 80,
  },

  userMetrics: {
    totalUsers: 5400,
    activeUsers: 3870,
    newSignups: 620,
    retentionRate: "72%",
  },

  revenueMetrics: {
    periodRevenue: 124500,
    previousRevenue: 102300,
    avgRevenuePerUser: 23.05,
    transactions: 3120,
  },

  engagement: {
    avgJobsPerUser: 4.2,
    avgReviewsPerUser: 1.8,
  },
};

const Analytics = () => {
  const [dateRange, setDateRange] = useState("thisYear");
  const [analytics, setAnalytics] = useState(STATIC_ANALYTICS);

  useEffect(() => {
    // simulate filtered chart data
    const multiplierMap = {
      last7days: 0.1,
      last30days: 0.3,
      last90days: 0.6,
      thisMonth: 0.4,
      thisYear: 1,
    };

    const m = multiplierMap[dateRange];

    setAnalytics({
      jobStats: {
        totalJobs: Math.round(STATIC_ANALYTICS.jobStats.totalJobs * m),
        completedJobs: Math.round(STATIC_ANALYTICS.jobStats.completedJobs * m),
        pendingJobs: Math.round(STATIC_ANALYTICS.jobStats.pendingJobs * m),
        cancelledJobs: Math.round(STATIC_ANALYTICS.jobStats.cancelledJobs * m),
      },
      userMetrics: {
        ...STATIC_ANALYTICS.userMetrics,
        activeUsers: Math.round(STATIC_ANALYTICS.userMetrics.activeUsers * m),
        newSignups: Math.round(STATIC_ANALYTICS.userMetrics.newSignups * m),
      },
      revenueMetrics: {
        ...STATIC_ANALYTICS.revenueMetrics,
        periodRevenue: Math.round(
          STATIC_ANALYTICS.revenueMetrics.periodRevenue * m,
        ),
      },
      engagement: STATIC_ANALYTICS.engagement,
    });
  }, [dateRange]);

  const downloadReport = () => {
    // ---------- CSV GENERATION ----------
    const rows = [];

    // HEADER
    rows.push(["Analytics Report"]);
    rows.push([`Date Range: ${dateRange}`]);
    rows.push(["Generated On", new Date().toLocaleString()]);
    rows.push([]);

    // JOB STATISTICS
    rows.push(["Job Statistics"]);
    rows.push(["Metric", "Value"]);
    rows.push(["Total Jobs", analytics.jobStats.totalJobs]);
    rows.push(["Completed Jobs", analytics.jobStats.completedJobs]);
    rows.push(["Pending Jobs", analytics.jobStats.pendingJobs]);
    rows.push(["Cancelled Jobs", analytics.jobStats.cancelledJobs]);
    rows.push([]);

    // USER METRICS
    rows.push(["User Metrics"]);
    rows.push(["Metric", "Value"]);
    rows.push(["Active Users", analytics.userMetrics.activeUsers]);
    rows.push(["New Signups", analytics.userMetrics.newSignups]);
    rows.push(["Retention Rate", analytics.userMetrics.retentionRate]);
    rows.push([]);

    // REVENUE ANALYTICS
    rows.push(["Revenue Analytics"]);
    rows.push(["Metric", "Value"]);
    rows.push([
      "Current Period Revenue",
      analytics.revenueMetrics.periodRevenue,
    ]);
    rows.push([
      "Previous Period Revenue",
      analytics.revenueMetrics.previousRevenue,
    ]);
    rows.push([
      "Avg Revenue Per User",
      analytics.revenueMetrics.avgRevenuePerUser,
    ]);
    rows.push(["Transactions", analytics.revenueMetrics.transactions]);
    rows.push([]);

    // PLATFORM ENGAGEMENT
    rows.push(["Platform Engagement"]);
    rows.push(["Metric", "Value"]);
    rows.push(["Avg Jobs Per User", analytics.engagement.avgJobsPerUser]);
    rows.push(["Avg Reviews Per User", analytics.engagement.avgReviewsPerUser]);

    rows.push([]);

    // ---------- CSV GENERATION ----------
    const csvContent =
      "data:text/csv;charset=utf-8," +
      rows.map((row) => row.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `analytics-report-${dateRange}.csv`;
    link.click();
  };

  /* ---------------- KPI CARDS ---------------- */
  const kpiStats = [
    {
      title: "Total Jobs",
      value: STATIC_ANALYTICS.jobStats.totalJobs,
      icon: <Briefcase size={20} />,
    },
    {
      title: "Completed Jobs",
      value: STATIC_ANALYTICS.jobStats.completedJobs,
      icon: <CheckCircle size={20} />,
    },
    {
      title: "Active Users",
      value: STATIC_ANALYTICS.userMetrics.activeUsers,
      icon: <Users size={20} />,
    },
    {
      title: "Total Revenue",
      value: `$${STATIC_ANALYTICS.revenueMetrics.periodRevenue}`,
      icon: <DollarSign size={20} />,
    },
    {
      title: "Avg Revenue / User",
      value: `$${STATIC_ANALYTICS.revenueMetrics.avgRevenuePerUser}`,
      icon: <TrendingUp size={20} />,
    },
  ];

  /* ---------------- CHART DATA ---------------- */

  // 📈 User Growth
  const userGrowthData = {
    labels: ["Total Users", "Active Users"],
    datasets: [
      {
        label: "Users",
        data: [
          analytics.userMetrics.totalUsers,
          analytics.userMetrics.activeUsers,
          analytics.userMetrics.newSignups,
        ],
        borderColor: "#4f46e5",
        backgroundColor: "rgba(79,70,229,0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // 📊 Revenue Analytics
  const revenueData = {
    labels: ["Current Period", "Previous Period"],
    datasets: [
      {
        label: "Revenue ($)",
        data: [
          analytics.revenueMetrics.periodRevenue,
          analytics.revenueMetrics.previousRevenue,
        ],
        backgroundColor: ["#10b981", "#94a3b8"],
      },
    ],
  };

  // 📊 Platform Engagement
  const engagementData = {
    labels: ["Avg Jobs/User", "Avg Reviews/User"],
    datasets: [
      {
        label: "Engagement",
        data: [
          analytics.engagement.avgJobsPerUser,
          analytics.engagement.avgReviewsPerUser,
        ],
        backgroundColor: ["#0ea5e9", "#f59e0b"],
      },
    ],
  };

  return (
    <main className="app-content body-bg">
      <section className="container">
        {/* HEADER */}
        <div className="d-flex justify-content-between mb-4">
          <div>
            <h1 className="title-heading mb-2">Analytics</h1>
            <p className="title-sub-heading">
              Job statistics, user growth, revenue & engagement insights
            </p>
          </div>
        </div>

        <Breadcrumbs />

        {/* KPI CARDS */}
        <div className="mb-4">
          <CommonCard stats={kpiStats} />
        </div>

        <div className="d-flex align-items-center justify-content-between mb-3">
          {/* FILTER */}
          <div className="col-md-4">
            <CustomDropdown
              options={dateRangeOptions}
              placeholder="Select date range"
              value={dateRange}
              onChange={setDateRange}
            />
          </div>

          <button
            className="login-btn"
            onClick={downloadReport}
            disabled={!analytics}
          >
            <Download size={18} /> Generate Report
          </button>
        </div>

        {/* CHARTS */}

        <div className="row g-4">
          {/* Revenue */}
          <div className="col-xl-6 col-12">
            <div className="card p-3">
              <h6 className="mb-3">Revenue Analytics</h6>
              <Bar data={revenueData} />
            </div>
          </div>
          {/* User Growth */}
          <div className="col-xl-6 col-12">
            <div className="card p-3">
              <h6 className="mb-3">User Growth</h6>
              <Line data={userGrowthData} />
            </div>
          </div>

          {/* Engagement */}
          <div className="col-xl-6 col-12">
            <div className="card p-3">
              <h6 className="mb-3">Platform Engagement</h6>
              <Bar data={engagementData} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Analytics;
