import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { Api } from "@/services/service";

export default function AddRoom(props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    propertyName: "",
    roomType: "",
    pricePerMonth: "",
    totalBeds: "",
    availableBeds: "",
    genderAllowed: "Any",
    city: "Indore",
    state: "Madhya Pradesh",
    address: "",
    pincode: "",
    images: [],
    description: "",
  });

  useEffect(() => {
    if (router.isReady) {
      setEditId(router.query.editID);
      getRoomsbyId(router.query.editID);
    }
  }, [router.isReady]);

  const getRoomsbyId = async (roomId) => {
    const data = {};
    props.loader(true);

    try {
      const res = await Api("get", `rooms/getRoom/${roomId}`, data, router);

      props.loader(false);
      if (res?.status) {
        const data = res?.data;
        console.log("API KE ANDER", data);

        setForm({
          propertyName: data?.propertyName || "",
          roomType: data?.roomType || "",
          pricePerMonth: data?.pricePerMonth || "",
          totalBeds: data?.totalBeds || "",
          availableBeds: data.availableBeds || "",
          genderAllowed: data?.genderAllowed || "Any",
          city: "Indore",
          state: "Madhya Pradesh",
          address: data?.address || "",
          pincode: data?.pincode || "",
          images: data?.images || [],
          description: data?.description || "",
        });
      } else {
        props.toaster({
          type: "error",
          message: res?.data?.message || "Failed to fetch queries",
        });
      }
    } catch (err) {
      props.loader(false);
      props.toaster({
        type: "error",
        message: err?.data?.message || err?.message || "An error occurred",
      });
    }
  };
  console.log("bahar", form);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    setForm({ ...form, images: [...e.target.files] });
  };

  const submit = async () => {
    console.log(form);

    if (
      !form.propertyName ||
      !form.roomType ||
      !form.pricePerMonth ||
      !form.totalBeds ||
      !form.availableBeds ||
      !form.city ||
      !form.state ||
      !form.pincode
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const data = form;
      let url = editId ? `rooms/update/${editId}` : `rooms/add`;
      const res = await Api("post", url, data, router);

      if (res?.status) {
        toast.success("Room Added Successfully!");
        router.push("/rooms");
      } else {
        toast.error(res?.message || "Something went wrong");
      }
    } catch (err) {
      console.log(err);
      toast.error(err?.message || "Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full md:p-8 p-4 bg-black ">
      <div className="h-[90vh] pb-20 overflow-y-auto overflow-x-auto scrollbar-hide overflow-scroll  ">
        <h2 className="text-3xl font-bold text-orange-600 mb-6 text-center">
          {editId ? "update" : "Add"} New PG Room (Indore)
        </h2>

        <div className="grid grid-cols-1 gap-5">
          <input
            name="propertyName"
            placeholder="PG / Hostel Name (Indore)"
            onChange={handleChange}
            className="border border-orange-200 p-3 rounded-lg focus:ring-2 focus:ring-orange-300 outline-none transition"
            value={form?.propertyName}
          />

          <select
            name="roomType"
            onChange={handleChange}
            className="border border-orange-200 p-3 rounded-lg focus:ring-2 focus:ring-orange-300 outline-none transition"
            value={form?.roomType}
          >
            <option value="" className="text-black">
              Select Room Sharing Type
            </option>
            <option value="Single" className="text-black">
              Single Sharing
            </option>
            <option value="Double" className="text-black">
              Double Sharing
            </option>
            <option value="Triple" className="text-black">
              Triple Sharing
            </option>
            <option value="Dormitory" className="text-black">
              Dormitory
            </option>
          </select>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input
              name="pricePerMonth"
              type="number"
              placeholder="Rent Per Month (₹)"
              onChange={handleChange}
              value={form?.pricePerMonth}
              className="border border-orange-200 p-3 rounded-lg focus:ring-2 focus:ring-orange-300 outline-none transition"
            />

            <input
              name="totalBeds"
              type="number"
              placeholder="Total Beds in Room"
              onChange={handleChange}
              value={form?.totalBeds}
              className="border border-orange-200 p-3 rounded-lg focus:ring-2 focus:ring-orange-300 outline-none transition"
            />

            <input
              name="availableBeds"
              type="number"
              placeholder="Available Beds Right Now"
              onChange={handleChange}
              value={form?.availableBeds}
              className="border border-orange-200 p-3 rounded-lg focus:ring-2 focus:ring-orange-300 outline-none transition"
            />

            <select
              name="genderAllowed"
              onChange={handleChange}
              value={form?.genderAllowed}
              className="border border-orange-200 p-3 rounded-lg focus:ring-2 focus:ring-orange-300 outline-none transition"
            >
              <option value="Any" className="text-black">
                Suitable for: Boys / Girls
              </option>
              <option value="Boys" className="text-black">
                Boys Only
              </option>
              <option value="Girls" className="text-black">
                Girls Only
              </option>
            </select>
          </div>
          <input
            name="city"
            placeholder="City (Indore)"
            onChange={handleChange}
            value="Indore"
            readOnly
            className="border border-orange-200 p-3 rounded-lg  cursor-not-allowed"
          />

          <input
            name="state"
            placeholder="State (Madhya Pradesh)"
            onChange={handleChange}
            value="Madhya Pradesh"
            readOnly
            className="border border-orange-200 p-3 rounded-lg cursor-not-allowed"
          />
          <input
            name="address"
            placeholder="vijay Nagar  "
            onChange={handleChange}
            value={form?.address}
            className="border border-orange-200 p-3 rounded-lg focus:ring-2 focus:ring-orange-300 outline-none transition"
          />

          <input
            name="pincode"
            placeholder="Pincode (e.g. 452001)"
            onChange={handleChange}
            value={form?.pincode}
            className="border border-orange-200 p-3 rounded-lg focus:ring-2 focus:ring-orange-300 outline-none transition"
          />

          <textarea
            name="description"
            placeholder="Room Details (Amenities, Food, WiFi, Location, etc.)"
            onChange={handleChange}
            value={form?.description}
            className="border border-orange-200 p-3 rounded-lg focus:ring-2 focus:ring-orange-300 outline-none transition resize-none"
            rows={4}
          />

          <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="border border-orange-200 p-3 rounded-lg focus:ring-2 focus:ring-orange-300 outline-none transition"
          />

          <button
            onClick={submit}
            className="bg-orange-600 hover:bg-orange-700 text-white py-3 px-6 rounded-lg font-semibold transition"
          >
            {editId ? "Update" : "Add"} PG Room
          </button>
        </div>
      </div>
    </div>
  );
}
