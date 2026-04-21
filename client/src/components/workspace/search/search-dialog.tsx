import {
       CommandDialog,
       CommandEmpty,
       CommandGroup,
       CommandInput,
       CommandItem,
       CommandList,
       CommandSeparator,
} from "@/components/ui/command";
import { searchWorkspaceQueryFn } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { useDebounce } from "@/hooks/use-debounce";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Loader } from "lucide-react";

export function SearchDialog() {
       const [open, setOpen] = useState(false);
       const [keyword, setKeyword] = useState("");
       const workspaceId = useWorkspaceId();
       const debouncedKeyword = useDebounce(keyword, 300);
       const navigate = useNavigate();

       useEffect(() => {
              const down = (e: KeyboardEvent) => {
                     if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                            e.preventDefault();
                            setOpen((open) => !open);
                     }
              };

              document.addEventListener("keydown", down);
              return () => document.removeEventListener("keydown", down);
       }, []);

       const { data, isLoading } = useQuery({
              queryKey: ["search", workspaceId, debouncedKeyword],
              queryFn: () => searchWorkspaceQueryFn({ workspaceId, keyword: debouncedKeyword }),
              enabled: debouncedKeyword.length > 0,
       });

       const handleSelect = (id: string, type: "project" | "task") => {
              setOpen(false);
              if (type === "project") {
                     navigate(`/workspace/${workspaceId}/project/${id}`);
              } else {
                     // For tasks, we ideally open the task dialog.
                     // Since we don't have a global task dialog context yet, navigation might be tricky if "Tasks" is just a list.
                     // navigating to the project would be safest for now, or the tasks page with a filter?
                     // Let's assume navigating to project tasks view or a direct task link if we had one.
                     // For now, I'll navigate to the project of the task.
                     navigate(`/workspace/${workspaceId}/project/${id}`); // Redirecting to project board
              }
       };

       const projects = data?.results?.projects || [];
       const tasks = data?.results?.tasks || [];
       // const members = data?.results?.members || [];

       return (
              <>
                     <Button
                            variant="outline"
                            className="w-full md:w-auto h-8 px-2 lg:px-3 gap-2 text-muted-foreground bg-muted/50 border-0"
                            onClick={() => setOpen(true)}
                     >
                            <Search className="h-4 w-4" />
                            <span className="hidden lg:inline-flex text-xs">Search...</span>
                            <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 lg:flex ml-2">
                                   <span className="text-xs">⌘</span>K
                            </kbd>
                     </Button>

                     <CommandDialog open={open} onOpenChange={setOpen}>
                            <CommandInput
                                   placeholder="Type a command or search..."
                                   value={keyword}
                                   onValueChange={setKeyword}
                            />
                            <CommandList>
                                   {isLoading && <div className="p-4 text-center text-sm text-muted-foreground"><Loader className="w-4 h-4 animate-spin inline mr-2" />Searching...</div>}
                                   {!isLoading && projects.length === 0 && tasks.length === 0 && <CommandEmpty>No results found.</CommandEmpty>}

                                   {projects.length > 0 && (
                                          <CommandGroup heading="Projects">
                                                 {projects.map((project: any) => (
                                                        <CommandItem
                                                               key={project._id}
                                                               value={`project-${project.name}`}
                                                               onSelect={() => handleSelect(project._id, "project")}
                                                        >
                                                               <span className="mr-2">{project.emoji}</span>
                                                               <span>{project.name}</span>
                                                        </CommandItem>
                                                 ))}
                                          </CommandGroup>
                                   )}

                                   {projects.length > 0 && tasks.length > 0 && <CommandSeparator />}

                                   {tasks.length > 0 && (
                                          <CommandGroup heading="Tasks">
                                                 {tasks.map((task: any) => (
                                                        <CommandItem
                                                               key={task._id}
                                                               value={`task-${task.title}`}
                                                               onSelect={() => handleSelect(task.project._id, "task")}
                                                        >
                                                               <span className="mr-2 text-muted-foreground font-mono text-xs">{task.taskCode}</span>
                                                               <span>{task.title}</span>
                                                               <span className="ml-auto text-xs text-muted-foreground">{task.project.emoji} {task.project.name}</span>
                                                        </CommandItem>
                                                 ))}
                                          </CommandGroup>
                                   )}
                            </CommandList>
                     </CommandDialog>
              </>
       );
}
