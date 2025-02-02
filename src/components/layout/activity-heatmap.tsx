import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/hooks/useAuthenticationHook";
import { UserData } from "@/lib/utils";
import Image from "next/image"
import { useEffect, useState } from "react";
import { HeatmapGrid } from "./heatMapGrid";

interface ProfileInfoProps {
  userData: UserData;
}

interface HeatMapData {
  date: string;
  subjects: string[];
}

type SubjectColorMap = {
  [key: string]: string;
  default: string;
};

export function ActivityHeatmap({ userData }: ProfileInfoProps) {
  const [heatMapData, setHeatMapData] = useState<HeatMapData[]>([]);
  const [period, setPeriods] = useState("monthly");

  function getDateRange(period: 'daily' | 'weekly' | 'monthly' = 'monthly') {
    const endDate = new Date();
    const startDate = new Date();

    switch (period) {
      case 'daily':
        startDate.setDate(startDate.getDate() - 1);
        break;
      case 'weekly':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'monthly':
      default:
        startDate.setMonth(startDate.getMonth() - 1);
        break;
    }

    return [
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    ];
  }

  const [dateRange, setDateRange] = useState<string[]>(() => getDateRange());

  const handlePeriodChange = (value: string) => {
    const range = getDateRange(value as 'daily' | 'weekly' | 'monthly');
    setDateRange(range);
    setPeriods(value);
  };

  const { getAuthHeaders } = useAuth();

  const fetchHeatMapData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/heat-map?upperBound=${dateRange[1]}&lowerBound=${dateRange[0]}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      setHeatMapData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchHeatMapData();
  }, [fetchHeatMapData]);

  const subjectColors: SubjectColorMap = {
    English: 'bg-red-500',
    Mathematics: 'bg-blue-500',
    Geometry: 'bg-green-600',
    Algebra: 'bg-purple-500',
    Numerical: 'bg-indigo-400',
    Science: 'bg-teal-500',
    Chemistry: 'bg-cyan-400',
    Biology: 'bg-emerald-500',
    Physics: 'bg-orange-400',
    'Social Science': 'bg-pink-500',
    Geography: 'bg-yellow-500',
    Economics: 'bg-lime-500',
    'Political Science': 'bg-rose-500',
    History: 'bg-amber-500',
    'Computer Science': 'bg-sky-500',
    Electronics: 'bg-fuchsia-500',
    Electricals: 'bg-violet-500',
    Statistics: 'bg-gray-500',
    default: 'bg-slate-500'
  };

  const getSubjectColor = (subject: string) => {
    return subjectColors[subject] || subjectColors.default;
  };

  const getUniqueSubjects = (data: HeatMapData[]): string[] => {
    const subjectSet = new Set<string>();

    data.forEach((entry) => {
      entry.subjects.forEach((subject) => {
        subjectSet.add(subject);
      });
    });

    return Array.from(subjectSet);
  };

  const uniqueSubjects = getUniqueSubjects(heatMapData);

  return (
    <div className="p-6 rounded-[22.5px] border-2 border-[#737373] h-full" style={{ background: "#232323" }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-[50%] overflow-hidden bg-[#8640FF]">
            <Image
              src="/assets/buddy/Joy-profile-icon.svg"
              alt="Recommendation mascot"
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-lg font-medium">{`Here's what you have`}</h2>
            <p className="text-lg font-medium">been sweating on {userData.name},</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select
            onValueChange={handlePeriodChange}
            defaultValue="monthly"
          >
            <SelectTrigger>
              <SelectValue placeholder="monthly" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          <div className="px-4 py-2 rounded-[14px] border border-[#737373] bg-[#232323]">
            <span className="text-sm">Subjects Explored</span>
            <span className="ml-2 text-sm font-medium">{uniqueSubjects?.length}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            {uniqueSubjects?.map((subject, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getSubjectColor(subject)}`}></div>
                <span className="text-sm">{subject}</span>
              </div>
            ))}
          </div>

          <HeatmapGrid
            heatMapData={heatMapData}
            subjectColors={subjectColors}
            period={period}
          />
        </div>
      </div>
    </div>
  );
}