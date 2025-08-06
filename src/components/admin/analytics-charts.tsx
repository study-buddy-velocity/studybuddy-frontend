"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts'

interface ActivityData {
  date: string
  queries: number
  timeSpent: number
  subjects: string[]
}

interface SubjectDistribution {
  subject: string
  percentage: number
  queries: number
}

interface PerformanceTrend {
  date: string
  accuracy: number
  rank: number
}

interface AnalyticsChartsProps {
  dailyActivity: ActivityData[]
  subjectDistribution: SubjectDistribution[]
  performanceTrend: PerformanceTrend[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

export default function AnalyticsCharts({ dailyActivity, subjectDistribution, performanceTrend }: AnalyticsChartsProps) {
  // Prepare data for charts
  const activityChartData = dailyActivity.slice(-14).map(day => ({
    date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    queries: day.queries,
    timeSpent: day.timeSpent
  }))

  const performanceChartData = performanceTrend.slice(-14).map(day => ({
    date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    accuracy: day.accuracy,
    rank: day.rank
  }))

  return (
    <div className="space-y-8">
      {/* Daily Activity Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Daily Activity (Last 14 Days)</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activityChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#f8fafc', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="queries" 
                stackId="1"
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.6}
                name="Queries"
              />
              <Area 
                type="monotone" 
                dataKey="timeSpent" 
                stackId="1"
                stroke="#10b981" 
                fill="#10b981" 
                fillOpacity={0.6}
                name="Time Spent (min)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Distribution Pie Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Subject Distribution</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subjectDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ subject, percentage }) => `${subject}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="percentage"
                >
                  {subjectDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Percentage']}
                  contentStyle={{ 
                    backgroundColor: '#f8fafc', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {subjectDistribution.map((subject, index) => (
              <div key={subject.subject} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm text-gray-600">{subject.subject}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Trend */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Performance Trend</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  yAxisId="accuracy"
                  orientation="left"
                  tick={{ fontSize: 12 }}
                  domain={[0, 100]}
                />
                <YAxis 
                  yAxisId="rank"
                  orientation="right"
                  tick={{ fontSize: 12 }}
                  domain={[1, 100]}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#f8fafc', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  yAxisId="accuracy"
                  type="monotone" 
                  dataKey="accuracy" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  name="Accuracy (%)"
                />
                <Line 
                  yAxisId="rank"
                  type="monotone" 
                  dataKey="rank" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                  name="Rank"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm text-gray-600">Accuracy (%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-sm text-gray-600">Rank</span>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Activity Pattern */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Weekly Activity Pattern</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[
              { day: 'Mon', queries: Math.floor(Math.random() * 20) + 5 },
              { day: 'Tue', queries: Math.floor(Math.random() * 20) + 5 },
              { day: 'Wed', queries: Math.floor(Math.random() * 20) + 5 },
              { day: 'Thu', queries: Math.floor(Math.random() * 20) + 5 },
              { day: 'Fri', queries: Math.floor(Math.random() * 20) + 5 },
              { day: 'Sat', queries: Math.floor(Math.random() * 15) + 2 },
              { day: 'Sun', queries: Math.floor(Math.random() * 15) + 2 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#f8fafc', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Bar 
                dataKey="queries" 
                fill="#3b82f6" 
                radius={[4, 4, 0, 0]}
                name="Queries"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
