import React, { useMemo, useState, useEffect } from "react";
import Table from "../../components/table";
import { indexID } from "../../components/reported/customTableAct";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import moment from "moment";
import isAuth from "../../components/isAuth";
import {
    Search,
    Calendar,
    Filter,
    X,
    Eye,
    Phone,
    Mail,
    User,
    XCircle,
} from "lucide-react";
import { GiEmptyChessboard } from "react-icons/gi";

function Queries(props) {
    const router = useRouter();
    const [queries, setQueries] = useState([]);
    const [viewPopup, setViewPopup] = useState(false);
    const [popupData, setPopupData] = useState({});
    const [selectedDate, setSelectedDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [searchParams, setSearchParams] = useState({
        name: "",
        phone: null,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(popupData.status || 'pending');
    const [pagination, setPagination] = useState({
        totalPages: 1,
        currentPage: 1,
        itemsPerPage: 10,
    });

    const primaryColor = "#F38529"; // The specified orange color code

    useEffect(() => {
        fetchQueries(null, currentPage);
    }, [currentPage]);

    const fetchQueries = async (selectedDate, page = 1, limit = 10) => {
        const data = {};

        if (selectedDate) {
            data.curDate = moment(new Date(selectedDate)).format();
        }

        if (searchParams.name) {
            data.fullName = searchParams.name;
        }

        const phoneValue = Number(searchParams.phone);
        if (!isNaN(phoneValue) && searchParams.phone !== "") {
            data.phoneNumber = phoneValue;
        }

        setIsLoading(true);
        props.loader(true);

        try {
            const res = await Api(
                "post",
                `contact/getAllFeedback?page=${page}&limit=${limit}`,
                data,
                router
            );

            props.loader(false);
            setIsLoading(false);

            if (res?.status) {
                setQueries(res?.data);
                setPagination(res?.pagination);
                setCurrentPage(res?.pagination?.currentPage);
            } else {
                props.toaster({
                    type: "error",
                    message: res?.data?.message || "Failed to fetch queries",
                });
            }
        } catch (err) {
            props.loader(false);
            setIsLoading(false);
            props.toaster({
                type: "error",
                message: err?.data?.message || err?.message || "An error occurred",
            });
        }
    };

    const handleSearch = () => {
        if (!selectedDate && !searchParams.phone && !searchParams.name) {
            props.toaster({
                type: "error",
                message: "Please provide at least one search detail.",
            });
            return;
        }

        fetchQueries(selectedDate, 1);
    };

    const handleReset = () => {
        setSelectedDate("");
        setSearchParams({ name: "", phone: "" });
        fetchQueries(null, 1);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        const cleanValue =
            name === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value;

        setSearchParams((prev) => ({
            ...prev,
            [name]: cleanValue,
        }));
    };

    // Table cell renderers
    const renderName = ({ value }) => (
        <div className=" flex items-center justify-center">
            <User size={16} className="mr-2 text-gray-500" />
            <p className="text-gray-800 text-[16px] font-medium">{value}</p>
        </div>
    );
    const renderStatus = ({ value }) => {
        let colorClass = '';

        switch (value) {
            case 'pending':
                colorClass = 'text-yellow-500';
                break;
            case 'resolved':
                colorClass = 'text-green-600';
                break;
            case 'closed':
                colorClass = 'text-red-600';
                break;
            default:
                colorClass = 'text-gray-600';
        }

        return (
            <div className="flex items-center justify-center">
                <p className={`text-[16px] font-semibold capitalize ${colorClass}`}>
                    {value}
                </p>
            </div>
        );
    };
    const renderEmail = ({ value }) => (
        <div className=" flex items-center  justify-center">
            <Mail size={16} className="mr-2 text-gray-500" />
            <p className="text-gray-800 text-[16px] ">{value}</p>
        </div>
    );

    const renderDate = ({ value }) => (
        <div className="flex items-center justify-center">
            <p className="text-gray-800 bg-gray-100 px-3 py-1 rounded-full text-[15px] ">
                {moment(value).format("DD MMM YYYY")}
            </p>
        </div>
    );

    const renderPhone = ({ value }) => (
        <div className="flex items-center justify-center">
            <Phone size={16} className="mr-2 text-gray-500" />
            <p className="text-gray-800 text-[16px] ">{value}</p>
        </div>
    );

    const renderActions = ({ row }) => (
        <div className="flex items-center justify-center">
            <button
                className="flex items-center px-4 py-2 bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-all"
                style={{ backgroundColor: `${primaryColor}20` }}
                onClick={() => {
                    setViewPopup(true);
                    setPopupData(row.original);
                }}
            >
                <Eye size={18} style={{ color: primaryColor }} className="mr-2" />
                <span
                    style={{ color: primaryColor }}
                    className="font-medium cursor-pointer"
                >
                    View
                </span>
            </button>
        </div>
    );

    const columns = useMemo(
        () => [
            {
                Header: "ID",
                Cell: indexID,
                width: 60,
            },
            {
                Header: "NAME",
                accessor: "fullName",
                Cell: renderName,
            },
            {
                Header: "EMAIL",
                accessor: "email",
                Cell: renderEmail,
            },
            {
                Header: "DATE",
                accessor: "createdAt",
                Cell: renderDate,
            },
            {
                Header: "PHONE",
                accessor: "phoneNumber",
                Cell: renderPhone,
            },
            {
                Header: "Status",
                accessor: 'status',
                Cell: renderStatus
            },

            {
                Header: "ACTIONS",
                Cell: renderActions,
                width: 120,
            },
        ],
        [pagination]
    );

    const updateStatusAPI = (id, status) => {
        props.loader(true);
        const data = {
            id,
            status
        };
        Api("post", "contact/updateContactStatus", data, router)
            .then((res) => {
                props.loader(false);
                if (res?.status === true) {
                    props.toaster({ type: "success", message: "Status updated successfully" });
                    fetchQueries(null, currentPage);
                } else {
                    props.toaster({ type: "error", message: res?.message || "Failed to update status" });
                }
            })
            .catch((err) => {
                props.loader(false);
                console.error("API Error:", err);
                props.toaster({ type: "error", message: err?.message || "Something went wrong" });
            });
    };

    return (
        <section className="w-full h-full bg-[#0D0D0D] p-6 overflow-y-scroll scrollbar-hide pb-28">

            {/* Page Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-white font-bold text-3xl text-center">
                    <span className="inline-block w-2 h-8 bg-orange-500 mr-3 rounded"></span>
                    Customer Queries
                </h1>
            </div>

            {/* Filter Card */}
            <div className="bg-[#1A1A1A] rounded-xl shadow-sm border border-gray-700 mb-6 overflow-hidden">
                <div className="p-6">
                    <div className="flex items-center mb-4">
                        <Filter size={20} className="mr-2 text-gray-400" />
                        <h2 className="text-lg font-semibold text-white">Search & Filter</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                        {/* Name Search */}
                        <div>
                            <label className="block text-[16px] text-gray-300 mb-1">Name</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="name"
                                    value={searchParams.name}
                                    onChange={handleFilterChange}
                                    placeholder="Search by name"
                                    className="w-full pl-10 pr-4 py-2 bg-[#111] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                />
                                <User
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                                />
                            </div>
                        </div>

                        {/* Phone Search */}
                        <div>
                            <label className="block text-[16px] text-gray-300 mb-1">Phone Number</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="phone"
                                    value={searchParams.phone}
                                    onChange={handleFilterChange}
                                    placeholder="Search by phone"
                                    className="w-full pl-10 pr-4 py-2 bg-[#111] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                />
                                <Phone
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                                />
                            </div>
                        </div>

                        {/* Date */}
                        <div>
                            <label className="block text-[16px] text-gray-300 mb-1">Date</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-[#111] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                />
                                <Calendar
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                                />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex items-end space-x-3">

                            {/* Search */}
                            <button
                                onClick={handleSearch}
                                className="flex items-center justify-center px-5 py-2 rounded-lg bg-orange-500 text-white text-[16px] font-medium hover:bg-orange-600 transition-all"
                            >
                                <Search size={18} className="mr-2" />
                                Search
                            </button>

                            {/* Reset */}
                            <button
                                onClick={handleReset}
                                className="flex items-center justify-center px-5 py-2 bg-gray-800 text-gray-300 rounded-lg font-medium hover:bg-gray-700 transition-all"
                            >
                                <X size={18} className="mr-2" />
                                Reset
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-[#1A1A1A] rounded-xl shadow-sm border border-gray-700 overflow-hidden">

                {isLoading ? (
                    <div className="flex justify-center items-center p-20">
                        <div
                            className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"
                        ></div>
                    </div>
                ) : queries.length === 0 ? (
                    <div className="flex flex-col justify-center items-center p-24 text-center">
                        <img src="/empty-box.png" alt="No data" className="w-32 h-32 mb-4 opacity-50" />
                        <h3 className="text-xl font-medium text-white mb-1">No queries found</h3>
                        <p className="text-gray-400">Try adjusting your filters or search terms</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto ">
                        <Table
                            columns={columns}
                            data={queries}
                            pagination={pagination}
                            onPageChange={(page) => setCurrentPage(page)}
                            currentPage={currentPage}
                            itemsPerPage={pagination.itemsPerPage}
                        />
                    </div>
                )}

            </div>

            {/* Modal */}
            {viewPopup && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
                    <div className="bg-[#1A1A1A] rounded-xl shadow-xl w-full max-w-md overflow-y-scroll max-h-[90vh] scrollbar-hide p-6 relative">

                        {/* Close Button */}
                        <div className="absolute right-4 top-4">
                            <button
                                onClick={() => setViewPopup(false)}
                                className="p-1 rounded-full bg-gray-800 hover:bg-gray-700 transition"
                            >
                                <XCircle size={24} className="text-gray-300" />
                            </button>
                        </div>

                        {/* Header */}
                        <div className="text-center mb-6 mt-4">
                            <h3 className="text-xl font-bold text-white mb-1">Query Details</h3>
                            <p className="text-gray-400 text-sm">
                                From {popupData.fullName} • {moment(popupData.createdAt).format("DD MMM YYYY")}
                            </p>
                        </div>

                        {/* Info Box */}
                        <div className="bg-[#111] p-4 rounded-lg mb-6 border border-gray-700">
                            <div className="flex flex-col space-y-3 text-gray-300">

                                <div className="flex items-center">
                                    <User size={18} className="text-orange-500 mr-3" />
                                    <div>
                                        <p className="text-sm text-gray-400">Full Name</p>
                                        <p className="font-medium">{popupData.fullName}</p>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <Mail size={18} className="text-orange-500 mr-3" />
                                    <div>
                                        <p className="text-sm text-gray-400">Email</p>
                                        <p>{popupData.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <Phone size={18} className="text-orange-500 mr-3" />
                                    <div>
                                        <p className="text-sm text-gray-400">Phone</p>
                                        <p>{popupData.phoneNumber}</p>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Query message */}
                        <div>
                            <h4 className="font-medium text-white mb-2">Query Message:</h4>
                            <div className="p-4 border border-gray-700 rounded-lg bg-[#111] min-h-[120px]">
                                <p className="text-gray-300 whitespace-pre-wrap">{popupData.query}</p>
                            </div>
                        </div>

                        {/* Status */}
                        <div>
                            <h4 className="font-medium text-white mb-2 mt-4">Status:</h4>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="p-2.5 border border-gray-700 bg-[#111] text-white rounded-lg w-full"
                            >
                                {["pending", "resolved", "closed"].map((status) => (
                                    <option key={status} value={status} className="text-black">
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Buttons */}
                        <div className="mt-6 flex gap-4">
                            <button
                                onClick={() => {
                                    updateStatusAPI(popupData._id, selectedStatus);
                                    setViewPopup(false);
                                }}
                                className="w-full py-3 rounded-lg font-medium bg-orange-500 text-white hover:bg-orange-600 transition"
                            >
                                Submit
                            </button>

                            <button
                                onClick={() => setViewPopup(false)}
                                className="w-full py-3 rounded-lg font-medium bg-gray-800 text-white hover:bg-gray-700 transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </section>

    );
}

export default isAuth(Queries);
