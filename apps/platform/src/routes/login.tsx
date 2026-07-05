import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { toast } from "@repo/ui/components/sonner";
import { createFileRoute, isRedirect, Link, redirect } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";
import { ShieldCheckIcon } from "../components/brand";
import { meQueryOptions, useLoginMutation } from "../modules/auth/hooks/use-auth";

export const Route = createFileRoute("/login")({
  beforeLoad: async ({ context }) => {
    try {
      const user = await context.queryClient.ensureQueryData(meQueryOptions);
      if (user) {
        throw redirect({ to: "/dashboard" });
      }
    } catch (error) {
      if (isRedirect(error)) {
        throw error;
      }
    }
  },
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loginMutation = useLoginMutation();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    loginMutation.mutate(
      { email, password },
      {
        onError: (error) => {
          let errorMessage =
            error instanceof Error
              ? error.message
              : "Please check your credentials and try again.";

          if (errorMessage.toLowerCase().includes("failed to fetch")) {
            errorMessage =
              "Unable to connect to the server. Please check your internet connection or try again later.";
          }

          toast.error("Login failed", {
            description: errorMessage,
          });
        },
      },
    );
  }

  return (
    <section className="reference-auth-shell">
      <div className="w-full max-w-md">
        <header className="reference-auth-heading">
          <span>
            <ShieldCheckIcon className="size-6" />
          </span>
          <h1>Welcome to SubGuardAI</h1>
          <p className="reference-auth-copy">Login to access your subscription tracker</p>
        </header>

        <Card className="reference-auth-card">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your email and password below</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  className="h-10"
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  className="h-10"
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
              <Button type="submit" className="mt-6 w-full" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? "Logging in..." : "Log In"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center border-t p-6">
            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="font-semibold text-primary hover:underline">
                Create one now
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
