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
import { meQueryOptions, useRegisterMutation } from "../modules/auth/hooks/use-auth";

export const Route = createFileRoute("/register")({
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
  component: RegisterPage,
});

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const registerMutation = useRegisterMutation();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password !== confirmPassword) {
      setPasswordError("Passwords don't match");
      return;
    }

    setPasswordError("");
    registerMutation.mutate(
      { email, password, name: email },
      {
        onError: (error) => {
          let errorMessage =
            error instanceof Error ? error.message : "An error occurred during registration.";

          if (errorMessage.toLowerCase().includes("failed to fetch")) {
            errorMessage =
              "Unable to connect to the server. Please check your internet connection or try again later.";
          }

          toast.error("Registration failed", {
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
          <h1>Create an Account</h1>
          <p className="reference-auth-copy">Start tracking your subscriptions today</p>
        </header>

        <Card className="reference-auth-card">
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>Enter your details below to create your account</CardDescription>
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
                  autoComplete="new-password"
                  placeholder="••••••••"
                  minLength={8}
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  className="h-10"
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  minLength={8}
                  required
                  aria-invalid={passwordError ? true : undefined}
                  aria-describedby={passwordError ? "confirm-password-error" : undefined}
                  value={confirmPassword}
                  onChange={(event) => {
                    setConfirmPassword(event.target.value);
                    setPasswordError("");
                  }}
                />
                {passwordError && (
                  <p id="confirm-password-error" className="text-xs font-medium text-destructive">
                    {passwordError}
                  </p>
                )}
              </div>
              <Button type="submit" className="mt-6 w-full" disabled={registerMutation.isPending}>
                {registerMutation.isPending ? "Creating account..." : "Sign Up"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center border-t p-6">
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-primary hover:underline">
                Log in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
