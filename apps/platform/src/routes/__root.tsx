import { LanguageSwitcher, useTranslation } from "@repo/i18n";
import { Button } from "@repo/ui/components/button";
import { toast } from "@repo/ui/components/sonner";
import type { QueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { createRootRouteWithContext, Link, Outlet } from "@tanstack/react-router";
import { Sparkles, LogOut, Menu } from "lucide-react";
import { BrandLogo } from "../components/brand";
import { meQueryOptions, useLogoutMutation } from "../modules/auth/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/avatar";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootLayout,
});

function RootLayout() {
  const { t } = useTranslation();
  const user = useQuery(meQueryOptions);
  const logoutMutation = useLogoutMutation();

  function handleLogout() {
    logoutMutation.mutate(undefined, {
      onError: (error) => {
        const message = error instanceof Error ? error.message : t("dashboard.logoutFallbackError");
        toast.error(message);
      },
    });
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only fixed left-4 top-4 z-50 rounded-md bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only"
      >
        {t("accessibility.skipToContent")}
      </a>
      <header className="reference-header">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
          <BrandLogo />
          <nav aria-label={t("nav.primaryLabel")} className="flex items-center gap-1 sm:gap-2">
            {user.data ? (
              <>
                <div className="sm:hidden">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label="Menu" className="mr-1">
                        <Menu className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem asChild>
                        <Link to="/dashboard" className="w-full cursor-pointer">{t("nav.dashboard")}</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/subscriptions" search={{ sort: "nextBillingDateAsc" }} className="w-full cursor-pointer">
                          {t("nav.subscriptions")}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/ai-review" className="w-full cursor-pointer">
                          <Sparkles className="mr-2 h-4 w-4 text-primary" />
                          AI Assistant
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                  <Link to="/dashboard">{t("nav.dashboard")}</Link>
                </Button>
                <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                  <Link to="/subscriptions" search={{ sort: "nextBillingDateAsc" }}>
                    {t("nav.subscriptions")}
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex text-primary">
                  <Link to="/ai-review">
                    <Sparkles className="mr-2 h-4 w-4" />
                    AI Assistant
                  </Link>
                </Button>
                <div className="hidden">
                  <LanguageSwitcher />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.data.image || ""} alt={user.data.name || user.data.email || "User"} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {(user.data.name || user.data.email || "U").charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.data.name || "User"}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.data.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleLogout} 
                      disabled={logoutMutation.isPending}
                      className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{logoutMutation.isPending ? t("dashboard.logoutPending") : t("dashboard.logout")}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <div className="sm:hidden">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label="Menu">
                        <Menu className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem asChild>
                        <Link to="/login" className="w-full cursor-pointer">{t("nav.login")}</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/register" className="w-full cursor-pointer">{t("nav.register")}</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="hidden">
                  <LanguageSwitcher />
                </div>
                <Link
                  to="/login"
                  className="hidden sm:inline-flex px-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("nav.login")}
                </Link>
                <Button asChild size="sm" className="hidden sm:inline-flex">
                  <Link to="/register">{t("nav.register")}</Link>
                </Button>
              </>
            )}

          </nav>
        </div>
      </header>
      <main id="main-content" className="flex flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  );
}
