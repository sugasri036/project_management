import * as React from "react";
import {
       Calendar,
       Settings,
       User,
       LayoutDashboard,
       LogOut,
       Moon,
       Sun,
       Plus,
} from "lucide-react";
import {
       CommandDialog,
       CommandEmpty,
       CommandGroup,
       CommandInput,
       CommandItem,
       CommandList,
       CommandSeparator,
       CommandShortcut,
} from "@/components/ui/command";
import { useNavigate } from "react-router-dom";
import { useThemeCustomizer } from "@/context/theme-customizer-provider";
import useCreateProjectDialog from "@/hooks/use-create-project-dialog";
import { useAuthContext } from "@/context/auth-provider";
import { logoutMutationFn } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

export function CommandPalette() {
       const [open, setOpen] = React.useState(false);
       const navigate = useNavigate();
       const { setAuroraTheme } = useThemeCustomizer(); // Assuming this context has generic theme toggle or I can toggle dark mode via document class if customizer doesn't support it directly. 
       // Wait, theme customizer is for Aurora. For dark mode, I might need a different context or just manual toggle if not global. 
       // Let's stick to Aurora theme switching for now or navigation.

       const { onOpen: onOpenCreateProject } = useCreateProjectDialog();
       const { user } = useAuthContext();

       const { mutate: logout } = useMutation({
              mutationFn: logoutMutationFn,
              onSuccess: () => {
                     window.location.href = "/";
              },
       });

       React.useEffect(() => {
              const down = (e: KeyboardEvent) => {
                     if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                            e.preventDefault();
                            setOpen((open) => !open);
                     }
              };

              document.addEventListener("keydown", down);
              return () => document.removeEventListener("keydown", down);
       }, []);

       const runCommand = React.useCallback((command: () => void) => {
              setOpen(false);
              command();
       }, []);

       return (
              <CommandDialog open={open} onOpenChange={setOpen}>
                     <CommandInput placeholder="Type a command or search..." />
                     <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup heading="Suggestions">
                                   <CommandItem onSelect={() => runCommand(() => navigate(`/workspace/${user?.currentWorkspace?._id}`))}>
                                          <LayoutDashboard className="mr-2 h-4 w-4" />
                                          <span>Dashboard</span>
                                   </CommandItem>
                                   <CommandItem onSelect={() => runCommand(() => onOpenCreateProject())}>
                                          <Plus className="mr-2 h-4 w-4" />
                                          <span>Create New Project</span>
                                   </CommandItem>
                            </CommandGroup>
                            <CommandSeparator />
                            <CommandGroup heading="Navigation">
                                   <CommandItem onSelect={() => runCommand(() => navigate(`/workspace/${user?.currentWorkspace?._id}/calendar`))}>
                                          <Calendar className="mr-2 h-4 w-4" />
                                          <span>Calendar</span>
                                   </CommandItem>
                                   <CommandItem onSelect={() => runCommand(() => navigate(`/workspace/${user?.currentWorkspace?._id}/members`))}>
                                          <User className="mr-2 h-4 w-4" />
                                          <span>Members</span>
                                   </CommandItem>
                                   <CommandItem onSelect={() => runCommand(() => navigate(`/workspace/${user?.currentWorkspace?._id}/settings`))}>
                                          <Settings className="mr-2 h-4 w-4" />
                                          <span>Settings</span>
                                          <CommandShortcut>⌘S</CommandShortcut>
                                   </CommandItem>
                            </CommandGroup>
                            <CommandSeparator />
                            <CommandGroup heading="Theme">
                                   <CommandItem onSelect={() => runCommand(() => setAuroraTheme("northern-lights"))}>
                                          <Sun className="mr-2 h-4 w-4" />
                                          <span>Northern Lights</span>
                                   </CommandItem>
                                   <CommandItem onSelect={() => runCommand(() => setAuroraTheme("midnight"))}>
                                          <Moon className="mr-2 h-4 w-4" />
                                          <span>Midnight</span>
                                   </CommandItem>
                            </CommandGroup>
                            <CommandSeparator />
                            <CommandGroup heading="Account">
                                   <CommandItem onSelect={() => runCommand(() => logout())} className="text-red-500 aria-selected:text-red-500">
                                          <LogOut className="mr-2 h-4 w-4" />
                                          <span>Log out</span>
                                   </CommandItem>
                            </CommandGroup>
                     </CommandList>
              </CommandDialog>
       );
}
