import React from "react";
import Logo from "@/components/logo";
import { Link } from "react-router-dom";
import BackgroundGlow from "../background-glow";

interface AuthLayoutProps {
       children: React.ReactNode;
       title: string;
       description: string;
}

const AuthLayout = ({ children, title, description }: AuthLayoutProps) => {
       return (
              <div className="relative min-h-svh w-full flex items-center justify-center overflow-hidden">
                     {/* Animated Background */}
                     <div className="absolute inset-0 z-0">
                            <BackgroundGlow />
                            {/* Additional overlay for better text contrast/depth */}
                            <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
                     </div>

                     <div className="z-10 w-full max-w-md p-6">
                            <div className="flex flex-col gap-6">
                                   {/* Logo Section */}
                                   {/* Logo Section */}
                                   <div className="flex items-center gap-2 self-center font-medium text-foreground transition-transform hover:scale-105">
                                          <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
                                                 <Logo />
                                          </div>
                                          <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500 animate-pulse">
                                                 Aura
                                          </Link>
                                   </div>

                                   {/* Glass Card */}
                                   <div className="glass-card rounded-2xl p-8 backdrop-blur-xl border border-white/20 shadow-2xl relative overflow-hidden group">
                                          {/* Subtle inner glow effect */}
                                          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>

                                          <div className="relative">
                                                 <div className="text-center mb-8">
                                                        <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
                                                               {title}
                                                        </h1>
                                                        <p className="text-sm text-muted-foreground mt-2">
                                                               {description}
                                                        </p>
                                                 </div>

                                                 {children}
                                          </div>
                                   </div>

                                   {/* Footer Links */}
                                   <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary transition-colors">
                                          By clicking continue, you agree to our{" "}
                                          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
                                   </div>
                            </div>
                     </div>
              </div>
       );
};

export default AuthLayout;
