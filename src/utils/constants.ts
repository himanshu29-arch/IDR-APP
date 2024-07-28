import { IconsPath } from "./InconsPath";
import { hp, wp } from "./resDimensions";

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
export const StatusData = [
  { label: "Open", value: "Open" },
  { label: "Design", value: "Design" },
  { label: "In Progress", value: "In Progress" },
  { label: "Reviewing", value: "Reviewing" },
  { label: "Closed", value: "Closed" },
];

export const bottomSheetStyles = {
  wrapper: {
    backgroundColor: "transparent",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4.65,
    elevation: 6,
  },

  draggableIcon: {
    marginTop: hp(3),
    width: wp(15),
    backgroundColor: "rgba(236, 236, 236, 1)",
  },
};
