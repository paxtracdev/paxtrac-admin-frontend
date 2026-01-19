import React, { useState, useMemo, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import Breadcrumbs from "../../Components/Breadcrumbs";
import CustomPagination from "../../Components/CustomPagination";
import NoData from "../../Components/NoData";
import { Modal, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import Loader from "../../Components/Loader";
import CommonCard from "../../Components/CommonCard";
import { useGetUserAnalyticsQuery } from "../../api/analyticsApi";
import CustomDropdown from "../../Components/CustomDropdown";

ModuleRegistry.registerModules([AllCommunityModule]);

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

import { Line, Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

const dateRangeOptions = [
  { label: "Last 7 Days", value: "last7days" },
  { label: "Last 30 Days", value: "last30days" },
  { label: "Last 90 Days", value: "last90days" },
  { label: "This Month", value: "thisMonth" },
  { label: "Last Month", value: "lastMonth" },
  { label: "This Year", value: "thisYear" },
  { label: "Last Year", value: "lastYear" },
  { label: "Custom Range", value: "custom" },
];

const Analytics = () => {
  const [dateRange, setDateRange] = useState("thisYear");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [queryParams, setQueryParams] = useState({
    range: "thisYear",
  });

  useEffect(() => {
    if (dateRange === "custom") {
      if (startDate && endDate) {
        setQueryParams({
          range: "custom",
          startDate,
          endDate,
        });
      }
    } else {
      setQueryParams({
        range: dateRange,
      });
    }
  }, [dateRange, startDate, endDate]);

  const { data, isLoading, error } = useGetUserAnalyticsQuery(queryParams, {
    skip:
      queryParams.range === "custom" &&
      (!queryParams.startDate || !queryParams.endDate),
  });

  if (isLoading) {
    return (
      <section className="app-content h-full overflow-auto">
        <div
          className="container d-flex justify-content-center align-items-center"
          style={{ height: "70vh" }}
        >
          <Loader size="lg" color="logo" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <div className="app-content">
        <div className="container">
          <NoData text="Reports not found" imageWidth={300} showImage={true} />
        </div>
      </div>
    );
  }
  const analytics = data?.data;

  const kpiStats = [
    {
      title: "Total Users",
      value: analytics?.metrics?.totalUsers ?? 0,
      sub: "Overall growth indicator",
    },
    {
      title: "Active Users",
      value: analytics?.metrics?.activeUsers ?? 0,
      sub: "Engagement health",
    },
    {
      title: "New Signups",
      value: analytics?.metrics?.newSignups ?? 0,
      sub: "Growth momentum",
    },
    {
      title: "User Retention",
      value: analytics?.metrics?.userRetentionRate ?? "0%",
      sub: "Product stickiness",
    },
    {
      title: "Total Revenue",
      value: `$${analytics?.metrics?.financialPerformance?.periodRevenue}`,
      sub: "Business performance",
    },
    {
      title: "Avg Revenue / User",
      value: `$${analytics?.metrics?.financialPerformance?.averageRevenuePerUser}`,
      sub: "Monetization efficiency",
    },
    {
      title: "Transactions",
      value: analytics?.metrics?.financialPerformance?.periodTransactions,
      sub: "Sales volume",
    },
  ];

  // 📈 User Growth Chart
  const userGrowthData = {
    labels: ["Total Users", "Active Users", "New Signups"],
    datasets: [
      {
        label: "Users",
        data: [
          analytics?.metrics?.totalUsers || 0,
          analytics?.metrics?.activeUsers || 0,
          analytics?.metrics?.newSignups || 0,
        ],
        borderColor: "#4f46e5",
        backgroundColor: "rgba(79,70,229,0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // 🍩 Subscription Breakdown
  const subscriptionData = {
    labels:
      analytics?.metrics?.subscriptionBreakdown?.map((item) => item.planName) ||
      [],
    datasets: [
      {
        data:
          analytics?.metrics?.subscriptionBreakdown?.map(
            (item) => item.userCount
          ) || [],
        backgroundColor: ["#6366f1", "#22c55e", "#f97316"],
      },
    ],
  };

  // 📊 Revenue Comparison
  const revenueData = {
    labels: ["This Period", "Previous Month"],
    datasets: [
      {
        label: "Revenue ($)",
        data: [
          analytics?.metrics?.financialPerformance?.periodRevenue || 0,
          analytics?.metrics?.financialPerformance?.previousMonthRevenue || 0,
        ],
        backgroundColor: ["#10b981", "#94a3b8"],
      },
    ],
  };

  // 📊 Engagement Stats
  const engagementData = {
    labels: ["Avg Events/User", "Avg Votes/User"],
    datasets: [
      {
        label: "Engagement",
        data: [
          analytics?.metrics?.averageEventsPerUser || 0,
          analytics?.metrics?.averageVotesPerUser || 0,
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
            <div className="title-heading mb-2">Analytics</div>
            <p className="title-sub-heading">
              View incoming reports and manage responses
            </p>
          </div>
        </div>

        <Breadcrumbs />

        <div className="mb-4">
          <CommonCard stats={kpiStats} />
        </div>

        <div className="d-flex gap-4 mb-3">
          <div className="col-md-3">
            <CustomDropdown
              options={dateRangeOptions}
              placeholder="Select date range"
              value={dateRange}
              onChange={(val) => setDateRange(val)}
            />
          </div>
          {/* Custom Date Inputs */}
          {dateRange === "custom" && (
            <div className="d-flex gap-2 align-items-center">
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />

              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="row g-4">
          {/* User Growth */}
          <div
            className="col-12 col-md-12 col-lg-12 col-xl-6
 "
          >
            <div className="card p-3">
              <h6 className="mb-3">User Growth</h6>
              <Line data={userGrowthData} />
            </div>
          </div>

          {/* Revenue Comparison */}
          <div
            className="col-12 col-md-12 col-lg-12 col-xl-6
"
          >
            <div className="card p-3">
              <h6 className="mb-3">Revenue Comparison</h6>
              <Bar data={revenueData} />
            </div>
          </div>

          {/* Subscription Breakdown */}
          <div
            className="col-12 col-md-12 col-lg-12 col-xl-6
"
          >
            <div className="card p-3">
              <h6 className="mb-3">Subscription Breakdown</h6>

              <div
                style={{
                  height: "300px",
                  position: "relative",
                }}
              >
                <Doughnut
                  data={subscriptionData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "top",
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>

          {/* Engagement Stats */}
          <div
            className="col-12 col-md-12 col-lg-12 col-xl-6
"
          >
            <div className="card p-3">
              <h6 className="mb-3">User Engagement</h6>
              <Bar data={engagementData} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Analytics;
