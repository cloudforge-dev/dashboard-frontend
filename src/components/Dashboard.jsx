import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import PriceCard from './PriceCard';

/**
 * Dashboard 主組件
 * 功能：
 * 1. 連接到後端 WebSocket
 * 2. 接收實時加密貨幣數據
 * 3. 顯示連接狀態
 * 4. 展示實時價格卡片
 */
export default function Dashboard() {
  // ========== 狀態管理 ==========
  
  // 加密貨幣價格數據
  const [prices, setPrices] = useState({});
  
  // 當前連接的客戶端數量
  const [clientCount, setClientCount] = useState(0);
  
  // 連接狀態：connecting, connected, disconnected, error
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  
  // 是否正在加載
  const [loading, setLoading] = useState(true);
  
  // 最後更新時間
  const [lastUpdate, setLastUpdate] = useState(null);
  
  // 錯誤信息
  const [error, setError] = useState(null);

  // ========== 副作用：建立 WebSocket 連接 ==========
  
  useEffect(() => {
    // 從環境變數獲取 API URL，默認為本地開發地址
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    
    console.log(`🔗 連接到: ${apiUrl}`);
    
    // 建立 Socket.IO 連接
    const socket = io(apiUrl, {
      // 自動重新連接設置
      reconnection: true,
      reconnectionDelay: 1000,        // 首次重連延遲
      reconnectionDelayMax: 5000,     // 最大重連延遲
      reconnectionAttempts: 5         // 重試次數
    });

    // ========== Socket 事件監聽 ==========

    // 當成功連接到伺服器時
    socket.on('connect', () => {
      console.log('✅ 已連接到伺服器');
      setConnectionStatus('connected');
      setError(null);
      
      // 向伺服器請求數據
      socket.emit('requestData', 'crypto');
    });

    // 當接收到數據時
    socket.on('data', (data) => {
      console.log('📊 收到數據:', data);
      
      if (data.type === 'crypto') {
        // 更新價格數據
        setPrices(data.prices);
        
        // 設置加載完成
        setLoading(false);
        
        // 記錄更新時間
        setLastUpdate(new Date());
      }
    });

    // 當客戶端數量變化時
    socket.on('clientCount', (count) => {
      console.log(`👥 連接客戶端數: ${count}`);
      setClientCount(count);
    });

    // 當發生錯誤時
    socket.on('error', (err) => {
      console.error('❌ Socket 錯誤:', err);
      setError('連接失敗，請檢查伺服器是否運行');
      setConnectionStatus('error');
    });

    // 當斷開連接時
    socket.on('disconnect', () => {
      console.log('❌ 已斷開連接');
      setConnectionStatus('disconnected');
    });

    // ========== 清理函數 ==========
    
    // 當組件卸載時，斷開連接
    return () => {
      console.log('清理 WebSocket 連接');
      socket.disconnect();
    };
  }, []); // 空依賴數組，表示只在組件掛載時運行一次

  // ========== 渲染 ==========

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* ===== 頁面標題 ===== */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Real-Time Crypto Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Live cryptocurrency prices powered by CoinGecko API
          </p>
        </div>

        {/* ===== 狀態欄 ===== */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* 連接狀態 */}
          <div className="flex items-center gap-4">
            <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
              connectionStatus === 'connected' 
                ? 'bg-green-100 text-green-800' 
                : connectionStatus === 'connecting'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {connectionStatus.toUpperCase()}
            </span>
            
            {/* 客戶端計數 */}
            <span className="text-sm text-gray-600">
              Clients: <span className="font-semibold text-blue-500">{clientCount}</span>
            </span>
          </div>
          
          {/* 最後更新時間 */}
          <span className="text-xs text-gray-400">
            {lastUpdate 
              ? `Updated: ${lastUpdate.toLocaleTimeString()}` 
              : 'Waiting for data...'}
          </span>
        </div>

        {/* ===== 錯誤提示 ===== */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
            ⚠️ {error}
          </div>
        )}

        {/* ===== 主內容區 ===== */}
        {loading ? (
          /* 加載狀態 */
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 text-lg mb-4">Loading data...</p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          </div>
        ) : (
          /* 價格卡片網格 */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(prices).map(([key, data]) => (
              <PriceCard 
                key={key} 
                name={key} 
                data={data} 
              />
            ))}
          </div>
        )}

        {/* ===== 空狀態 ===== */}
        {!loading && Object.keys(prices).length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 text-lg">
              {connectionStatus === 'connecting' 
                ? 'Connecting...' 
                : 'No data available'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}