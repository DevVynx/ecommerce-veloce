import {
  Flame,
  HandbagIcon,
  HeartIcon,
  PackageSearch,
  Settings,
  ShoppingCartIcon,
  UserIcon,
} from "lucide-react";

export const sideMenuStoreActionIcons = [
  {
    icon: <PackageSearch className="size-7" />,
    label: "Categorias",
    link: "#categoriesSection",
  },
  {
    icon: <Flame className="size-7 stroke-red-500" />,
    className: "text-red-500",
    label: "Melhores Ofertas",
    link: "#bestOffersSection",
  },
];

export const sideMenuPersonalActionIcons = [
  {
    icon: <UserIcon className="size-7" />,
    label: "Meu Perfil",
    link: "/account?tab=profile",
  },
  {
    icon: <HandbagIcon className="size-7" />,
    label: "Seus Pedidos",
    link: "/account?tab=orders",
  },
  {
    icon: <HeartIcon className="size-7" />,
    label: "Lista de Desejos",
    link: "/wishlist",
  },
  {
    icon: <ShoppingCartIcon className="size-7" />,
    label: "Seu Carrinho",
    link: "/cart",
  },
  {
    icon: <Settings className="size-7" />,
    label: "Configurações",
    link: "/account?tab=settings",
  },
];
