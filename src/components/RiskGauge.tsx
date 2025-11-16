interface RiskGaugeProps {
  value: number;
  disease: 'cholera' | 'malaria';
}

export function RiskGauge({ value, disease }: RiskGaugeProps) {
  const percentage = value * 100;
  const rotation = (value * 180) - 90; // -90 to 90 degrees
  
  const riskLevel = value < 0.34 ? 'Low' : value < 0.67 ? 'Moderate' : 'High';
  const riskColor = value < 0.34 ? '#22c55e' : value < 0.67 ? '#eab308' : '#ef4444';
  const diseaseColor = disease === 'cholera' ? '#2563eb' : '#ea580c';

  return (
    <div className="flex flex-col items-center py-6">
      <div className="relative w-64 h-32">
        <svg viewBox="0 0 200 100" className="w-full h-full">
          {/* Background arc */}
          <path
            d="M 10 90 A 80 80 0 0 1 190 90"
            fill="none"
            stroke="#e5e7eb"
            className="dark:stroke-gray-700"
            strokeWidth="20"
            strokeLinecap="round"
          />
          
          {/* Colored segments */}
          <path
            d="M 10 90 A 80 80 0 0 1 63.3 23.3"
            fill="none"
            stroke="#22c55e"
            strokeWidth="20"
            strokeLinecap="round"
          />
          <path
            d="M 63.3 23.3 A 80 80 0 0 1 136.7 23.3"
            fill="none"
            stroke="#eab308"
            strokeWidth="20"
            strokeLinecap="round"
          />
          <path
            d="M 136.7 23.3 A 80 80 0 0 1 190 90"
            fill="none"
            stroke="#ef4444"
            strokeWidth="20"
            strokeLinecap="round"
          />
          
          {/* Needle */}
          <g transform={`rotate(${rotation} 100 90)`}>
            <line
              x1="100"
              y1="90"
              x2="100"
              y2="20"
              stroke={diseaseColor}
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="100" cy="90" r="6" fill={diseaseColor} />
          </g>
        </svg>
        
        {/* Center value */}
        <div className="absolute inset-0 flex items-end justify-center pb-2">
          <div className="text-center">
            <div className="text-3xl dark:text-white" style={{ color: riskColor }}>
              {value.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{riskLevel} Risk</div>
          </div>
        </div>
      </div>
      
      {/* Scale labels */}
      <div className="w-64 flex justify-between mt-2 text-xs text-gray-600 dark:text-gray-400">
        <span>0.0</span>
        <span>0.33</span>
        <span>0.67</span>
        <span>1.0</span>
      </div>
    </div>
  );
}