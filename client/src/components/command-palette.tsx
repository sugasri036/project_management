"use client";

import * as React from "react";
import {
       LayoutDashboard,
       LogOut,
       Moon,
       Sun,
       Laptop,
       Calendar,
       Settings
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
import { useTheme } from "@/components/theme-provider";
import { useNavigate } from "react-router-dom";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { useAuthContext } from "@/context/auth-provider";

export function CommandPalette() {
       const [open, setOpen] = React.useState(false);
       const { setTheme } = useTheme();
       const navigate = useNavigate();
       const workspaceId = useWorkspaceId();
       const { logout } = useAuthContext();

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

       const runCommand = React.useCallback((command: () => unknown) => {
              setOpen(false);
              command();
       }, []);

       return (
              <CommandDialog open={open} onOpenChange={setOpen}>
                     <div className="glass backdrop-blur-3xl bg-white/10 dark:bg-black/40 border-none">
                            <CommandInput placeholder="Type a command or search..." />
                            <CommandList className="max-h-[300px] overflow-y-auto scrollbar">
                                   <CommandEmpty>No results found.</CommandEmpty>

                                   <CommandGroup heading="Navigation">
                                          <CommandItem onSelect={() => runCommand(() => navigate(`/workspace/${workspaceId}`))}>
                                                 <LayoutDashboard className="mr-2 h-4 w-4" />
                                                 <span>Dashboard</span>
                                          </CommandItem>
                                          <CommandItem onSelect={() => runCommand(() => navigate(`/workspace/${workspaceId}/calendar`))}>
                                                 <Calendar className="mr-2 h-4 w-4" />
                                                 <span>Calendar</span>
                                          </CommandItem>
                                          <CommandItem onSelect={() => runCommand(() => navigate(`/workspace/${workspaceId}/settings`))}>
                                                 <Settings className="mr-2 h-4 w-4" />
                                                 <span>Settings</span>
                                                 <CommandShortcut>⌘S</CommandShortcut>
                                          </CommandItem>
                                   </CommandGroup>

                                   <CommandSeparator />

                                   <CommandGroup heading="Theme">
                                          <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
                                                 <Sun className="mr-2 h-4 w-4" />
                                                 <span>Light Mode</span>
                                          </CommandItem>
                                          <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
                                                 <Moon className="mr-2 h-4 w-4" />
                                                 <span>Dark Mode</span>
                                          </CommandItem>
                                          <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
                                                 <Laptop className="mr-2 h-4 w-4" />
                                                 <span>System</span>
                                          </CommandItem>
                                   </CommandGroup>

                                   <CommandSeparator />



                                   <CommandGroup heading="Account">
                                          <CommandItem onSelect={() => runCommand(() => logout())}>
                                                 <LogOut className="mr-2 h-4 w-4" />
                                                 <span>Log out</span>
                                          </CommandItem>
                                   </CommandGroup>
                            </CommandList>
                     </div>
              </CommandDialog>
       );
}
