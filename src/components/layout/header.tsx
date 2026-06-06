"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { LogOut, Menu, Settings as SettingsIcon, User, Globe } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const pageTitleKeys: Record<string, string> = {
  "/dashboard": "sidebar.dashboard",
  "/inbox": "sidebar.inbox",
  "/contacts": "sidebar.contacts",
  "/pipelines": "sidebar.pipelines",
  "/broadcasts": "sidebar.broadcasts",
  "/automations": "sidebar.automations",
  "/chatbots": "sidebar.chatbots",
  "/flows": "sidebar.flows",
  "/settings": "sidebar.settings",
};

export function Header({ onOpenSidebar }: { onOpenSidebar?: () => void }) {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();
  const { t, language, setLanguage } = useLanguage();

  function getTitle(path: string): string {
    const key = Object.keys(pageTitleKeys).find(
      (p) => path === p || (p !== "/dashboard" && path.startsWith(p))
    );
    return key ? t(pageTitleKeys[key]) : t("sidebar.dashboard");
  }

  const title = getTitle(pathname);

  const initial =
    profile?.full_name?.charAt(0)?.toUpperCase() ??
    profile?.email?.charAt(0)?.toUpperCase() ??
    "U";

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-slate-800 bg-slate-950 px-4 lg:px-6">
      <div className="flex min-w-0 items-center gap-2">
        {/* Hamburger — mobile only. 44×44 hit target per Apple HIG. */}
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="Open menu"
          className="flex h-10 w-10 items-center justify-center rounded-md text-slate-300 transition-colors hover:bg-slate-800 hover:text-white lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="truncate text-base font-semibold text-white sm:text-lg">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Language selector */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-850 hover:text-white focus:outline-none"
            aria-label="Change language"
          >
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">
              {language === "ar" ? "العربية" : "English"}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={6}
            className="min-w-32 bg-slate-900 text-slate-100 ring-slate-700"
          >
            <DropdownMenuItem
              onClick={() => setLanguage("ar")}
              className={`text-slate-200 focus:bg-slate-800 focus:text-white ${language === "ar" ? "bg-slate-800/40 text-white" : ""}`}
            >
              العربية
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setLanguage("en")}
              className={`text-slate-200 focus:bg-slate-800 focus:text-white ${language === "en" ? "bg-slate-800/40 text-white" : ""}`}
            >
              English
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex items-center gap-2 rounded-md px-1 py-1 transition-colors hover:bg-slate-800/70 focus:bg-slate-800/70 focus:outline-none data-popup-open:bg-slate-800/70 sm:gap-3 sm:pl-1 sm:pr-3"
            aria-label="Open account menu"
          >
            <Avatar className="size-8">
              {profile?.avatar_url ? (
                <AvatarImage
                  src={profile.avatar_url}
                  alt={profile.full_name ?? "Avatar"}
                />
              ) : null}
              <AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">
                {initial}
              </AvatarFallback>
            </Avatar>
            <span className="hidden text-sm font-medium text-white sm:inline">
              {profile?.full_name ?? "User"}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={6}
            className="min-w-56 bg-slate-900 text-slate-100 ring-slate-700"
          >
            <div className="px-2 py-1.5">
              <p className="truncate text-sm font-medium text-white">
                {profile?.full_name ?? "User"}
              </p>
              <p className="truncate text-xs text-slate-400">
                {profile?.email ?? ""}
              </p>
            </div>
            <DropdownMenuSeparator className="bg-slate-800" />
            <DropdownMenuItem
              render={
                <Link
                  href="/settings?tab=profile"
                  className="text-slate-200 focus:bg-slate-800 focus:text-white"
                />
              }
            >
              <User className="size-4" />
              {t("sidebar.profile")}
            </DropdownMenuItem>
            <DropdownMenuItem
              render={
                <Link
                  href="/settings?tab=whatsapp"
                  className="text-slate-200 focus:bg-slate-800 focus:text-white"
                />
              }
            >
              <SettingsIcon className="size-4" />
              {t("sidebar.settings")}
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-800" />
            <DropdownMenuItem
              onClick={signOut}
              className="text-slate-200 focus:bg-slate-800 focus:text-white"
            >
              <LogOut className="size-4" />
              {t("sidebar.signOut")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
