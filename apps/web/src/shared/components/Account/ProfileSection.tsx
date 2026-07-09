import { getProfile } from "@/shared/actions/user/getProfile";
import { SectionError } from "@/shared/components/SectionError";

import { ProfileSectionContent } from "./ProfileSectionContent";

export const ProfileSection = async () => {
  const { data, error } = await getProfile();
  console.log(error);

  if (error || !data) {
    return (
      <SectionError
        title="Perfil indisponível"
        description="Não foi possível carregar seus dados. Tente novamente mais tarde."
        toastDuration={6000}
      />
    );
  }

  return <ProfileSectionContent user={data.user} />;
};
