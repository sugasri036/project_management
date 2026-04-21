import { useState } from "react";
import { Link } from "react-router-dom";
import { EllipsisIcon, Loader, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroupContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Logo from "@/components/logo";
import LogoutDialog from "./logout-dialog";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import NotificationBell from "../notifications/notification-bell";
import { Separator } from "../ui/separator";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { useAuthContext } from "@/context/auth-provider";
import { ModeToggle } from "../mode-toggle";


const Asidebar = () => {
  const { isLoading, user } = useAuthContext();

  const { open } = useSidebar();
  const workspaceId = useWorkspaceId();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Sidebar collapsible="icon" variant="floating" className="border-r border-white/10 bg-gradient-to-b from-background/80 to-background/40 backdrop-blur-2xl text-sidebar-foreground shadow-2xl transition-all duration-300 hover:bg-background/90 group/sidebar">
        <SidebarHeader className="py-4 bg-transparent text-sidebar-foreground mb-2">
          <div className="flex items-center justify-start w-full px-2 gap-2 transition-all duration-300 group-data-[collapsible=icon]/sidebar:justify-center">
            <div className="p-1 rounded-lg bg-primary/10 group-data-[collapsible=icon]/sidebar:p-0 group-data-[collapsible=icon]/sidebar:bg-transparent">
              <Logo url={`/workspace/${workspaceId}`} />
            </div>
            {open && (
              <Link
                to={`/workspace/${workspaceId}`}
                className="hidden md:flex flex-col justify-center"
              >
                <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500 animate-pulse tracking-wide">
                  Aura
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Workspace</span>
              </Link>
            )}
          </div>
        </SidebarHeader>
        <SidebarContent className="!mt-0 bg-transparent text-sidebar-foreground">
          <SidebarGroup className="!py-0">
            <SidebarGroupContent>
              <WorkspaceSwitcher />
              <Separator className="bg-sidebar-border" />
              <NavMain />
              <Separator className="bg-sidebar-border" />
              <NavProjects />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="bg-transparent text-sidebar-foreground p-2">
          <div className="flex items-center justify-between mb-2 px-2">
            <div className="flex items-center gap-1">
              <ModeToggle />
              <NotificationBell />
            </div>
          </div>
          <SidebarMenu>
            <SidebarMenuItem>
              {isLoading ? (
                <Loader
                  size="24px"
                  className="place-self-center self-center animate-spin"
                />
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      size="lg"
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                      <Avatar className="h-8 w-8 rounded-full">
                        <AvatarImage src={user?.profilePicture || ""} />
                        <AvatarFallback className="rounded-full border border-gray-500">
                          {user?.name?.split(" ")?.[0]?.charAt(0)}
                          {user?.name?.split(" ")?.[1]?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {user?.name}
                        </span>
                        <span className="truncate text-xs">{user?.email}</span>
                      </div>
                      <EllipsisIcon className="ml-auto size-4" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                    side={"bottom"}
                    align="start"
                    sideOffset={4}
                  >
                    <DropdownMenuGroup></DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setIsOpen(true)}>
                      <LogOut />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar >

      <LogoutDialog isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default Asidebar;
