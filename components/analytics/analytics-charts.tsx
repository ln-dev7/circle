'use client';

import React from 'react';
import {
   BarChart,
   Bar,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   ResponsiveContainer,
   PieChart,
   Pie,
   Cell,
   LineChart,
   Line,
} from 'recharts';

interface AnalyticsChartsProps {
   metrics: {
      totalEvents: number;
      eventsByType: Record<string, number>;
      impressions: number;
      clicks: number;
      views: number;
      ctr: number;
      roi: number;
      campaignMetrics: Array<{
         id: string;
         name: string;
         totalEvents: number;
         contentCount: number;
         contentMetrics: Array<{
            id: string;
            title: string;
            events: number;
            impressions: number;
            clicks: number;
            views: number;
         }>;
      }>;
   };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function AnalyticsCharts({ metrics }: AnalyticsChartsProps) {
   // Prepare data for event types pie chart
   const eventTypesData = Object.entries(metrics.eventsByType).map(([type, count]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: count,
   }));

   // Prepare data for campaign performance bar chart
   const campaignData = metrics.campaignMetrics.map((campaign) => ({
      name: campaign.name.length > 15 ? campaign.name.substring(0, 15) + '...' : campaign.name,
      events: campaign.totalEvents,
      content: campaign.contentCount,
   }));

   // Prepare data for performance metrics line chart
   const performanceData = [
      { name: 'Impressions', value: metrics.impressions },
      { name: 'Clicks', value: metrics.clicks },
      { name: 'Views', value: metrics.views },
   ];

   return (
      <div className="grid gap-6 md:grid-cols-2">
         {/* Event Types Distribution */}
         <div className="rounded-lg border p-4">
            <h3 className="text-lg font-semibold mb-4">Event Types Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
               <PieChart>
                  <Pie
                     data={eventTypesData}
                     cx="50%"
                     cy="50%"
                     labelLine={false}
                     label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                     outerRadius={80}
                     fill="#8884d8"
                     dataKey="value"
                  >
                     {eventTypesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                     ))}
                  </Pie>
                  <Tooltip />
               </PieChart>
            </ResponsiveContainer>
         </div>

         {/* Campaign Performance */}
         <div className="rounded-lg border p-4">
            <h3 className="text-lg font-semibold mb-4">Campaign Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
               <BarChart data={campaignData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={12} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="events" fill="#8884d8" name="Total Events" />
               </BarChart>
            </ResponsiveContainer>
         </div>

         {/* Performance Metrics */}
         <div className="rounded-lg border p-4 md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Key Performance Metrics</h3>
            <div className="grid gap-4 md:grid-cols-3 mb-4">
               <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                     {metrics.impressions.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Impressions</div>
               </div>
               <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                     {metrics.clicks.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Clicks</div>
               </div>
               <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                     {metrics.ctr.toFixed(2)}%
                  </div>
                  <div className="text-sm text-muted-foreground">CTR</div>
               </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
               <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                     type="monotone"
                     dataKey="value"
                     stroke="#8884d8"
                     strokeWidth={2}
                     dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                  />
               </LineChart>
            </ResponsiveContainer>
         </div>
      </div>
   );
}
