import { useThemeCustomizer } from "@/context/theme-customizer-provider";
import { cn } from "@/lib/utils";

const BackgroundGlow = () => {
       const { auroraTheme } = useThemeCustomizer();

       const getThemeColors = () => {
              switch (auroraTheme) {
                     case "northern-lights":
                            return {
                                   primary: "bg-cyan-400/20",
                                   secondary: "bg-blue-600/20",
                                   accent: "bg-green-400/20",
                            };
                     case "sunset":
                            return {
                                   primary: "bg-orange-400/20",
                                   secondary: "bg-purple-600/20",
                                   accent: "bg-pink-500/20",
                            };
                     case "midnight":
                            return {
                                   primary: "bg-indigo-500/20",
                                   secondary: "bg-blue-900/40",
                                   accent: "bg-violet-600/20",
                            };
                     case "nebula":
                            return {
                                   primary: "bg-fuchsia-500/20",
                                   secondary: "bg-purple-800/30",
                                   accent: "bg-blue-500/20",
                            };
                     default:
                            return {
                                   primary: "bg-cyan-400/20",
                                   secondary: "bg-blue-600/20",
                                   accent: "bg-green-400/20",
                            };
              }
       };

       const colors = getThemeColors();

       return (
              <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none transition-colors duration-1000">
                     {/* Overlay to ensure text readability */}
                     <div className="absolute inset-0 bg-white/30 dark:bg-black/20 backdrop-blur-[100px]" />

                     {/* Main Aurora Orbs - Animated */}
                     <div className={cn("absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full blur-[120px] animate-pulse transition-colors duration-1000", colors.primary)} />
                     <div className={cn("absolute bottom-[-10%] left-[-10%] w-[700px] h-[700px] rounded-full blur-[130px] animate-pulse transition-colors duration-1000", colors.secondary)} style={{ animationDelay: "2s" }} />
                     <div className={cn("absolute top-[40%] left-[30%] w-[500px] h-[500px] rounded-full blur-[100px] animate-pulse transition-colors duration-1000 opacity-60", colors.accent)} style={{ animationDelay: "4s" }} />
              </div>
       );
};

export default BackgroundGlow;
