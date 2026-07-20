import type { StaticImageData } from "next/image";

import EletronicsCatLogo from "@/shared/assets/images/categoriesLogos/cat_eletronics.webp";
import JeweleryCatLogo from "@/shared/assets/images/categoriesLogos/cat_jewelery.webp";
import MensCatLogo from "@/shared/assets/images/categoriesLogos/cat_mens_clothing.webp";
import WomensCatLogo from "@/shared/assets/images/categoriesLogos/cat_womens_clothing.webp";

export const CATEGORY_LOGO_MAP: Record<string, StaticImageData> = {
  Masculino: MensCatLogo,
  Feminino: WomensCatLogo,
  Joias: JeweleryCatLogo,
  Eletrônicos: EletronicsCatLogo,
};
