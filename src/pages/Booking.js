"use client";
import React, { useEffect, useMemo, useState } from "react";
import moment from "moment";
import { Api } from "@/services/service";
import Table from "../../components/table";
import isAuth from "../../components/isAuth";
import { useRouter } from "next/router";
import {
  X,
  Calendar,
  User,
  Phone,
  IndianRupee,
  CreditCard,
  Home,
  Clock,
} from "lucide-react";

function AdminBooking(props) {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const getBookings = async () => {
    setLoading(true);
    Api("get", "booking/getAllBookings", {}, router).then(
      (res) => {
        setBookings(res?.data || []);
        setLoading(false);
      },
      () => setLoading(false)
    );
  };

  useEffect(() => {
    getBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    if (filterStatus === "all") return bookings;
    return bookings.filter((b) => b.status === filterStatus);
  }, [bookings, filterStatus]);

  const getStatusColor = (status) => {
    const colors = {
      confirmed: "bg-green-100 text-green-700 border-green-300",
      pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
      cancelled: "bg-red-100 text-red-700 border-red-300",
      completed: "bg-blue-100 text-blue-700 border-blue-300",
    };
    return (
      colors[status?.toLowerCase()] ||
      "bg-gray-100 text-gray-700 border-gray-300"
    );
  };

  const columns = useMemo(
    () => [
      {
        Header: "Visit Date",
        accessor: "visitDate",
        Cell: ({ value }) => (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-orange-500" />
            <span className="font-medium">
              {moment(value).format("DD MMM YYYY")}
            </span>
          </div>
        ),
      },
      {
        Header: "User Details",
        Cell: ({ row }) => (
          <div className="space-y-1">
            <div className="font-medium text-gray-900">
              {row.original.user?.name || ""}
            </div>
            <div className="text-sm text-gray-500 flex items-center gap-1">
              <Phone className="w-3 h-3" />
              {row.original.user?.phone || "N/A"}
            </div>
          </div>
        ),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => (
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
              value
            )}`}
          >
            {value?.toUpperCase() || "N/A"}
          </span>
        ),
      },
      {
        Header: "Amount",
        accessor: "totalAmount",
        Cell: ({ value }) => (
          <div className="flex items-center gap-1 font-semibold text-gray-900">
            <IndianRupee className="w-4 h-4" />
            {value?.toLocaleString("en-IN") || 0}
          </div>
        ),
      },
      {
        Header: "Action",
        Cell: ({ row }) => (
          <button
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-sm hover:shadow-md font-medium cursor-pointer"
            onClick={() => {
              setSelectedBooking(row.original);
              setOpen(true);
            }}
          >
            View Details
          </button>
        ),
      },
    ],
    []
  );

  const stats = useMemo(() => {
    const total = bookings.length;
    const confirmed = bookings.filter((b) => b.status === "confirmed").length;
    const pending = bookings.filter((b) => b.status === "requested").length;
    const totalRevenue = bookings.reduce(
      (sum, b) => sum + (b.totalAmount || 0),
      0
    );
    return { total, confirmed, pending, totalRevenue };
  }, [bookings]);

  return (
    <>
      <section className=" bg-black p-6">
        <div className="max-w-7xl mx-auto h-[95vh] overflow-y-scroll scrollbar-hide pb-28 ">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              PG Visit Bookings - Indore
            </h1>
            <p className="text-gray-300">
              Manage all your property visit bookings
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-orange-100 p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Total Bookings</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.total}
                  </p>
                </div>
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-orange-100 p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Confirmed</p>
                  <p className="text-3xl font-bold text-green-600">
                    {stats.confirmed}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-orange-100 p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Request</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {stats.pending}
                  </p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-orange-100 p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Total Revenue</p>
                  <p className="text-3xl font-bold text-blue-600">
                    ₹{stats.totalRevenue.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <IndianRupee className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className=" p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setFilterStatus("all")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filterStatus === "all"
                    ? "bg-orange-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All ({bookings.length})
              </button>
              <button
                onClick={() => setFilterStatus("confirmed")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filterStatus === "confirmed"
                    ? "bg-green-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Confirmed ({stats.confirmed})
              </button>
              <button
                onClick={() => setFilterStatus("pending")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filterStatus === "pending"
                    ? "bg-yellow-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Pending ({stats.pending})
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
                <p className="mt-4 text-gray-600 font-medium">
                  Loading bookings...
                </p>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="text-center py-20">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-medium">
                  No bookings found
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Try changing the filter or check back later
                </p>
              </div>
            ) : (
              <Table columns={columns} data={filteredBookings} />
            )}
          </div>
        </div>
      </section>

      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/80 bg-opacity-50 z-40 transition-opacity"
            onClick={() => setOpen(false)}
          />
          <div className="fixed right-0 top-0 h-full w-full md:w-[40vw] max-w-full bg-gradient-to-br from-orange-50 to-white shadow-2xl z-50 transform transition-transform duration-300 ease-out overflow-y-auto">
            {selectedBooking && (
              <>
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white sticky top-0 z-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold mb-1">
                        Booking Details
                      </h2>
                      <p className="text-orange-100 text-sm">
                        ID: {selectedBooking._id?.slice(-8)}
                      </p>
                    </div>
                    <button
                      onClick={() => setOpen(false)}
                      className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

              
                <div className="p-6 space-y-6 pb-24">
              
                  <div className="flex justify-center">
                    <span
                      className={`px-6 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
                        selectedBooking.status
                      )}`}
                    >
                      {selectedBooking.status?.toUpperCase()}
                    </span>
                  </div>

                  {/* User Info */}
                  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-orange-100 p-2 rounded-lg">
                        <User className="w-5 h-5 text-orange-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        User Information
                      </h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Full Name</p>
                        <p className="font-medium text-gray-900">
                          {selectedBooking.user?.name || ""}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Mobile Number
                        </p>
                        <p className="font-medium text-gray-900 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          {selectedBooking.user?.number}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Visit Details */}
                  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        Visit Details
                      </h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Visit Date</p>
                        <p className="font-medium text-gray-900">
                          {moment(selectedBooking.visitDate).format(
                            "dddd, MMMM Do YYYY"
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Room ID</p>
                        <p className="font-medium text-gray-900 flex items-center gap-2">
                          <Home className="w-4 h-4 text-gray-400" />
                          {selectedBooking.roomId?._id || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <CreditCard className="w-5 h-5 text-green-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        Payment Information
                      </h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Total Amount
                        </p>
                        <p className="font-bold text-2xl text-gray-900 flex items-center gap-1">
                          <IndianRupee className="w-5 h-5" />
                          {selectedBooking.totalAmount?.toLocaleString("en-IN")}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Payment Method
                        </p>
                        <p className="font-medium text-gray-900">
                          {selectedBooking.paymentMethod || "Not Specified"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="fixed bottom-0 right-0 w-[450px] max-w-full p-6 bg-white border-t border-gray-200">
                  <button
                    onClick={() => setOpen(false)}
                    className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default isAuth(AdminBooking);
