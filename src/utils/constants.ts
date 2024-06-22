import { IconsPath } from "./InconsPath";

export const Fonts = {
  REGULAR: "Roboto-Regular",
  MEDIUM: "Roboto-Medium",
  BOLD: "Roboto-Bold",
  InterBold: "Inter-Bold",
};

export const ShadowStyle = {
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 3,
  },
  shadowOpacity: 0.27,
  // shadowRadius: 4.65,
  shadowRadius: 2.65,

  elevation: 6,
};
export const dashboardStatusData = [
  {
    id: 1,
    name: "All work orders",
    img: IconsPath.Openwork,
    value: "all",
  },
  {
    id: 2,
    name: "Open",
    img: IconsPath.Openwork,
    value: "Open",
  },
  {
    id: 2,
    name: "Design",
    img: IconsPath.Openwork,
    value: "Design",
  },
  {
    id: 3,
    name: "In Progress",
    img: IconsPath.Openwork,
    value: "In Progress",
  },
  {
    id: 4,
    name: "Reviewing",
    img: IconsPath.Openwork,
    value: "Reviewing",
  },
  {
    id: 5,
    name: "Closed",
    img: IconsPath.Opentasks,
    value: "Closed",
  },
];
