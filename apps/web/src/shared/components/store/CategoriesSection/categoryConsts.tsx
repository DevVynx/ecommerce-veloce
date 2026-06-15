import EletronicsCatLogo from "@/shared/assets/images/categoriesLogos/cat_eletronics.webp";
import JeweleryCatLogo from "@/shared/assets/images/categoriesLogos/cat_jewelery.webp";
import MensCatLogo from "@/shared/assets/images/categoriesLogos/cat_mens_clothing.webp";
import WomensCatLogo from "@/shared/assets/images/categoriesLogos/cat_womens_clothing.webp";

export const HOME_CATEGORIES = [
  { logo: MensCatLogo, label: "Masculino", href: "/search?categoryId=cat-masculino" },
  { logo: WomensCatLogo, label: "Feminino", href: "/search?categoryId=cat-feminino" },
  { logo: JeweleryCatLogo, label: "Jóias", href: "/search?categoryId=cat-joias" },
  { logo: EletronicsCatLogo, label: "Eletrônicos", href: "/search?categoryId=cat-eletronicos" },
];
