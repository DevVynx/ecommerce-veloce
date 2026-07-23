import { useGoogleLogin } from "@react-oauth/google";
import Image from "next/image";

import { googleAuthAction } from "@/shared/actions/auth/googleAuth";
import googleGLogo from "@/shared/assets/images/authLogos/google-G.png";
import { Button } from "@/shared/components/shadcn-ui/button";
import { useAuthState } from "@/shared/states/auth";

type GoogleSocialLoginButtonProps = {
  redirectTo?: string;
  onSuccess?: () => void;
};

export const GoogleSocialLoginButton = ({
  redirectTo = "/",
  onSuccess,
}: GoogleSocialLoginButtonProps) => {
  const { setUser, setAuthError } = useAuthState();

  const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      const { data, error } = await googleAuthAction(codeResponse.code);
      if (error) {
        setAuthError("Erro ao tentar entrar com o google");
        return;
      }

      if (data) {
        setUser(data.user);
        onSuccess?.();
        window.location.href = redirectTo;
      }
    },
    onError: () => setAuthError("Erro ao tentar entrar com o google"),
    flow: "auth-code",
  });

  return (
    <Button
      onClick={() => login()}
      variant="outline"
      className="border-border flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border py-2 font-semibold transition-colors"
    >
      <span className="bg-border/40 flex items-center justify-center rounded-full p-1">
        <Image src={googleGLogo} alt="Prosseguir com Google" className="h-6 w-6" />
      </span>
      <span>Prosseguir com Google</span>
    </Button>
  );
};
