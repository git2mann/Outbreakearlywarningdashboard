interface RiskGaugeProps {
  value: number;
  disease: 'cholera' | 'malaria';
}

export function RiskGauge({ value, disease }: RiskGaugeProps) {
  const percentage = value * 100;
  const rotation = (value * 180) - 90; // -90 to 90 degrees
  
  const riskLevel = value < 0.34 ? 'Low' : value < 0.67 ? 'Moderate' : 'High';
  const riskColor = value < 0.34 ? '#10b981' : value < 0.67 ? '#f59e0b' : '#ef4444';
  const diseaseColor = disease === 'cholera' ? '#3b82f6' : '#f97316';

  return (
    <div className="flex flex-col items-center py-4">
      <div className="relative w-48 h-24">
        <svg viewBox="0 0 200 100" className="w-full h-full">
          {/* Professional gradient definition */}
          <defs>
            <linearGradient id={`gaugeGradient-${disease}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 1 }} />
              <stop offset="50%" style={{ stopColor: '#f59e0b', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#ef4444', stopOpacity: 1 }} />
            </linearGradient>
            
            {/* Subtle shadow for depth */}
            <filter id={`shadow-${disease}`} x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.2"/>
            </filter>
          </defs>
          
          {/* Background arc - thinner and more subtle */}
          <path
            d="M 20 85 A 65 65 0 0 1 180 85"
            fill="none"
            stroke="#e5e7eb"
            className="dark:stroke-gray-700"
            strokeWidth="12"
            strokeLinecap="round"
          />
          
          {/* Risk level segments - professional design */}
          <path
            d="M 20 85 A 65 65 0 0 1 180 85"
            fill="none"
            stroke={`url(#gaugeGradient-${disease})`}
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.9"
          />
          
          {/* Tick marks for scale */}
          {[0, 0.33, 0.67, 1].map((tick, i) => {
            const angle = (tick * 180) - 90;
            const rad = (angle * Math.PI) / 180;
            const x1 = 100 + 65 * Math.cos(rad);
            const y1 = 85 + 65 * Math.sin(rad);
            const x2 = 100 + 72 * Math.cos(rad);
            const y2 = 85 + 72 * Math.sin(rad);
            
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#94a3b8"
                className="dark:stroke-gray-600"
                strokeWidth="2"
                strokeLinecap="round"
              />
            );
          })}
          
          {/* Needle - sleek professional design */}
          <g transform={`rotate(${rotation} 100 85)`} filter={`url(#shadow-${disease})`}>
            {/* Needle shadow/base */}
            <path
              d="M 98 85 L 100 25 L 102 85 Z"
              fill={diseaseColor}
              opacity="0.9"
            />
            {/* Center hub */}
            <circle cx="100" cy="85" r="6" fill={diseaseColor} />
            <circle cx="100" cy="85" r="3" fill="white" className="dark:fill-gray-200" />
          </g>
        </svg>
        
        {/* Compact center value display */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ marginTop: '-20px' }}>
          <div className="text-center">
            <div 
              className="text-2xl tracking-tight dark:text-white" 
              style={{ 
                color: riskColor,
                fontVariantNumeric: 'tabular-nums'
              }}
            >
              {(value * 100).toFixed(0)}%
            </div>
          </div>
        </div>
      </div>
      
      {/* Compact scale labels */}
      <div className="w-48 flex justify-between text-[10px] text-gray-500 dark:text-gray-500 tracking-tight mt-1">
        <span>0</span>
        <span className="text-green-600 dark:text-green-500">Low</span>
        <span className="text-amber-600 dark:text-amber-500">Mod</span>
        <span className="text-red-600 dark:text-red-500">High</span>
        <span>100</span>
      </div>
      
      {/* Risk level badge - professional and compact */}
      <div 
        className="mt-2 px-3 py-1 rounded-full text-xs tracking-wide"
        style={{
          backgroundColor: `${riskColor}15`,
          color: riskColor,
          border: `1px solid ${riskColor}40`
        }}
      >
        {riskLevel} Risk
      </div>
    </div>
  );
}