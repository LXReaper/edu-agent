import {GlobalRouterPath, siteConfig} from "../../../../constants";
import Link from "next/link";
import {Github, Menu, X} from "lucide-react";
import {ThemeToggle} from "./themeToggle.tsx";
import React from "react";
import {useGitHubStars} from "../../../../hooks/useGitHubStars.tsx";
import {CssVariableNames} from "../../../../lib";

const githubUrl = siteConfig.links.github;

interface RightNavMenuProps {
    isDrawerOpen: boolean;
    setIsDrawerOpen: (b: boolean) => void;
}

export const RightNavMenu: React.FC<RightNavMenuProps> = ({isDrawerOpen, setIsDrawerOpen}) => {
    const {formattedStars, loading: starsLoading} = useGitHubStars(siteConfig.githubName, siteConfig.repository);
    const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
    const user = true;// todo 后续要改成登录的用户信息
    return (
        <div className="flex items-center justify-end flex-shrink-0 w-auto md:w-[200px] ml-auto">
            <div className="flex flex-row items-center gap-2 md:gap-3 shrink-0">
                <div className="flex items-center space-x-3">
                    <Link
                        href={githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden md:flex items-center gap-1.5 h-7 px-2.5 text-xs font-medium rounded-full bg-transparent text-muted-foreground/60 hover:text-muted-foreground hover:bg-accent/30 transition-all duration-200"
                        aria-label="GitHub Repository"
                    >
                        <Github className="size-3.5"/>
                        <span
                            className={`text-xs font-medium transition-opacity duration-200 ${starsLoading ? 'opacity-50' : 'opacity-100'}`}>
                      {formattedStars}
                    </span>
                    </Link>
                    <Link
                        className={`bg-secondary h-8 hidden md:flex items-center justify-center text-sm font-normal
                            tracking-wide rounded-full text-primary-foreground dark:text-secondary-foreground w-fit px-4
                            shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),0_3px_3px_-1.5px_rgba(16,24,40,0.06),0_1px_1px_rgba(16,24,40,0.08)] 
                            border border-white/[0.12] bg-[${CssVariableNames.technologyButtonColor}]`
                        }
                        href={user ? GlobalRouterPath.DASHBOARD : GlobalRouterPath.AUTH}
                    >
                        {user ? "Dashboard" : "Try free"}
                    </Link>
                </div>
                <ThemeToggle/>
                <button
                    className="md:hidden relative border-border size-8 rounded-md cursor-pointer flex items-center justify-center"
                    onClick={toggleDrawer}
                >
                    {isDrawerOpen ? (
                        <X className="size-5"/>
                    ) : (
                        <Menu className="size-5"/>
                    )}
                </button>
            </div>
        </div>
    )
}
