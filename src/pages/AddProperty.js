import React, { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { Api } from "@/services/service";

export default function AddRoom() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    propertyName: "",
    roomType: "",
    pricePerMonth: "",
    totalBeds: "",
    availableBeds: "",
    genderAllowed: "Any",
    city: "",
    state: "",
    pincode: "",
    images: [],
    description: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    setForm({ ...form, images: [...e.target.files] });
  };

  const submit = async () => {
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
      const data = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (key === "images") {
          for (let img of value) data.append("images", img);
        } else {
          data.append(key, value);
        }
      });

      const res = await Api("post", "rooms/add", data, router);

      if (res?.status) {
        toast.success("Room Added Successfully!");
        router.push("/admin/rooms");
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
    <div className="w-full md:p-8 p-4 bg-black overflow-y-auto ">
      <h2 className="text-3xl font-bold text-orange-600 mb-6 text-center">
        Add New Property / Room
      </h2>

      <div className="grid grid-cols-1 gap-5">
        <input
          name="propertyName"
          placeholder="Property Name"
          onChange={handleChange}
          className="border border-orange-200 p-3 rounded-lg focus:ring-2 focus:ring-orange-300 outline-none transition"
        />

        <select
          name="roomType"
          onChange={handleChange}
          className="border border-orange-200 p-3 rounded-lg focus:ring-2 focus:ring-orange-300 outline-none transition"
        >
          <option value="">Select Room Type</option>
          <option value="Single">Single</option>
          <option value="Double">Double</option>
          <option value="Triple">Triple</option>
          <option value="Dormitory">Dormitory</option>
        </select>

        <input
          name="pricePerMonth"
          type="number"
          placeholder="Price Per Month"
          onChange={handleChange}
          className="border border-orange-200 p-3 rounded-lg focus:ring-2 focus:ring-orange-300 outline-none transition"
        />

        <input
          name="totalBeds"
          type="number"
          placeholder="Total Beds"
          onChange={handleChange}
          className="border border-orange-200 p-3 rounded-lg focus:ring-2 focus:ring-orange-300 outline-none transition"
        />

        <input
          name="availableBeds"
          type="number"
          placeholder="Available Beds"
          onChange={handleChange}
          className="border border-orange-200 p-3 rounded-lg focus:ring-2 focus:ring-orange-300 outline-none transition"
        />

        <select
          name="genderAllowed"
          onChange={handleChange}
          className="border border-orange-200 p-3 rounded-lg focus:ring-2 focus:ring-orange-300 outline-none transition"
        >
          <option value="Any">Any</option>
          <option value="Boys">Boys</option>
          <option value="Girls">Girls</option>
        </select>

        <input
          name="city"
          placeholder="City"
          onChange={handleChange}
          className="border border-orange-200 p-3 rounded-lg focus:ring-2 focus:ring-orange-300 outline-none transition"
        />

        <input
          name="state"
          placeholder="State"
          onChange={handleChange}
          className="border border-orange-200 p-3 rounded-lg focus:ring-2 focus:ring-orange-300 outline-none transition"
        />

        <input
          name="pincode"
          placeholder="Pincode"
          onChange={handleChange}
          className="border border-orange-200 p-3 rounded-lg focus:ring-2 focus:ring-orange-300 outline-none transition"
        />

        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
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
          {loading ? "Adding..." : "Add Property"}
        </button>
      </div>
    </div>
  );
}
