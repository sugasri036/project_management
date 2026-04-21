import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import EditTaskForm from "./edit-task-form";
import { TaskType } from "@/types/api.type";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskComments } from "./task-comments";

const EditTaskDialog = ({ task, isOpen, onClose }: { task: TaskType | null; isOpen: boolean; onClose: () => void }) => {
  if (!task) return null;

  return (
    <Dialog modal={true} open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto my-5 border-0">
        <DialogHeader>
          <DialogTitle>Task Details: {task.taskCode}</DialogTitle>
          <DialogDescription>Edit task details or discuss with your team.</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <EditTaskForm task={task} onClose={onClose} />
          </TabsContent>
          <TabsContent value="comments" className="min-h-[400px]">
            <TaskComments taskId={task._id} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EditTaskDialog;
