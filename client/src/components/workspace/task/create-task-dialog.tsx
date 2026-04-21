import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CreateTaskForm from "./create-task-form";

import useCreateTaskDialog from "@/hooks/use-create-task-dialog";

const CreateTaskDialog = (props: { projectId?: string; hideTrigger?: boolean }) => {
  const { open, setOpen } = useCreateTaskDialog();

  const onClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog modal={true} open={open} onOpenChange={setOpen}>
        {!props.hideTrigger && (
          <DialogTrigger asChild>
            <Button>
              <Plus />
              New Task
            </Button>
          </DialogTrigger>
        )}
        <DialogContent className="sm:max-w-lg max-h-auto my-5 border-0">
          <DialogHeader>
            <DialogTitle>Create Task</DialogTitle>
            <DialogDescription>
              Organize and manage tasks, resources, and team collaboration
            </DialogDescription>
          </DialogHeader>
          <CreateTaskForm projectId={props.projectId} onClose={onClose} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateTaskDialog;
