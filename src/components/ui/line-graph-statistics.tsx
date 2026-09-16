'use client';

import React, { useState, useEffect } from 'react';

export default function CleanWireframeAnalytics({ feedbacks = [] }: { feedbacks?: any[] }) {
  const [selectedPeriod, setSelectedPeriod] = useState('Last 7 days');
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [chartVisible, setChartVisible] = useState(false);

  // Helper to get past N days
  const getPastDays = (days: number) => {
    return Array.from({ length: days }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (days - 1 - i));
      return d;
    });
  };

  const getComputedData = (days: number) => {
    const dates = getPastDays(days);
    const dateLabels = dates.map(d => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    
    const complaints = Array(days).fill(0);
    const suggestions = Array(days).fill(0);

    feedbacks.forEach(f => {
      const fDate = new Date(f.created_at || f.timestamp);
      // Find matching date index
      const matchIndex = dates.findIndex(d => 
        d.getFullYear() === fDate.getFullYear() &&
        d.getMonth() === fDate.getMonth() &&
        d.getDate() === fDate.getDate()
      );
      if (matchIndex !== -1) {
        if (f.type === 'complaint') complaints[matchIndex]++;
        if (f.type === 'suggestion' || f.type === 'praise') suggestions[matchIndex]++;
      }
    });

    const totalComplaints = complaints.reduce((a, b) => a + b, 0);
    const totalSuggestions = suggestions.reduce((a, b) => a + b, 0);

    return {
      dates: dateLabels,
      complaints,
      suggestions,
      peak: Math.max(...complaints, ...suggestions, 1), // ensure at least 1 for math
      average: Math.round(((totalComplaints + totalSuggestions) / days) * 10) / 10,
      total: totalComplaints + totalSuggestions,
    };
  };

  const data: Record<string, any> = {
    'Last 7 days': getComputedData(7),
    'Last 30 days': getComputedData(30),
  };

  const currentData = data[selectedPeriod];
  const maxValue = Math.max(...currentData.complaints, ...currentData.suggestions) * 1.2 || 5;


  // Generate path for smooth curves
  const generateSmoothPath = (values: number[], height = 300, isArea = false) => {
    const width = 800;
    const padding = 60;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    const points = values.map((value, index) => ({
      x: padding + (index / (values.length - 1)) * chartWidth,
      y: padding + (1 - value / maxValue) * chartHeight
    }));

    if (points.length < 2) return '';

    let path = `M ${points[0].x},${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const next = points[i + 1];
      
      const cp1x = prev.x + (curr.x - prev.x) * 0.5;
      const cp1y = prev.y;
      const cp2x = curr.x - (next ? (next.x - curr.x) * 0.3 : 0);
      const cp2y = curr.y;
      
      path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${curr.x},${curr.y}`;
    }
    
    if (isArea) {
      path += ` L ${points[points.length - 1].x},${height - padding} L ${padding},${height - padding} Z`;
    }
    
    return path;
  };

  useEffect(() => {
    setChartVisible(false);
    setAnimationPhase(0);
    
    const timers = [
      setTimeout(() => setAnimationPhase(1), 100),
      setTimeout(() => setAnimationPhase(2), 400),
      setTimeout(() => setAnimationPhase(3), 800),
      setTimeout(() => setChartVisible(true), 1200)
    ];
    
    return () => timers.forEach(clearTimeout);
  }, [selectedPeriod]);

  const periods = [
    { label: 'Last 30 days', color: 'bg-teal-600' },
    { label: 'Last 7 days', color: 'bg-[#2D5F5D]' }
  ];

  const metrics = [
    { label: 'Peak Daily', value: currentData.peak, color: 'border-teal-500' },
    { label: 'Daily Average', value: currentData.average, color: 'border-teal-700' },
    { label: 'Total in Period', value: currentData.total, color: 'border-[#2D5F5D]' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 mb-8 overflow-hidden font-light">
      <div className="p-8">
        {/* Header */}
        <div className="mb-12">
          <h1 
            className={`text-4xl font-extralight text-slate-900 mb-2 tracking-tight transition-all duration-1000 ${
              animationPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Feedback Analytics
          </h1>
          <p 
            className={`text-lg text-slate-500 font-light transition-all duration-1000 delay-200 ${
              animationPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Student feedback volume for the {selectedPeriod.toLowerCase()}
          </p>
        </div>

        {/* Main Chart Container */}
        <div className="relative bg-white rounded-none border-0">
          
          {/* Legend */}
          <div className="absolute top-2 left-8 z-10 flex gap-8">
            <div 
              className={`flex items-center gap-2 transition-all duration-800 delay-300 ${
                animationPhase >= 2 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
              }`}
            >
              <div className="w-3 h-3 rounded-full border-2 border-red-500 bg-red-50"></div>
              <span className="text-slate-700 font-medium">Complaints</span>
              <span className="text-slate-900 font-semibold">{currentData.complaints[currentData.complaints.length - 1]}</span>
            </div>
            <div 
              className={`flex items-center gap-2 transition-all duration-800 delay-400 ${
                animationPhase >= 2 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
              }`}
            >
              <div className="w-3 h-3 rounded-full border-2 border-[#2D5F5D] bg-teal-50"></div>
              <span className="text-slate-700 font-medium">Suggestions</span>
              <span className="text-slate-900 font-semibold">{currentData.suggestions[currentData.suggestions.length - 1]}</span>
            </div>
          </div>

          {/* Period Selection */}
          <div className="absolute top-0 right-8 z-10 flex gap-2">
            {periods.map((period, index) => (
              <div
                key={period.label}
                className={`
                  cursor-pointer transition-all duration-700 hover:scale-105
                  ${selectedPeriod === period.label 
                    ? 'bg-[#2D5F5D] text-white shadow-md' 
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                  }
                  ${animationPhase >= 2 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}
                `}
                style={{
                  transitionDelay: `${500 + index * 150}ms`,
                  borderRadius: '8px',
                  padding: '8px 16px',
                }}
                onClick={() => setSelectedPeriod(period.label)}
              >
                <div className="text-xs font-medium">{period.label}</div>
              </div>
            ))}
          </div>

          {/* Chart Area */}
          <div className="pt-16 pb-8">
            <div className="h-[300px] relative">
              <svg className="w-full h-full" viewBox="0 0 800 300" preserveAspectRatio="none">
                {/* Background Grid */}
                <defs>
                  <pattern id="grid" width="40" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 30" fill="none" stroke="#f8fafc" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="800" height="300" fill="url(#grid)"/>

                {/* Suggestions Area (Desktop equivalent) */}
                <path
                  d={generateSmoothPath(currentData.suggestions, 250, true)}
                  fill="rgba(45, 95, 93, 0.08)"
                  className={`transition-all duration-2000 ${
                    chartVisible ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    transform: chartVisible ? 'scale(1)' : 'scale(0.95)',
                    transformOrigin: 'center bottom'
                  }}
                />

                {/* Complaints Area (Mobile equivalent) */}
                <path
                  d={generateSmoothPath(currentData.complaints, 250, true)}
                  fill="rgba(239, 68, 68, 0.08)"
                  className={`transition-all duration-2000 ${
                    chartVisible ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    transform: chartVisible ? 'scale(1)' : 'scale(0.95)',
                    transformOrigin: 'center bottom',
                    transitionDelay: '300ms'
                  }}
                />

                {/* Suggestions Line */}
                <path
                  d={generateSmoothPath(currentData.suggestions, 250)}
                  fill="none"
                  stroke="#2D5F5D"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className={`transition-all duration-2000 ${
                    chartVisible ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    strokeDasharray: chartVisible ? 'none' : '1000',
                    strokeDashoffset: chartVisible ? '0' : '1000',
                    transitionDelay: '600ms'
                  }}
                />

                {/* Complaints Line */}
                <path
                  d={generateSmoothPath(currentData.complaints, 250)}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className={`transition-all duration-2000 ${
                    chartVisible ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    strokeDasharray: chartVisible ? 'none' : '1000',
                    strokeDashoffset: chartVisible ? '0' : '1000',
                    transitionDelay: '900ms'
                  }}
                />

                {/* Data Points */}
                {currentData.dates.map((date: string, index: number) => {
                  const padding = 60;
                  const chartWidth = 800 - padding * 2;
                  const chartHeight = 250 - padding * 2;
                  const x = padding + (index / (currentData.dates.length - 1)) * chartWidth;
                  const complaintsY = padding + (1 - currentData.complaints[index] / maxValue) * chartHeight;
                  const suggestionsY = padding + (1 - currentData.suggestions[index] / maxValue) * chartHeight;
                  
                  return (
                    <g key={index}>
                      {/* Suggestions Point */}
                      <circle
                        cx={x}
                        cy={suggestionsY}
                        r={hoveredPoint === index ? 5 : 3}
                        fill="#2D5F5D"
                        className={`transition-all duration-500 cursor-pointer ${
                          chartVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                        }`}
                        style={{
                          transitionDelay: `${1200 + index * 100}ms`
                        }}
                        onMouseEnter={() => setHoveredPoint(index)}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                      
                      {/* Complaints Point */}
                      <circle
                        cx={x}
                        cy={complaintsY}
                        r={hoveredPoint === index ? 5 : 3}
                        fill="#ef4444"
                        className={`transition-all duration-500 cursor-pointer ${
                          chartVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                        }`}
                        style={{
                          transitionDelay: `${1300 + index * 100}ms`
                        }}
                        onMouseEnter={() => setHoveredPoint(index)}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                    </g>
                  );
                })}

                {/* X-axis Labels (Reduced frequency for 30 days) */}
                {currentData.dates.map((date: string, index: number) => {
                  if (selectedPeriod === 'Last 30 days' && index % 4 !== 0 && index !== currentData.dates.length - 1) return null;
                  
                  const padding = 60;
                  const chartWidth = 800 - padding * 2;
                  const x = padding + (index / (currentData.dates.length - 1)) * chartWidth;
                  
                  return (
                    <text
                      key={index}
                      x={x}
                      y={280}
                      textAnchor="middle"
                      fill="#9ca3af"
                      fontSize="12"
                      fontWeight="400"
                      className={`transition-all duration-500 ${
                        chartVisible ? 'opacity-100' : 'opacity-0'
                      }`}
                      style={{
                        transitionDelay: `${1500 + (index % 10) * 50}ms`
                      }}
                    >
                      {date}
                    </text>
                  );
                })}

                {/* Hover Tooltip */}
                {hoveredPoint !== null && (
                  <g>
                    <rect
                      x={60 + (hoveredPoint / (currentData.dates.length - 1)) * 680 - 60}
                      y={-10}
                      width="120"
                      height="70"
                      fill="white"
                      stroke="#e5e7eb"
                      strokeWidth="1"
                      rx="6"
                      className="drop-shadow-xl"
                    />
                    <text
                      x={60 + (hoveredPoint / (currentData.dates.length - 1)) * 680}
                      y={10}
                      textAnchor="middle"
                      fill="#1f2937"
                      fontSize="12"
                      fontWeight="600"
                    >
                      {currentData.dates[hoveredPoint]}
                    </text>
                    <text
                      x={60 + (hoveredPoint / (currentData.dates.length - 1)) * 680}
                      y={28}
                      textAnchor="middle"
                      fill="#ef4444"
                      fontSize="11"
                      fontWeight="500"
                    >
                      Complaints: {currentData.complaints[hoveredPoint]}
                    </text>
                    <text
                      x={60 + (hoveredPoint / (currentData.dates.length - 1)) * 680}
                      y={45}
                      textAnchor="middle"
                      fill="#2D5F5D"
                      fontSize="11"
                      fontWeight="500"
                    >
                      Suggestions: {currentData.suggestions[hoveredPoint]}
                    </text>
                  </g>
                )}
              </svg>
            </div>
          </div>

          {/* Bottom Metrics */}
          <div className="flex flex-wrap justify-between items-end gap-6">
            <div className="flex gap-4">
              {metrics.map((metric, index) => (
                <div
                  key={metric.label}
                  className={`
                    bg-white rounded-lg shadow-sm border-2 ${metric.color} p-4 min-w-[120px]
                    transition-all duration-800 hover:scale-105 hover:shadow-md
                    ${animationPhase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
                  `}
                  style={{
                    transitionDelay: `${1800 + index * 200}ms`
                  }}
                >
                  <div className="text-2xl font-bold text-slate-900 mb-1">{metric.value}</div>
                  <div className="text-sm text-slate-600 font-medium">{metric.label}</div>
                </div>
              ))}
            </div>

            {/* Total Feedback */}
            <div 
              className={`bg-[#2D5F5D] text-white px-6 py-4 rounded-lg transition-all duration-800 ${
                animationPhase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: '2400ms' }}
            >
              <div className="flex items-center gap-3">
                <span className="text-teal-100 font-medium">Total Feedback Submissions</span>
                <span className="font-bold text-xl">{currentData.total}</span>
              </div>
              <div className="w-64 h-2 bg-teal-900 rounded-full mt-3 overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r from-teal-400 to-white rounded-full transition-all duration-2000 ${
                    chartVisible ? 'w-full' : 'w-0'
                  }`}
                  style={{ transitionDelay: '2800ms' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
