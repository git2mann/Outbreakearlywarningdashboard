import { KENYA_COUNTIES } from '../data/mockData';
import { DiseaseFilter } from '../App';

interface KenyaMapProps {
  onCountyClick: (county: string) => void;
  diseaseFilter: DiseaseFilter;
}

export function KenyaMap({ onCountyClick, diseaseFilter }: KenyaMapProps) {
  return (
    <div className="w-full aspect-[4/3] bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden relative">
      <svg viewBox="0 0 800 600" className="w-full h-full">
        {/* Simplified Kenya map with county representations */}
        {KENYA_COUNTIES.map((county, index) => {
          const position = getCountyPosition(index);
          const risk = diseaseFilter === 'cholera' 
            ? county.choleraRisk 
            : diseaseFilter === 'malaria' 
            ? county.malariaRisk 
            : Math.max(county.choleraRisk, county.malariaRisk);
          
          const color = getRiskColor(risk);
          
          return (
            <g key={county.name}>
              <rect
                x={position.x}
                y={position.y}
                width="150"
                height="120"
                fill={color}
                stroke="#fff"
                strokeWidth="3"
                className="dark:stroke-gray-600 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => onCountyClick(county.name)}
              />
              <text
                x={position.x + 75}
                y={position.y + 55}
                textAnchor="middle"
                className="pointer-events-none fill-gray-900 dark:fill-white text-sm"
              >
                {county.name}
              </text>
              <text
                x={position.x + 75}
                y={position.y + 75}
                textAnchor="middle"
                className="pointer-events-none fill-gray-700 dark:fill-gray-300 text-xs"
              >
                Risk: {risk.toFixed(2)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function getCountyPosition(index: number): { x: number; y: number } {
  const cols = 4;
  const col = index % cols;
  const row = Math.floor(index / cols);
  return {
    x: col * 160 + 80,
    y: row * 130 + 60
  };
}

function getRiskColor(risk: number): string {
  if (risk < 0.34) return '#22c55e'; // green-500
  if (risk < 0.67) return '#eab308'; // yellow-500
  return '#ef4444'; // red-500
}