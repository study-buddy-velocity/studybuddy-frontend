import React from 'react';

interface HeatMapData {
  date: string;
  subjects: string[];
}

type SubjectColorMap = {
  [key: string]: string;
  default: string;
};

interface HeatmapGridProps {
  heatMapData: HeatMapData[];
  subjectColors: SubjectColorMap;
  period:string;
}

export const HeatmapGrid: React.FC<HeatmapGridProps> = ({ heatMapData, subjectColors, period }) => {
    let numColumns = 1; // Default for daily

    // Calculate the number of columns based on the period
    if (period === "weekly") {
      numColumns = 7; // 7 days in a week
    } else if (period === "monthly") {
      const currentMonthDays = new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        0
      ).getDate(); // Get the total days in the current month
      numColumns = currentMonthDays;
    }
  return (
    <div
      className={`grid grid-cols-${numColumns} gap-1`}
      style={{
        gridTemplateColumns: `repeat(${numColumns}, minmax(0, 1fr))`, // Dynamic columns
      }}
    >
      {/* Heatmap Data */}
      {heatMapData.map((entry, colIndex) => (
  <div key={`col-${colIndex}`} className="space-y-1">
    {entry.subjects.map((subject, rowIndex) => (
      <div
        key={`cell-${colIndex}-${rowIndex}`}
        className={`w-6 h-6 max-sm:w-2 max-sm:h-2 rounded max-sm:rounded-sm border border-[#A1A1A14D] ${subjectColors[subject]}`}
      ></div>
    ))}
  </div>
))}

{/* Empty cells to fill remaining space */}
{[...Array(Math.max(0, numColumns - heatMapData.length))].map(
  (_, colIndex) => (
    <div key={`empty-col-${colIndex}`} className="space-y-1">
      {[...Array(6)].map((_, rowIndex) => (
        <div
          key={`empty-${colIndex}-${rowIndex}`}
          className="w-6 h-6 max-sm:w-2 max-sm:h-2 rounded max-sm:rounded-sm bg-black/20 border border-[#A1A1A14D]"
          ></div>
      ))}
    </div>
  )
)}
    </div>
  );
};