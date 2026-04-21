import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";
import { Download, ChevronDown } from "lucide-react";
import { useRef } from "react";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { useQuery } from "@tanstack/react-query";
import { getWorkspaceAnalyticsQueryFn } from "@/lib/api";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { motion } from "framer-motion";

const WorkspaceAnalytics = () => {
  const workspaceId = useWorkspaceId();
  const dashboardRef = useRef<HTMLDivElement>(null);

  const { data } = useQuery({
    queryKey: ["workspace-analytics", workspaceId],
    queryFn: () => getWorkspaceAnalyticsQueryFn(workspaceId),
    staleTime: 0,
    enabled: !!workspaceId,
  });

  const handleDownloadPDF = async () => {
    if (!dashboardRef.current) return;

    const canvas = await html2canvas(dashboardRef.current, {
      scale: 2, // Higher resolution
      useCORS: true, // Handle cross-origin images if any
      backgroundColor: "#ffffff", // Ensure white background
    } as any);

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("workspace-analytics.pdf");
  };

  const analytics = data?.analytics;

  const total = analytics?.totalTasks || 0;
  const completed = analytics?.completedTasks || 0;
  const overdue = analytics?.overdueTasks || 0;
  const pending = Math.max(0, total - completed - overdue);

  const totalBudget = analytics?.totalBudget || 0;
  const actualSpending = analytics?.actualSpending || 0;

  const totalMilestones = analytics?.totalMilestones || 0;
  const completedMilestones = analytics?.completedMilestones || 0;
  const pendingMilestones = totalMilestones - completedMilestones;

  // Colors
  const pendingColor = "hsl(var(--chart-1))";
  const doneColor = "hsl(var(--chart-2))"; // Greenish
  const spendColor = "hsl(var(--chart-3))";
  const overdueColor = "hsl(var(--chart-5))";
  const budgetColor = "hsl(var(--chart-4))";

  const chartData = [
    { name: "Completed", value: completed, color: doneColor },
    { name: "Overdue", value: overdue, color: overdueColor },
    { name: "Pending", value: pending, color: pendingColor },
  ];

  const milestoneData = [
    { name: "Active", value: pendingMilestones, color: pendingColor },
    { name: "Completed", value: completedMilestones, color: doneColor },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={handleDownloadPDF}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </Button>
      </div>
      <div
        ref={dashboardRef}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 p-1"
      >
        {/* Sprint Progress - Using Task Status */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glass-card h-[320px]">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-gradient">
                Sprint Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[250px] w-full min-w-0">
              <div className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={0}
                      outerRadius={80}
                      paddingAngle={0}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          stroke="none"
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: "8px", border: "none" }}
                    />
                    <Legend
                      verticalAlign="middle"
                      align="right"
                      layout="vertical"
                      iconType="square"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Work Item Progress - Donut Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="glass-card h-[320px]">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-gradient">
                Work Item Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[250px] w-full min-w-0">
              <div className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          stroke="none"
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: "8px", border: "none" }}
                    />
                    <Legend
                      verticalAlign="middle"
                      align="right"
                      layout="vertical"
                      iconType="square"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Budget Status - Bar Chart (Real Data) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="glass-card h-[320px]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-gradient">
                  Budget Overview
                </CardTitle>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  Financials <ChevronDown className="h-3 w-3" />
                </div>
              </div>
              <CardDescription className="text-xs">
                Total Planned vs Actual Spending
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[220px] w-full min-w-0">
              <div className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "Budget", value: totalBudget, fill: budgetColor },
                      { name: "Spent", value: actualSpending, fill: spendColor },
                    ]}
                    barSize={40}
                  >
                    <XAxis
                      dataKey="name"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value: any) => `₹${value}`}
                    />
                    <Tooltip
                      contentStyle={{ borderRadius: "8px", border: "none" }}
                      cursor={{ fill: "transparent" }}
                      formatter={(value: any) => `₹${value}`}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Milestone Status - Pie Chart (Real Data) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="glass-card h-[320px]">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-gradient">
                Milestone Status
              </CardTitle>
              <CardDescription className="text-xs">
                {totalMilestones} Key Deliverables Implemented
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[250px] w-full min-w-0">
              {totalMilestones > 0 ? (
                <div className="h-full w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={milestoneData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                      >
                        {milestoneData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            stroke="none"
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ borderRadius: "8px", border: "none" }}
                      />
                      <Legend
                        verticalAlign="middle"
                        align="right"
                        layout="vertical"
                        iconType="square"
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                  No milestones defined yet.
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default WorkspaceAnalytics;
