import { cn } from "@/lib/utils";

interface AuraLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
       size?: number;
}

const AuraLoader = ({ className, size = 24, ...props }: AuraLoaderProps) => {
       return (
              <div
                     className={cn("relative flex items-center justify-center", className)}
                     style={{ width: size, height: size }}
                     {...props}
              >
                     {/* Outer Ring */}
                     <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary border-r-purple-500 animate-spin [animation-duration:1.5s]" />

                     {/* Inner Ring */}
                     <div className="absolute inset-1 rounded-full border-2 border-transparent border-b-pink-500 border-l-cyan-400 animate-spin [animation-duration:2s] direction-reverse" />

                     {/* Center Glow */}
                     <div className="absolute inset-2 rounded-full bg-primary/20 blur-[2px] animate-pulse" />
              </div>
       );
};

export default AuraLoader;
