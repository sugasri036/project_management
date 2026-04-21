import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthContext } from "@/context/auth-provider";
import { useZenMode } from "@/context/zen-mode-context";
import { Loader, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const WorkspaceHeader = () => {
  const { workspaceLoading, workspace } = useAuthContext();
  const { toggleZenMode } = useZenMode();

  return (
    <div className="w-full max-w-3xl mx-auto pb-2 flex items-center justify-between">
      {workspaceLoading ? (
        <Loader className="w-8 h-8 animate-spin" />
      ) : (
        <div className="flex items-center gap-4">
          <Avatar className="size-[60px] rounded-lg font-bold ">
            <AvatarFallback className="rounded-lg bg-gradient-to-tl text-[35px]  to-black from-black text-white">
              {workspace?.name?.split(" ")?.[0]?.charAt(0) || "W"}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left leading-tight">
            <span className="truncate font-semibold text-xl">
              {workspace?.name}
            </span>
            <span className="truncate text-sm">Free</span>
          </div>
        </div>
      )}

      {/* Zen Mode Toggle */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleZenMode}
              className="rounded-full hover:bg-white/10 hover:text-cyan-400 transition-colors"
            >
              <Maximize2 className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Enter Zen Mode (Ctrl+J)</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default WorkspaceHeader;
