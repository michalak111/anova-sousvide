import { AnovaService } from "@/services/AnovaService";

export type Guide = {
  id: string;
  title: string;
  category: string[];
  variants: {
    name: string;
    cookParams: AnovaService.CookerParms;
  }[];
};

export const guidesCollection: Guide[] = [
  // Beef - Tenderloin
  {
    id: "1",
    title: "Beef Tenderloin",
    category: ["Beef", "Tenderloin"],
    variants: [
      {
        name: "Rare",
        cookParams: {
          temperatureCelsius: "49",
          timeInMinutes: "60",
        },
      },
      {
        name: "Medium-Rare",
        cookParams: {
          temperatureCelsius: "54",
          timeInMinutes: "90",
        },
      },
      {
        name: "Medium",
        cookParams: {
          temperatureCelsius: "60",
          timeInMinutes: "120",
        },
      },
      {
        name: "Medium-Well",
        cookParams: {
          temperatureCelsius: "65",
          timeInMinutes: "120",
        },
      },
      {
        name: "Well-Done",
        cookParams: {
          temperatureCelsius: "71",
          timeInMinutes: "120",
        },
      },
    ],
  },
  // Beef - Porterhouse
  {
    id: "2",
    title: "Beef Porterhouse",
    category: ["Beef", "Porterhouse"],
    variants: [
      {
        name: "Rare",
        cookParams: {
          temperatureCelsius: "49",
          timeInMinutes: "60",
        },
      },
      {
        name: "Medium-Rare",
        cookParams: {
          temperatureCelsius: "54",
          timeInMinutes: "90",
        },
      },
      {
        name: "Medium",
        cookParams: {
          temperatureCelsius: "60",
          timeInMinutes: "120",
        },
      },
      {
        name: "Medium-Well",
        cookParams: {
          temperatureCelsius: "65",
          timeInMinutes: "120",
        },
      },
      {
        name: "Well-Done",
        cookParams: {
          temperatureCelsius: "71",
          timeInMinutes: "120",
        },
      },
    ],
  },
  // Poultry - Chicken Breast
  {
    id: "3",
    title: "Chicken Breast",
    category: ["Poultry", "Chicken"],
    variants: [
      {
        name: "Rare",
        cookParams: {
          temperatureCelsius: "58",
          timeInMinutes: "90",
        },
      },
      {
        name: "Medium",
        cookParams: {
          temperatureCelsius: "63",
          timeInMinutes: "90",
        },
      },
      {
        name: "Well-Done",
        cookParams: {
          temperatureCelsius: "70",
          timeInMinutes: "90",
        },
      },
    ],
  },
  // Poultry - Turkey Thigh
  {
    id: "4",
    title: "Turkey Thigh",
    category: ["Poultry", "Turkey"],
    variants: [
      {
        name: "Rare",
        cookParams: {
          temperatureCelsius: "63",
          timeInMinutes: "120",
        },
      },
      {
        name: "Medium",
        cookParams: {
          temperatureCelsius: "66",
          timeInMinutes: "120",
        },
      },
      {
        name: "Well-Done",
        cookParams: {
          temperatureCelsius: "72",
          timeInMinutes: "120",
        },
      },
    ],
  },
  // Pork - Pork Loin
  {
    id: "5",
    title: "Pork Loin",
    category: ["Pork"],
    variants: [
      {
        name: "Rare",
        cookParams: {
          temperatureCelsius: "58",
          timeInMinutes: "90",
        },
      },
      {
        name: "Medium",
        cookParams: {
          temperatureCelsius: "60",
          timeInMinutes: "90",
        },
      },
      {
        name: "Well-Done",
        cookParams: {
          temperatureCelsius: "65",
          timeInMinutes: "90",
        },
      },
    ],
  },
  // Pork - Pork Chop
  {
    id: "6",
    title: "Pork Chop",
    category: ["Pork"],
    variants: [
      {
        name: "Rare",
        cookParams: {
          temperatureCelsius: "58",
          timeInMinutes: "60",
        },
      },
      {
        name: "Medium",
        cookParams: {
          temperatureCelsius: "60",
          timeInMinutes: "60",
        },
      },
      {
        name: "Well-Done",
        cookParams: {
          temperatureCelsius: "65",
          timeInMinutes: "60",
        },
      },
    ],
  },
  // Vegetables - Asparagus
  {
    id: "7",
    title: "Asparagus",
    category: ["Vegetables"],
    variants: [
      {
        name: "Tender-Crisp",
        cookParams: {
          temperatureCelsius: "85",
          timeInMinutes: "15",
        },
      },
      {
        name: "Tender",
        cookParams: {
          temperatureCelsius: "90",
          timeInMinutes: "15",
        },
      },
    ],
  },
  // Vegetables - Carrots
  {
    id: "8",
    title: "Carrot",
    category: ["Vegetables"],
    variants: [
      {
        name: "Tender-Crisp",
        cookParams: {
          temperatureCelsius: "85",
          timeInMinutes: "20",
        },
      },
      {
        name: "Tender",
        cookParams: {
          temperatureCelsius: "90",
          timeInMinutes: "20",
        },
      },
    ],
  },
];
