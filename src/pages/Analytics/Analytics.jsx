import React, { useState, useEffect } from "react";
import Breadcrumbs from "../../Components/Breadcrumbs";
import CustomDropdown from "../../Components/CustomDropdown";
import CommonCard from "../../Components/CommonCard";
import {
  useGetAnalyticsQuery,
  useGetChartAnalyticsQuery,
} from "../../api/analyticsApi";
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
  Users,
} from "lucide-react";
import { LoadingComponent } from "../../Components/LoadingComponent";
import NoData from "../../Components/NoData";

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

// -------- HELPERS --------
const formatValue = (value) => {
  if (value === 0) return 0;
  if (!value) return "-";
  return value;
};

const formatCurrency = (value) => {
  const number = Number(value);

  if (value === null || value === undefined || isNaN(number)) {
    return "-";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
};

const Analytics = () => {
  const [dateRange, setDateRange] = useState("thisYear");
  const { data, isLoading } = useGetAnalyticsQuery();
  const {
    data: chartData,
    isLoading: isChartLoading,
    isFetching: isChartFetching,
  } = useGetChartAnalyticsQuery(dateRange);
  const isPageLoading = isLoading ;

  const downloadReport = () => {
    if (!data?.data || !chartData?.data || isChartLoading) return;

    const rows = [];

    // HEADER
    rows.push(["Analytics Report"]);
    const selectedLabel =
      dateRangeOptions.find((opt) => opt.value === dateRange)?.label ||
      dateRange;

    rows.push([`Date Range: ${selectedLabel}`]);
    rows.push(["Generated On", new Date().toLocaleString()]);
    rows.push([]);

    /* ---------------- JOB & USER STATS ---------------- */

    rows.push(["Overview"]);
    rows.push(["Metric", "Value"]);

    rows.push(["Total Jobs", formatValue(data?.data?.totalProperties)]);
    rows.push([
      "Completed Jobs",
      formatValue(data?.data?.totalCompletedProperties),
    ]);
    rows.push(["Total Users", formatValue(data?.data?.totalUsers)]);
    rows.push(["Total Revenue", formatCurrency(data?.data?.totalRevenue)]);
    rows.push([
      "Avg Revenue Per User",
      formatCurrency(data?.data?.averageRevenuePerUser),
    ]);

    rows.push([]);

    /* ---------------- CHART DATA (IF EXISTS) ---------------- */

    if (chartData?.data?.revenue) {
      rows.push(["Revenue Comparison"]);
      rows.push(["Metric", "Value"]);

      rows.push([
        "Current Period Revenue",
        formatCurrency(chartData?.data?.revenue?.periodRevenue),
      ]);

      rows.push([
        "Previous Period Revenue",
        formatCurrency(chartData?.data?.revenue?.previousRevenue),
      ]);

      rows.push([]);
    }

    if (chartData?.data?.userGrowth) {
      rows.push(["User Growth"]);
      rows.push(["Metric", "Value"]);

      rows.push([
        "Total Users (Chart)",
        formatValue(chartData?.data?.userGrowth?.totalUsers),
      ]);

      rows.push([
        "Active Users",
        formatValue(chartData?.data?.userGrowth?.activeUsers),
      ]);

      rows.push([]);
    }

    // CSV GENERATION
    const csvContent =
      "data:text/csv;charset=utf-8," +
      rows
        .map((row) =>
          row
            .map((cell) =>
              typeof cell === "string" && cell.includes(",")
                ? `"${cell}"`
                : cell,
            )
            .join(","),
        )
        .join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `analytics-report-${dateRange}.csv`;
    link.click();
  };

  /* ---------------- KPI CARDS ---------------- */
  const kpiStats = [
    {
      title: "Total Jobs",
      value: isLoading ? "NA" : formatValue(data?.data?.totalProperties),
      icon: <Briefcase size={20} />,
    },
    {
      title: "Completed Jobs",
      value: isLoading
        ? "NA"
        : formatValue(data?.data?.totalCompletedProperties),
      icon: <CheckCircle size={20} />,
    },
    {
      title: "Total Users",
      value: isLoading ? "NA" : formatValue(data?.data?.totalUsers),
      icon: <Users size={20} />,
    },
    {
      title: "Total Revenue",
      value: isLoading ? "NA" : formatCurrency(data?.data?.totalRevenue),
      icon: <DollarSign size={20} />,
    },
    {
      title: "Avg Revenue / User",
      value: isLoading
        ? "NA"
        : formatCurrency(data?.data?.averageRevenuePerUser),
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
          chartData?.data?.userGrowth?.totalUsers || 0,
          chartData?.data?.userGrowth?.activeUsers || 0,
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
        label: "Revenue",
        data: [
          chartData?.data?.revenue?.periodRevenue || 0,
          chartData?.data?.revenue?.previousRevenue || 0,
        ],
        backgroundColor: ["#10b981", "#94a3b8"],
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

        {isPageLoading ? (
          <LoadingComponent isLoading fullScreen />
        ) : (
          <>
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
                disabled={
                  isLoading ||
                  isChartLoading ||
                  isChartFetching ||
                  !data?.data ||
                  !chartData?.data
                }
                style={{
                  opacity:
                    isLoading || isChartLoading || isChartFetching ? 0.6 : 1,
                  cursor:
                    isLoading || isChartLoading || isChartFetching
                      ? "not-allowed"
                      : "pointer",
                }}
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
                  {isChartLoading ? (
                    <LoadingComponent isLoading fullScreen />
                  ) : chartData?.data?.revenue ? (
                    <Bar data={revenueData} />
                  ) : (
                    <NoData text="No revenue data available" />
                  )}
                </div>
              </div>
              {/* User Growth */}
              <div className="col-xl-6 col-12">
                <div className="card p-3">
                  <h6 className="mb-3">User Growth</h6>
                  {isChartLoading ? (
                    <LoadingComponent isLoading fullScreen />
                  ) : chartData?.data?.userGrowth ? (
                    <Line data={userGrowthData} />
                  ) : (
                    <NoData text="No user data available" />
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
};

export default Analytics;
