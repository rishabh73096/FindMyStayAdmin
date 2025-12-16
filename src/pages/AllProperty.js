import React, { useMemo, useState, useEffect } from "react";
import Table from "../../components/table";
import { indexID } from "../../components/reported/customTableAct";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import moment from "moment";
import isAuth from "../../components/isAuth";

import { Search, X, Eye, Home, Bed, Users, Edit, Trash } from "lucide-react";

function AllProperty(props) {
  const router = useRouter();
  const [queries, setQueries] = useState([]);
  const [viewPopup, setViewPopup] = useState(false);
  const [popupData, setPopupData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [searchParams, setSearchParams] = useState({
    name: "",
    phone: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
    itemsPerPage: 10,
  });

  const primaryColor = "#F38529";

  useEffect(() => {
    fetchrooms(currentPage, 10);
  }, [currentPage]);

  const fetchrooms = async (page = 1, limit = 10) => {
    const data = {};

    setIsLoading(true);
    props.loader(true);

    try {
      const res = await Api(
        "get",
        `rooms/getAll?page=${page}&limit=${limit}`,
        data,
        router
      );

      props.loader(false);
      setIsLoading(false);

      if (res?.status) {
        const data = res?.data;
        setQueries(data?.data || []);
        setPagination({
          totalPages: data?.totalPages,
          currentPage: data?.currentPage,
          itemsPerPage: data?.itemsPerPage,
        });
        setCurrentPage(res?.data?.currentPage || page);
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

    fetchrooms(selectedDate, 1);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const IconText = ({ value, icon: Icon }) => (
    <div className="flex items-center gap-2">
      <Icon size={16} className="text-gray-400" />
      <span className="text-black">{value || "N/A"}</span>
    </div>
  );

  const PropertyName = ({ row }) => (
    <div className="flex items-center gap-3">
      <img
        src={row.original?.images?.[0] || "/no-image.jpg"}
        alt="Property Image"
        className="w-20 h-20 rounded object-cover border border-gray-700"
      />
      <div className="flex items-center gap-2">
        <Home size={16} className="text-gray-400" />
        <span className="text-black">{row.original?.propertyName}</span>
      </div>
    </div>
  );

  const renderStatus = ({ value }) => (
    <div className="text-center text-white font-medium bg-gray-800 px-3 py-1 rounded-lg">
      ₹{value || 0}
    </div>
  );

  const RenderActions = ({ row }) => (
    <div className="flex items-center justify-center space-x-3">
      {/* View */}
      <button
        className="flex items-center px-3 py-1 rounded-lg bg-opacity-10 hover:bg-opacity-20 transition"
        style={{ backgroundColor: `${primaryColor}20` }}
        onClick={() => {
          setViewPopup(true);
          setPopupData(row.original);
        }}
      >
        <Eye size={18} style={{ color: primaryColor }} className="mr-1" />
        <span style={{ color: primaryColor }} className="font-medium">
          View
        </span>
      </button>

      {/* Edit */}
      <button
        className="flex items-center px-3 py-1 rounded-lg bg-opacity-10 hover:bg-opacity-20 transition"
        style={{ backgroundColor: `${primaryColor}20` }}
        onClick={() => router.push(`/AddProperty?editID=${row.original._id}`)}
      >
        <Edit size={18} style={{ color: primaryColor }} className="mr-1" />
        <span style={{ color: primaryColor }} className="font-medium">
          Edit
        </span>
      </button>

      {/* Delete (Dummy API) */}
      <button
        className="flex items-center px-3 py-1 rounded-lg bg-opacity-10 hover:bg-opacity-20 transition"
        style={{ backgroundColor: `${primaryColor}20` }}
        onClick={() => handleDelete(row.original._id)}
      >
        <Trash size={18} style={{ color: primaryColor }} className="mr-1" />
        <span style={{ color: primaryColor }} className="font-medium">
          Delete
        </span>
      </button>
    </div>
  );

  const handleDelete = async (roomId) => {
    try {
      props.loader(true);
      await Api("delete", `rooms/delete/${roomId}`, {}, router);

      props.toaster({
        type: "success",
        message: "Property deleted successfully",
      });

      fetchrooms(currentPage);
    } catch (error) {
      props.toaster({
        type: "error",
        message: "Delete failed",
      });
    } finally {
      props.loader(false);
    }
  };

  const columns = useMemo(
    () => [
      { Header: "ID", Cell: indexID, width: 60 },

      {
        Header: "Property",
        accessor: "propertyName",
        Cell: PropertyName,
      },

      {
        Header: "Room Type",
        accessor: "roomType",
        Cell: (p) => <IconText icon={Bed} {...p} />,
      },

      {
        Header: "Address",
        accessor: "address.city",
        Cell: ({ row }) => (
          <span className="text-black">
            {row.original?.address}, {row.original?.city}, {row.original?.state}
          </span>
        ),
      },

      {
        Header: "Beds",
        accessor: "availableBeds",
        Cell: ({ row }) => (
          <span className="text-black">{row.original.availableBeds}</span>
        ),
      },

      {
        Header: "Price",
        accessor: "pricePerMonth",
        Cell: renderStatus,
      },

      { Header: "ACTIONS", Cell: RenderActions, width: 150 },
    ],
    [pagination]
  );

  // ------------------ UI ------------------
  return (
    <section className="w-full h-full bg-[#0D0D0D] p-6 overflow-y-scroll scrollbar-hide pb-28">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-white font-bold text-3xl text-center">
          <span className="inline-block w-2 h-8 bg-orange-500 mr-3 rounded"></span>
          All Property
        </h1>
        <button className="bg-orange-500 rounded-md cursor-pointer px-4 py-2 text-white" onClick={()=> router.push("/AddProperty")}>
          Add Property
        </button>
      </div>

      <div className="bg-[#1A1A1A] rounded-xl shadow-sm border border-gray-700 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center p-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : queries.length === 0 ? (
          <div className="flex flex-col justify-center items-center min-h-[500px] text-center">
            <img
              src="/empty-box.png"
              alt="No data"
              className="w-32 h-32 mb-4 opacity-50"
            />
            <h3 className="text-xl font-medium text-white mb-1">
              No queries found
            </h3>
            <p className="text-gray-400">
              Try adjusting your filters or search terms
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto ">
            <div className="flex relative w-full  gap-4 mt-4 px-4">
              <div className="flex gap-4 flex-1">
                <Search
                  className="absolute left-6 top-3 text-gray-500"
                  size={18}
                />
                <input
                  type="text"
                  name="name"
                  value={searchParams.name}
                  onChange={handleFilterChange}
                  placeholder="Search by Property Name"
                  className="w-full pl-10 pr-4 py-2 bg-[#111] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <button
                onClick={handleSearch}
                className="px-6 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 transition"
              >
                Search
              </button>
            </div>

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

      {viewPopup && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-[#1A1A1A] p-6 rounded-xl w-[90%] max-w-md border border-gray-700 relative">
            <button
              onClick={() => setViewPopup(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              <X size={22} />
            </button>

            <h2 className="text-xl font-bold text-white mb-4">
              Property Details
            </h2>

            <div className="space-y-3">
              <div>
                <p className="text-gray-400 text-sm">Property Name</p>
                <p className="text-white text-lg font-medium">
                  {popupData?.propertyName || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-sm">Room Type</p>
                <p className="text-white text-lg font-medium">
                  {popupData?.roomType}
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-sm">Price Per Month</p>
                <p className="text-white text-lg font-medium">
                  ₹{popupData?.pricePerMonth}
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-sm">Address</p>
                <p className="text-white text-lg font-medium">
                  {popupData?.address?.city}, {popupData?.address?.state}{" "}
                  {popupData?.address?.pincode}
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-sm">Beds</p>
                <p className="text-white text-lg font-medium">
                  Total: {popupData?.beds?.total} | Available:{" "}
                  {popupData?.beds?.available}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default AllProperty;
