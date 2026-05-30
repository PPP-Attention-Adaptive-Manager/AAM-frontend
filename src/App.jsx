import React from 'react';

const LayoutSkeleton = () => {
  return (
    /* Main Window Wrapper */
    <div className="flex h-screen w-full bg-[#f6f6f6] text-gray-800 font-sans overflow-hidden">
      
      {/* ============================== */}
      {/* LEFT SIDEBAR                     */}
      {/* ============================== */}
      <div className="w-[240px] flex flex-col border-r border-gray-200 bg-[#fefefe]">
        
        {/* 1. Window Controls (Mac style) */}
        <div className="flex gap-2 p-4 pb-2">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>

        {/* 2. Search Bar Area */}
        <div className="px-3 py-2">
          <div className="w-full h-8 bg-white border border-gray-200 rounded-md flex items-center px-2 text-sm text-gray-400">
            🔍 Search
          </div>
        </div>

        {/* 3. Primary Navigation (Flexible height, scrolls if needed) */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
          {/* Active Item Example */}
          <div className="w-full h-9 bg-blue-600 rounded-md flex items-center px-2 text-white text-sm font-medium">
            ⚡ Strictness
          </div>
          {/* Inactive Item Example */}
          <div className="w-full h-9 bg-transparent rounded-md flex items-center px-2 text-gray-700 text-sm">
            🖥️ UI
          </div>
          <div className="w-full h-9 bg-transparent rounded-md flex items-center px-2 text-gray-700 text-sm">
            ♿ Accessibility
          </div>
          {/* ... other nav items would go here ... */}
        </div>

        {/* 4. Footer Actions */}
        <div className="p-4 flex flex-col gap-3">
          <div className="w-full h-8 bg-orange-50 border border-orange-200 rounded text-orange-600 flex items-center justify-center text-sm">
            ↑ Export Data
          </div>
          <div className="w-full h-8 bg-orange-50 border border-orange-200 rounded text-orange-600 flex items-center justify-center text-sm">
            ↻ Check for updates
          </div>
          <div className="text-center text-xs text-gray-500 mt-1">
            Version: 1.4.260
          </div>
        </div>
      </div>

      {/* ============================== */}
      {/* RIGHT MAIN CONTENT AREA          */}
      {/* ============================== */}
      <div className="flex-1 flex flex-col bg-[#fefefe]">
        
        {/* 1. Top Bar / App Header */}
        <div className="h-20 flex flex-col justify-end border-b border-gray-200 relative bg-[#fefefe] pb-2">
          {/* Absolute positioned title */}
          <div className="absolute top-2 left-0 right-0 text-center text-sm font-bold text-gray-700">
            Preferences
          </div>
          
          {/* Center Navigation Icons */}
          <div className="flex justify-center gap-8 text-xs text-gray-500">
            <div className="flex flex-col items-center gap-1">👤 <span>Stats</span></div>
            <div className="flex flex-col items-center gap-1">👁️ <span>Focus</span></div>
            <div className="flex flex-col items-center gap-1">☑️ <span>Edit Habits</span></div>
            <div className="flex flex-col items-center gap-1 text-blue-600">⚙️ <span>Settings</span></div>
            <div className="flex flex-col items-center gap-1">ℹ️ <span>Help</span></div>
          </div>
        </div>

        {/* 2. Page Sub-header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-[#fefefe]">
          <h2 className="text-base font-medium text-gray-800">Strictness</h2>
        </div>

        {/* 3. Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto bg-[#f8f8f8] p-6">
          <div className="max-w-4xl mx-auto">
            
            {/* Slider Layout Block */}
            <div className="mb-10">
              <div className="text-sm mb-6 text-gray-700">Strictness level:</div>
              <div className="w-full h-2 bg-gray-300 rounded-full mb-2"></div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Super gentle</span>
                <span>Gentle</span>
                <span>Slightly strict</span>
                <span>Strict</span>
                <span>Super strict</span>
              </div>
            </div>

            {/* Settings List Layout Block */}
            <div className="bg-[#fefefe] border border-gray-200 rounded-lg flex flex-col">
              {/* Row Item Example */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <span className="text-gray-400">🖥️</span>
                  <span className="text-sm text-gray-700">Friction</span>
                  <span className="text-blue-500">ℹ️</span>
                </div>
                <span className="text-gray-400">›</span>
              </div>
              
              {/* Row Item Example */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <span className="text-gray-400">🔒</span>
                  <span className="text-sm text-gray-700">Password</span>
                  <span className="text-blue-500">ℹ️</span>
                </div>
                <span className="text-gray-400">›</span>
              </div>

              {/* Row Item Example (No border on last item) */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <span className="text-gray-400">📖</span>
                  <span className="text-sm text-gray-700">Focus Mode</span>
                </div>
                <span className="text-gray-400">›</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default LayoutSkeleton;