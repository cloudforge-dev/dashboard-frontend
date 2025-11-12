import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import PriceCard from "./PriceCard";

/**
 * Dashboard Component
 * Function:
 * 1. Connect to Backend WebSocket
 * 2. Receive realtime Crypto Info
 * 3. Display connection status
 * 4. Display realtime price cards
 */
export default function Dashboard() {
  // ========== Status Management ==========

  const [prices, setPrices] = useState({});
  const [clientCount, setClientCount] = useState(0);
  // Statuses: connecting, connected, disconnected, error
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError] = useState(null);

  // ========== Establish WebSocket Connection ==========

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

    console.log(`🔗 Connected to: ${apiUrl}`);

    // Socket.IO
    const socket = io(apiUrl, {
      reconnection: true, // Auto Re-connect
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    // ========== Socket Event Listener ==========

    socket.on("connect", () => {
      console.log("✅ Connected to Server");
      setConnectionStatus("connected");
      setError(null);

      socket.emit("requestData", "crypto");
    });

    socket.on("data", (data) => {
      console.log("📊 Received Data:", data);

      if (data.type === "crypto") {
        setPrices(data.prices);
        setLoading(false);
        setLastUpdate(new Date());
      }
    });

    socket.on("clientCount", (count) => {
      console.log(`👥 Number of client currently connecting: ${count}`);
      setClientCount(count);
    });

    socket.on("error", (err) => {
      console.error("❌ Socket Error:", err);
      setError("Connection Failure, please check is server running");
      setConnectionStatus("error");
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected");
      setConnectionStatus("disconnected");
    });

    // ========== Clear Variables ==========

    return () => {
      console.log("Clear WebSocket connection");
      socket.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* ===== Title ===== */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Real-Time Crypto Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Live cryptocurrency prices powered by CoinGecko API
          </p>
        </div>

        {/* ===== Status Bar ===== */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Connectivity */}
          <div className="flex items-center gap-4">
            <span
              className={`text-sm font-semibold px-3 py-1 rounded-full ${
                connectionStatus === "connected"
                  ? "bg-green-100 text-green-800"
                  : connectionStatus === "connecting"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {connectionStatus.toUpperCase()}
            </span>

            {/* Number of Clients */}
            <span className="text-sm text-gray-600">
              Clients:{" "}
              <span className="font-semibold text-blue-500">{clientCount}</span>
            </span>
          </div>

          {/* Last Update Time */}
          <span className="text-xs text-gray-400">
            {lastUpdate
              ? `Updated: ${lastUpdate.toLocaleTimeString()}`
              : "Waiting for data..."}
          </span>
        </div>

        {/* ===== Error Messages ===== */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
            ⚠️ {error}
          </div>
        )}

        {/* ===== Main Content ===== */}
        {loading ? (
          /* Loading div */
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 text-lg mb-4">Loading data...</p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          </div>
        ) : (
          /* Price Card Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(prices).map(([key, data]) => (
              <PriceCard key={key} name={key} data={data} />
            ))}
          </div>
        )}

        {/* ===== Show if Empty ===== */}
        {!loading && Object.keys(prices).length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 text-lg">
              {connectionStatus === "connecting"
                ? "Connecting..."
                : "No data available"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
