import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
       Form,
       FormControl,
       FormField,
       FormItem,
       FormLabel,
       FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { deleteProjectMutationFn, editProjectMutationFn, getProjectByIdQueryFn } from "@/lib/api";
import { Loader, Trash2, ArrowLeft, Save, Plus, GripVertical } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/resuable/confirm-dialog";
import EmojiPickerComponent from "@/components/emoji-picker";

const projectSchema = z.object({
       name: z.string().min(1, { message: "Project name is required" }),
       description: z.string().optional(),
       emoji: z.string().optional(),
       taskStatuses: z.array(z.object({
              label: z.string().min(1, "Label is required"),
              value: z.string().min(1, "Value is required"),
              color: z.string().optional(),
              order: z.number().optional(),
       })).optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

const ProjectSettings = () => {
       const params = useParams();
       const projectId = params.projectId as string;
       const workspaceId = useWorkspaceId();
       const navigate = useNavigate();
       const queryClient = useQueryClient();
       const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

       const { data: projectData, isLoading: isLoadingProject } = useQuery({
              queryKey: ["project", projectId],
              queryFn: () => getProjectByIdQueryFn({ workspaceId, projectId }),
              enabled: !!projectId,
       });

       const project = projectData?.project;

       const form = useForm<ProjectFormValues>({
              resolver: zodResolver(projectSchema),
              defaultValues: {
                     name: "",
                     description: "",
                     emoji: "📊",
                     taskStatuses: [],
              },
       });

       const { fields, append, remove } = useFieldArray({
              control: form.control,
              name: "taskStatuses",
       });

       useEffect(() => {
              if (project) {
                     form.reset({
                            name: project.name,
                            description: project.description || "",
                            emoji: project.emoji || "📊",
                            taskStatuses: project.taskStatuses || [],
                     });
              }
       }, [project, form]);

       const { mutate: editProject, isPending: isEditing } = useMutation({
              mutationFn: editProjectMutationFn,
              onSuccess: () => {
                     queryClient.invalidateQueries({ queryKey: ["project", projectId] });
                     queryClient.invalidateQueries({ queryKey: ["all-projects", workspaceId] });
                     toast({
                            title: "Success",
                            description: "Project updated successfully",
                     });
              },
              onError: (error) => {
                     toast({
                            title: "Error",
                            description: error.message,
                            variant: "destructive",
                     });
              },
       });

       const { mutate: deleteProject, isPending: isDeleting } = useMutation({
              mutationFn: deleteProjectMutationFn,
              onSuccess: () => {
                     queryClient.invalidateQueries({ queryKey: ["all-projects", workspaceId] });
                     toast({
                            title: "Success",
                            description: "Project deleted successfully",
                     });
                     navigate(`/workspace/${workspaceId}`);
              },
              onError: (error) => {
                     toast({
                            title: "Error",
                            description: error.message,
                            variant: "destructive",
                     });
              },
       });

       const onSubmit = (values: ProjectFormValues) => {
              // Ensure order is correct
              const taskStatusesWithOrder = values.taskStatuses?.map((status, index) => ({
                     ...status,
                     color: status.color || "#000000",
                     order: index + 1,
              }));

              editProject({
                     projectId,
                     workspaceId,
                     data: {
                            name: values.name,
                            description: values.description || "",
                            emoji: values.emoji || "📊",
                            taskStatuses: taskStatusesWithOrder,
                     }
              })
       };

       const handleDelete = () => {
              deleteProject({
                     workspaceId,
                     projectId
              });
       };

       const handleAddColumn = () => {
              const newLabel = "New Column";
              // Simple value generation: NEW_COLUMN_TIMESTAMP
              const newValue = `STATUS_${Date.now()}`;
              append({
                     label: newLabel,
                     value: newValue,
                     color: "#6366f1", // Default color
                     order: fields.length + 1,
              });
       };

       if (isLoadingProject) {
              return (
                     <div className="flex h-full items-center justify-center">
                            <Loader className="h-6 w-6 animate-spin text-primary" />
                     </div>
              )
       }

       return (
              <div className="w-full max-w-3xl mx-auto py-6 px-4">
                     <div className="mb-6">
                            <Button variant="ghost" className="pl-0 hover:bg-transparent" onClick={() => navigate(-1)}>
                                   <ArrowLeft className="mr-2 h-4 w-4" />
                                   Back
                            </Button>
                            <h1 className="text-2xl font-bold mt-2">Project Settings</h1>
                            <p className="text-muted-foreground">Manage project details and preferences.</p>
                     </div>

                     <div className="grid gap-6">
                            <Card>
                                   <CardHeader>
                                          <CardTitle>General Information</CardTitle>
                                          <CardDescription>Update your project name, description and icon.</CardDescription>
                                   </CardHeader>
                                   <CardContent>
                                          <Form {...form}>
                                                 <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                                        <div className="flex flex-col gap-4">
                                                               <FormField
                                                                      control={form.control}
                                                                      name="emoji"
                                                                      render={({ field }) => (
                                                                             <FormItem>
                                                                                    <FormLabel>Icon</FormLabel>
                                                                                    <FormControl>
                                                                                           <div className="flex items-center gap-2">
                                                                                                  <div className="flex h-10 w-10 items-center justify-center rounded-md border text-xl">
                                                                                                         {field.value}
                                                                                                  </div>
                                                                                                  <EmojiPickerComponent onSelectEmoji={field.onChange}>
                                                                                                         <Button type="button" variant="outline">Choose Icon</Button>
                                                                                                  </EmojiPickerComponent>
                                                                                           </div>
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                             </FormItem>
                                                                      )}
                                                               />

                                                               <FormField
                                                                      control={form.control}
                                                                      name="name"
                                                                      render={({ field }) => (
                                                                             <FormItem>
                                                                                    <FormLabel>Project Name</FormLabel>
                                                                                    <FormControl>
                                                                                           <Input placeholder="Enter project name" {...field} />
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                             </FormItem>
                                                                      )}
                                                               />

                                                               <FormField
                                                                      control={form.control}
                                                                      name="description"
                                                                      render={({ field }) => (
                                                                             <FormItem>
                                                                                    <FormLabel>Description</FormLabel>
                                                                                    <FormControl>
                                                                                           <Textarea
                                                                                                  placeholder="Enter project description"
                                                                                                  className="resize-none min-h-[100px]"
                                                                                                  {...field}
                                                                                           />
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                             </FormItem>
                                                                      )}
                                                               />
                                                        </div>

                                                        <div className="border-t pt-6">
                                                               <div className="flex items-center justify-between mb-4">
                                                                      <div>
                                                                             <h3 className="text-lg font-medium">Kanban Board Columns</h3>
                                                                             <p className="text-sm text-muted-foreground">Customize the columns for your board view.</p>
                                                                      </div>
                                                                      <Button type="button" size="sm" onClick={handleAddColumn} variant="outline">
                                                                             <Plus className="h-4 w-4 mr-2" />
                                                                             Add Column
                                                                      </Button>
                                                               </div>

                                                               <div className="space-y-3">
                                                                      {fields.map((field, index) => (
                                                                             <div key={field.id} className="flex items-center gap-3">
                                                                                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                                                                                    <FormField
                                                                                           control={form.control}
                                                                                           name={`taskStatuses.${index}.label`}
                                                                                           render={({ field }) => (
                                                                                                  <FormItem className="flex-1 space-y-0">
                                                                                                         <FormControl>
                                                                                                                <Input {...field} placeholder="Column Name" />
                                                                                                         </FormControl>
                                                                                                         <FormMessage />
                                                                                                  </FormItem>
                                                                                           )}
                                                                                    />
                                                                                    <Button
                                                                                           type="button"
                                                                                           variant="ghost"
                                                                                           size="icon"
                                                                                           className="text-muted-foreground hover:text-destructive"
                                                                                           onClick={() => remove(index)}
                                                                                           disabled={fields.length <= 1}
                                                                                    >
                                                                                           <Trash2 className="h-4 w-4" />
                                                                                    </Button>
                                                                             </div>
                                                                      ))}
                                                               </div>
                                                        </div>

                                                        <div className="flex justify-end pt-4">
                                                               <Button type="submit" disabled={isEditing}>
                                                                      {isEditing ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                                                      Save Changes
                                                               </Button>
                                                        </div>
                                                 </form>
                                          </Form>
                                   </CardContent>
                            </Card>

                            <Card className="border-destructive/20 bg-destructive/5">
                                   <CardHeader>
                                          <CardTitle className="text-destructive">Danger Zone</CardTitle>
                                          <CardDescription>
                                                 Irreversible actions such as deleting the project.
                                          </CardDescription>
                                   </CardHeader>
                                   <CardContent>
                                          <div className="flex items-center justify-between">
                                                 <div>
                                                        <h4 className="font-medium">Delete Project</h4>
                                                        <p className="text-sm text-muted-foreground">
                                                               This action cannot be undone. This will permanently delete the project and all associated tasks.
                                                        </p>
                                                 </div>
                                                 <Button variant="destructive" onClick={() => setOpenDeleteDialog(true)} disabled={isDeleting}>
                                                        {isDeleting ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                                                        Delete Project
                                                 </Button>
                                          </div>
                                   </CardContent>
                            </Card>
                     </div>

                     <ConfirmDialog
                            isOpen={openDeleteDialog}
                            isLoading={isDeleting}
                            onClose={() => setOpenDeleteDialog(false)}
                            onConfirm={handleDelete}
                            title="Delete Project?"
                            description={`Are you sure you want to delete "${project?.name}"? This action cannot be undone.`}
                            confirmText="Delete"
                            cancelText="Cancel"
                     />
              </div>
       );
};

export default ProjectSettings;
