import { Column, ColumnDef, Row } from "@tanstack/react-table";
import { format, differenceInDays } from "date-fns";

import { DataTableColumnHeader } from "./table-column-header";
import { DataTableRowActions } from "./table-row-actions";
import { Checkbox } from "@/components/ui/checkbox";

import {
  getAvatarColor,
  getAvatarFallbackText,
} from "@/lib/helper";
import { priorities, statuses } from "./data";
import { TaskType } from "@/types/api.type";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const getColumns = (projectId?: string): ColumnDef<TaskType>[] => {
  const columns: ColumnDef<TaskType>[] = [
    {
      id: "_id",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="TASK" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex flex-col space-y-1">
            <span className="font-medium text-[14px] text-gray-700 dark:text-gray-200 truncate  lg:max-w-[280px] max-w-[200px]">
              {row.original.title}
            </span>
            <span className="text-[10px] text-muted-foreground uppercase">{row.original.taskCode}</span>
          </div>
        );
      },
    },
    ...(projectId
      ? []
      : [
        {
          accessorKey: "project",
          header: ({ column }: { column: Column<TaskType, unknown> }) => (
            <DataTableColumnHeader column={column} title="ASSOCIATED" />
          ),
          cell: ({ row }: { row: Row<TaskType> }) => {
            const project = row.original.project;
            if (!project) return <span className="text-xs text-muted-foreground">Not Associated</span>;
            return (
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-600 dark:text-gray-400">{project.name}</span>
              </div>
            );
          },
        },
      ]),
    {
      accessorKey: "assignedTo",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="OWNER" />
      ),
      cell: ({ row }) => {
        const assignees = row.original.assignedTo || [];

        if (assignees.length === 0) return <span className="text-xs text-muted-foreground">Unassigned</span>;

        return (
          <div className="flex -space-x-2 overflow-hidden items-center group">
            {assignees.slice(0, 3).map((assignee) => {
              const name = assignee.name;
              const initials = getAvatarFallbackText(name);
              const avatarColor = getAvatarColor(name);
              return (
                <Avatar key={assignee._id} className="h-6 w-6 border-2 border-white dark:border-gray-900 z-10 hover:z-20 transition-all cursor-pointer" title={name}>
                  <AvatarImage src={assignee.profilePicture || ""} alt={name} />
                  <AvatarFallback className={`${avatarColor} text-[9px]`}>
                    {initials}
                  </AvatarFallback>
                </Avatar>
              );
            })}
            {assignees.length > 3 && (
              <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[9px] border-2 border-white dark:border-gray-900 z-10" title={`+${assignees.length - 3} more`}>
                +{assignees.length - 3}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="STATUS" />
      ),
      cell: ({ row }) => {
        const status = statuses.find(
          (status) => status.value === row.getValue("status")
        );
        if (!status) return null;

        // Custom styling for Zoho look (pill)
        const colorClass = status.value === 'DONE' ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/40 dark:text-green-300' :
          status.value === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-300' :
            'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300';

        return (
          <div className="flex items-center">
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${colorClass} capitalize`}>
              {status.label}
            </span>
          </div>
        );
      },
    },
    {
      id: "startAfter",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="START AFTER" />
      ),
      cell: ({ row }) => {
        const dateStr = row.original.createdAt;
        let diff = "-";

        try {
          if (dateStr) {
            const date = new Date(dateStr);
            if (!isNaN(date.getTime())) {
              diff = format(date, "MMM d");
            }
          }
        } catch (e) {
          console.error("Date parse error", e);
        }

        return (
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">
            {diff}
          </span>
        );
      },
    },
    {
      id: "duration",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="DURATION" />
      ),
      cell: ({ row }) => {
        let duration = "0 days";
        try {
          const start = row.original.createdAt ? new Date(row.original.createdAt) : new Date();
          const end = row.original.dueDate ? new Date(row.original.dueDate) : new Date();

          if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
            const days = differenceInDays(end, start);
            duration = days > 0 ? `${days} days` : "0 days";
          }
        } catch (e) {
          console.error("Duration calculation error", e);
        }

        return (
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {duration}
          </span>
        );
      },
    },
    {
      accessorKey: "priority",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="PRIORITY" />
      ),
      cell: ({ row }) => {
        const priority = priorities.find(
          (priority) => priority.value === row.getValue("priority")
        );
        if (!priority) return null;

        const Icon = priority.icon;

        return (
          <div className="flex items-center gap-1.5">
            {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground" />}
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{priority.label}</span>
          </div>
        );
      },
    },
    {
      id: "createdBy",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="CREATED BY" />
      ),
      cell: () => {
        // Using createdBy if it were populated, else Owner or me
        return <span className="text-xs text-gray-500 dark:text-gray-400">System</span>
      }
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DataTableRowActions row={row} />
      ),
    },
  ];

  return columns;
};
