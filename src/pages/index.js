import React, { useState } from 'react';
import { Home, Users, BedDouble, IndianRupee, TrendingUp, Calendar, MapPin, Star, Clock, CheckCircle } from 'lucide-react';

function FindMyStayDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const statsData = [
    {
      title: "Total Properties",
      value: "24",
      change: "+3 this month",
      icon: <Home size={28} />,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Active Tenants",
      value: "156",
      change: "+12 this week",
      icon: <Users size={28} />,
      color: "from-green-500 to-green-600"
    },
    {
      title: "Available Rooms",
      value: "18",
      change: "Out of 180 total",
      icon: <BedDouble size={28} />,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Monthly Revenue",
      value: "₹8.2L",
      change: "+18% from last month",
      icon: <IndianRupee size={28} />,
      color: "from-yellow-500 to-orange-500"
    }
  ];

  const recentBookings = [
    { name: "Rahul Sharma", room: "PG Deluxe - Room 301", date: "2 hours ago", status: "confirmed", amount: "₹8,500" },
    { name: "Priya Patel", room: "Single Room - 205", date: "5 hours ago", status: "confirmed", amount: "₹6,500" },
    { name: "Amit Kumar", room: "Shared Room - 104", date: "1 day ago", status: "pending", amount: "₹4,200" },
    { name: "Sneha Verma", room: "PG Premium - 402", date: "1 day ago", status: "confirmed", amount: "₹12,000" },
    { name: "Vikram Singh", room: "Double Sharing - 208", date: "2 days ago", status: "confirmed", amount: "₹5,500" }
  ];

  const topProperties = [
    { name: "Green Valley PG", location: "Sector 62, Noida", occupancy: 95, rating: 4.8, rooms: 24 },
    { name: "Sunshine Residency", location: "Dwarka, Delhi", occupancy: 88, rating: 4.6, rooms: 18 },
    { name: "Urban Nest PG", location: "Gurgaon", occupancy: 92, rating: 4.7, rooms: 20 },
    { name: "Student Hub", location: "Laxmi Nagar", occupancy: 85, rating: 4.5, rooms: 15 }
  ];

  const pendingTasks = [
    { task: "Room 305 - Maintenance Request", priority: "High", time: "2 hours ago" },
    { task: "Verify new tenant documents", priority: "Medium", time: "5 hours ago" },
    { task: "Electricity bill payment - Green Valley", priority: "High", time: "1 day ago" },
    { task: "Schedule property inspection", priority: "Low", time: "2 days ago" }
  ];

  const recentActivity = [
    { activity: "New booking confirmed for Room 301", type: "booking", time: "10 minutes ago" },
    { activity: "Payment received from Rahul Sharma", type: "payment", time: "2 hours ago" },
    { activity: "Room 205 maintenance completed", type: "maintenance", time: "4 hours ago" },
    { activity: "New tenant moved in - Room 104", type: "checkin", time: "1 day ago" },
    { activity: "Property inspection completed", type: "inspection", time: "2 days ago" }
  ];

  return (
    <div className="min-h-screen bg-black p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Find My Stay Dashboard
            </h1>
            <p className="text-gray-400">Welcome back! Here's your property overview</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              Add Property
            </button>
            <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
              View Reports
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className="bg-custom-black rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all hover:scale-105 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
              <p className="text-3xl font-bold text-white mb-2">{stat.value}</p>
              <p className="text-xs text-green-400">{stat.change}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Bookings */}
          <div className="lg:col-span-2 bg-custom-black rounded-xl p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Recent Bookings</h3>
              <button className="text-blue-400 text-sm hover:text-blue-300">View All</button>
            </div>
            <div className="space-y-3">
              {recentBookings.map((booking, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-750 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                      {booking.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{booking.name}</p>
                      <p className="text-gray-400 text-xs">{booking.room}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold text-sm">{booking.amount}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${booking.status === 'confirmed'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                          }`}
                      >
                        {booking.status}
                      </span>
                      <span className="text-xs text-gray-500">{booking.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Tasks */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Pending Tasks</h3>
              <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">
                {pendingTasks.length} tasks
              </span>
            </div>
            <div className="space-y-3">
              {pendingTasks.map((item, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-750 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-white text-sm flex-1">{item.task}</p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ml-2 ${item.priority === 'High'
                          ? 'bg-red-500/20 text-red-400'
                          : item.priority === 'Medium'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-blue-500/20 text-blue-400'
                        }`}
                    >
                      {item.priority}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock size={12} />
                    {item.time}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div className="bg-custom-black rounded-xl p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Top Performing Properties</h3>
              <button className="text-blue-400 text-sm hover:text-blue-300">View All</button>
            </div>
            <div className="space-y-4">
              {topProperties.map((property, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-750 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-white font-semibold">{property.name}</p>
                      <p className="text-gray-400 text-xs flex items-center gap-1 mt-1">
                        <MapPin size={12} />
                        {property.location}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-1 rounded">
                      <Star size={12} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-yellow-400 text-xs font-semibold">{property.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-gray-400">Occupancy</span>
                        <span className="text-xs text-green-400 font-semibold">{property.occupancy}%</span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all"
                          style={{ width: `${property.occupancy}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="ml-4 text-xs text-gray-400">{property.rooms} rooms</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-custom-black rounded-xl p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
              <button className="text-blue-400 text-sm hover:text-blue-300">View All</button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg ${item.type === 'booking'
                        ? 'bg-blue-500/20'
                        : item.type === 'payment'
                          ? 'bg-green-500/20'
                          : item.type === 'maintenance'
                            ? 'bg-yellow-500/20'
                            : 'bg-purple-500/20'
                      }`}
                  >
                    {item.type === 'booking' ? (
                      <Calendar size={16} className="text-blue-400" />
                    ) : item.type === 'payment' ? (
                      <IndianRupee size={16} className="text-green-400" />
                    ) : item.type === 'maintenance' ? (
                      <CheckCircle size={16} className="text-yellow-400" />
                    ) : (
                      <Home size={16} className="text-purple-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm">{item.activity}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default FindMyStayDashboard;