import { LoginForm } from "./login-form";
import { Logo } from "@/components/shared/logo";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-sm space-y-6 px-4">
        <div className="text-center">
          <Logo size="lg" className="justify-center" />
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to your admin account
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
