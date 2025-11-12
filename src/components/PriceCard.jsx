import React from "react";

export default function PriceCard({ name, data }) {
  if (!data) return null;

  const price = data.usd || 0;
  const marketCap = data.usd_market_cap || 0;
  const change24h = data.usd_24h_change || 0;
  const volume24h = data.usd_24h_vol || 0;
  const isPositive = change24h >= 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">
            {name.toUpperCase()}
          </h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            ${price.toLocaleString("en-US", { maximumFractionDigits: 2 })}
          </p>
        </div>

        <div
          className={`text-2xl font-bold flex items-center ${
            isPositive ? "text-green-500" : "text-red-500"
          }`}
        >
          <span className="text-3xl mr-1">{isPositive ? "↑" : "↓"}</span>
          {Math.abs(change24h).toFixed(2)}%
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
        <div>
          <p className="text-sm text-gray-500 mb-1">Market Cap</p>
          <p className="text-lg font-semibold text-gray-800">
            ${(marketCap / 1e9).toFixed(2)}B
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1">24h Volume</p>
          <p className="text-lg font-semibold text-gray-800">
            ${(volume24h / 1e9).toFixed(2)}B
          </p>
        </div>
      </div>
    </div>
  );
}
