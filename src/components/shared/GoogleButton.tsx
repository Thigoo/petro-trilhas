import { useState } from "react";
import { Button } from "../ui/button";
import { useAuth } from "@/src/providers/AuthProvider";

export function GoogleButton() {
  const [loading, setLoading] = useState(false);
  const { signInWithGoogle } = useAuth();
  const handleGoogleLogin = async () => {
    setLoading(true);

    const { error } = await signInWithGoogle();

    if (error) {
      console.error("Erro ao fazer login com Google:", error.message);
      setLoading(false);
    }
  };
  return (
    <Button
      variant="outline"
      className="w-full py-6 font-medium hover:bg-green-50"
      disabled={loading}
      onClick={handleGoogleLogin}
    >
      <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.51h5.92c-.25 1.22-.98 2.26-2.07 2.96v2.6h3.35c1.96-1.81 3.1-4.46 3.1-7.82z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.35-2.6c-.93.63-2.12 1-3.93 1-3.03 0-5.64-2.05-6.56-4.81H2.18v3.02C4.01 20.65 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.37-1.1-.58-2.27-.58-3.5s.21-2.4.58-3.5H2.18C1.43 8.5 1 10.22 1 12s.43 3.5 1.18 4.91l2.66-2.82z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 4.01 3.35 2.18 7.09l2.66 2.82C6.36 7.43 8.97 5.38 12 5.38z"
        />
      </svg>
      Continuar com Google
    </Button>
  );
}
