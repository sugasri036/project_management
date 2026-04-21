import {
       Card,
       CardContent,
       CardHeader,
       CardTitle,
       CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
       BarChart,
       Bar,
       XAxis,
       YAxis,
       CartesianGrid,
       Tooltip,
       Legend,
       ResponsiveContainer,
       PieChart,
       Pie,
       Cell,
} from "recharts";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { useQuery } from "@tanstack/react-query";
import { getWorkspaceAnalyticsQueryFn } from "@/lib/api";

const COLORS = [
       "hsl(var(--chart-1))",
       "hsl(var(--chart-2))",
       "hsl(var(--chart-3))",
       "hsl(var(--chart-4))",
       "hsl(var(--chart-5))",
];

const Reports = () => {
       const workspaceId = useWorkspaceId();

       const { data, isLoading } = useQuery({
              queryKey: ["workspace-analytics", workspaceId],
              queryFn: () => getWorkspaceAnalyticsQueryFn(workspaceId),
       });

       const analytics = data?.analytics;

       // Transform API data for Recharts
       const dataStatus = analytics?.taskDistribution?.map(d => ({
              name: d.status.replace("_", " "), // Format enum like "IN_PROGRESS"
              value: d.count
       })) || [];

       const dataPriority = analytics?.taskPriority?.map(d => ({
              name: d.priority,
              value: d.count
       })) || [];

       const dataMember = analytics?.memberPerformance?.map(d => ({
              name: d.name,
              tasks: d.count
       })) || [];

       if (isLoading) {
              return <div className="p-4">Loading analytics...</div>;
       }

       return (
              <div className="flex flex-col h-full space-y-6 pt-4">
                     <div>
                            <h2 className="text-2xl font-bold tracking-tight">Reports & Analytics</h2>
                            <p className="text-muted-foreground">
                                   Detailed insights into your workspace performance.
                            </p>
                     </div>

                     <Tabs defaultValue="tasks" className="space-y-4">
                            <TabsList>
                                   <TabsTrigger value="tasks">Task Analysis</TabsTrigger>
                                   <TabsTrigger value="members">Member Performance</TabsTrigger>
                            </TabsList>

                            <TabsContent value="tasks" className="space-y-4">
                                   <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                                          <Card className="glass-card">
                                                 <CardHeader>
                                                        <CardTitle>Task Status Distribution</CardTitle>
                                                        <CardDescription>Breakdown of tasks by current status</CardDescription>
                                                 </CardHeader>
                                                 <CardContent className="h-[300px]">
                                                        <ResponsiveContainer width="100%" height="100%">
                                                               <PieChart>
                                                                      <Pie
                                                                             data={dataStatus}
                                                                             cx="50%"
                                                                             cy="50%"
                                                                             labelLine={false}
                                                                             label={({ name, percent }: { name?: string; percent?: number }) => `${name || ''} ${((percent || 0) * 100).toFixed(0)}%`}
                                                                             outerRadius={80}
                                                                             fill="#8884d8"
                                                                             dataKey="value"
                                                                      >
                                                                             {dataStatus.map((_, index) => (
                                                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                                             ))}
                                                                      </Pie>
                                                                      <Tooltip contentStyle={{ backgroundColor: "rgba(255, 255, 255, 0.1)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "8px", color: "var(--foreground)" }} />
                                                                      <Legend />
                                                               </PieChart>
                                                        </ResponsiveContainer>
                                                 </CardContent>
                                          </Card>

                                          <Card className="glass-card">
                                                 <CardHeader>
                                                        <CardTitle>Task Priority Breakdown</CardTitle>
                                                        <CardDescription>Tasks grouped by priority level</CardDescription>
                                                 </CardHeader>
                                                 <CardContent className="h-[300px]">
                                                        <ResponsiveContainer width="100%" height="100%">
                                                               <BarChart data={dataPriority}>
                                                                      <CartesianGrid strokeDasharray="3 3" />
                                                                      <XAxis dataKey="name" />
                                                                      <YAxis />
                                                                      <Tooltip contentStyle={{ backgroundColor: "rgba(255, 255, 255, 0.1)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "8px", color: "var(--foreground)" }} cursor={{ fill: 'transparent' }} />
                                                                      <Legend />
                                                                      <Bar dataKey="value" fill="#82ca9d" name="Tasks" />
                                                               </BarChart>
                                                        </ResponsiveContainer>
                                                 </CardContent>
                                          </Card>
                                   </div>
                            </TabsContent>

                            <TabsContent value="members" className="space-y-4">
                                   <Card className="glass-card">
                                          <CardHeader>
                                                 <CardTitle>Tasks Assigned by Member</CardTitle>
                                                 <CardDescription>Workload distribution across team members</CardDescription>
                                          </CardHeader>
                                          <CardContent className="h-[400px]">
                                                 <ResponsiveContainer width="100%" height="100%">
                                                        <BarChart data={dataMember} layout="vertical">
                                                               <CartesianGrid strokeDasharray="3 3" />
                                                               <XAxis type="number" />
                                                               <YAxis dataKey="name" type="category" width={100} />
                                                               <Tooltip contentStyle={{ backgroundColor: "rgba(255, 255, 255, 0.1)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "8px", color: "var(--foreground)" }} cursor={{ fill: 'transparent' }} />
                                                               <Legend />
                                                               <Bar dataKey="tasks" fill="#8884d8" name="Assigned Tasks" radius={[0, 4, 4, 0]} />
                                                        </BarChart>
                                                 </ResponsiveContainer>
                                          </CardContent>
                                   </Card>
                            </TabsContent>
                     </Tabs>
              </div>
       );
};

export default Reports;
