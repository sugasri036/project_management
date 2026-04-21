import { LayoutGrid, List, Calendar as CalendarIcon } from "lucide-react";
import TaskCalendar from "@/components/workspace/task/task-calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaskTable from "@/components/workspace/task/task-table";
import TaskBoard from "@/components/workspace/task/task-board";
import CreateTaskDialog from "@/components/workspace/task/create-task-dialog";

export default function Tasks() {
  return (
    <Tabs defaultValue="list" className="w-full h-full flex flex-col space-y-8 pt-3">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">All Tasks</h2>
          <p className="text-muted-foreground">
            Here&apos;s the list of tasks for this workspace!
          </p>
        </div>
        <div className="flex items-center gap-4">
          <TabsList className="grid w-auto grid-cols-3">
            <TabsTrigger value="list" title="List View">
              <List className="w-4 h-4 mr-2" /> List
            </TabsTrigger>
            <TabsTrigger value="board" title="Board View">
              <LayoutGrid className="w-4 h-4 mr-2" /> Board
            </TabsTrigger>
            <TabsTrigger value="calendar" title="Calendar View">
              <CalendarIcon className="w-4 h-4 mr-2" /> Calendar
            </TabsTrigger>
          </TabsList>
          <CreateTaskDialog />
        </div>
      </div>

      <TabsContent value="list" className="w-full border-none p-0 outline-none mt-0">
        <TaskTable />
      </TabsContent>

      <TabsContent value="board" className="w-full h-full border-none p-0 outline-none mt-0">
        <div className="h-[calc(100vh-220px)] overflow-x-auto overflow-y-hidden">
          <TaskBoard />
        </div>
      </TabsContent>

      <TabsContent value="calendar" className="w-full h-full border-none p-0 outline-none mt-0">
        <TaskCalendar />
      </TabsContent>
    </Tabs>
  );
}
