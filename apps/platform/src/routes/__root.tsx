import { LanguageSwitcher, useTranslation } from "@repo/i18n";
import { Button } from "@repo/ui/components/button";
import { toast } from "@repo/ui/components/sonner";
import type { QueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { createRootRouteWithContext, Link, Outlet } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { BrandLogo } from "../components/brand";
import { meQueryOptions, useLogoutMutation } from "../modules/auth/hooks/use-auth";

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
                <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                  <Link to="/dashboard">{t("nav.dashboard")}</Link>
                </Button>
                <Button asChild variant="ghost" size="sm">
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
                <span className="hidden max-w-xs truncate text-sm text-muted-foreground lg:block">
                  {user.data.name || user.data.email}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={logoutMutation.isPending}
                  onClick={handleLogout}
                >
                  {logoutMutation.isPending ? t("dashboard.logoutPending") : t("dashboard.logout")}
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("nav.login")}
                </Link>
                <Button asChild size="sm" className="hidden sm:inline-flex">
                  <Link to="/register">{t("nav.register")}</Link>
                </Button>
              </>
            )}
            <div className="hidden xl:block">
              <LanguageSwitcher />
            </div>
          </nav>
        </div>
      </header>
      <main id="main-content" className="flex flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  );
}
