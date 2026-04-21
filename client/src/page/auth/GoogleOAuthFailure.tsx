import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import AuthLayout from "@/components/auth/auth-layout";

const GoogleOAuthFailure = () => {
  const navigate = useNavigate();


  return (
    <AuthLayout
      title="Authentication Failed"
      description="We couldn't sign you in with Google"
    >
      <div className="flex flex-col items-center justify-center gap-6 py-4">
        <div className="rounded-full bg-red-500/10 p-4 border border-red-500/20">
          <svg
            className="h-10 w-10 text-red-500"
            fill="none"
            height="24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="m15 9-6 6" />
            <path d="m9 9 6 6" />
          </svg>
        </div>

        <p className="text-center text-muted-foreground text-sm max-w-xs">
          Something went wrong during the authentication process. Please try again or use a different login method.
        </p>

        <Button
          onClick={() => navigate("/")}
          className="w-full h-11 text-base shadow-md hover:shadow-primary/20 transition-all font-medium"
        >
          Back to Login
        </Button>
      </div>
    </AuthLayout>
  );
};

export default GoogleOAuthFailure;
