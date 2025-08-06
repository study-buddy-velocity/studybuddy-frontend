import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { UserData } from "@/lib/utils";
import Image from "next/image"
import { useEffect, useState, useCallback } from "react";
import { HeatmapGrid } from "./heatMapGrid";
import { subjectApi, Subject } from '@/lib/api/quiz';

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
  const [subjectIdToName, setSubjectIdToName] = useState<{[id: string]: string}>({});
  const [subjectIdToColor, setSubjectIdToColor] = useState<{[id: string]: string}>({});

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



  const fetchHeatMapData = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/heat-map?upperBound=${dateRange[1]}&lowerBound=${dateRange[0]}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data = await response.json();
      setHeatMapData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchHeatMapData();
  }, [fetchHeatMapData]);

  // Fetch all subjects and build ID-to-name and ID-to-color maps
  useEffect(() => {
    async function fetchSubjects() {
      try {
        const subjects: Subject[] = await subjectApi.getAll();
        const idToName: {[id: string]: string} = {};
        const idToColor: {[id: string]: string} = {};
        const colorPalette = [
          'bg-red-500', 'bg-blue-500', 'bg-green-600', 'bg-purple-500', 'bg-indigo-400',
          'bg-teal-500', 'bg-cyan-400', 'bg-emerald-500', 'bg-orange-400', 'bg-pink-500',
          'bg-yellow-500', 'bg-lime-500', 'bg-rose-500', 'bg-amber-500', 'bg-sky-500',
          'bg-fuchsia-500', 'bg-violet-500', 'bg-gray-500', 'bg-slate-500'
        ];
        subjects.forEach((subject, idx) => {
          idToName[subject._id] = subject.name;
          idToColor[subject._id] = colorPalette[idx % colorPalette.length];
        });
        setSubjectIdToName(idToName);
        setSubjectIdToColor(idToColor);
      } catch (err) {
        console.error('Failed to fetch subjects for heatmap:', err);
      }
    }
    fetchSubjects();
  }, []);





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

  // Combine dynamic subject colors with a fallback default color to satisfy SubjectColorMap
  const subjectColorsMap: SubjectColorMap = {
    ...subjectIdToColor,
    default: 'bg-slate-500',
  };

  return (
    <div className="p-6 rounded-lg border-2 border-blue-200 bg-white h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-[50%] overflow-hidden bg-blue-500">
            <Image
              src="/assets/buddy/Joy-profile-icon.svg"
              alt="Recommendation mascot"
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-800">{`Here's what you have`}</h2>
            <p className="text-lg font-medium text-gray-800">been sweating on {userData.name},</p>
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
          <div className="px-4 py-2 rounded-lg border border-blue-200 bg-blue-50">
            <span className="text-sm text-gray-700">Subjects Explored</span>
            <span className="ml-2 text-sm font-medium text-gray-800">{uniqueSubjects?.length}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            {uniqueSubjects?.map((subjectId, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${subjectIdToColor[subjectId] || 'bg-slate-500'}`}></div>
                <span className="text-sm text-gray-700">{subjectIdToName[subjectId] || subjectId}</span>
              </div>
            ))}
          </div>

          <HeatmapGrid
            heatMapData={heatMapData}
            subjectColors={subjectColorsMap}
            period={period}
          />
        </div>
      </div>
    </div>
  );
}