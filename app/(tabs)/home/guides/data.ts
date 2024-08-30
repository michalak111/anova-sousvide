import { Guide } from "@/app/(tabs)/home/guides/index";

export const guidesCollection: Guide[] = [
  // Beef - Tenderloin
  {
    id: "1",
    title: "Beef Tenderloin",
    category: ["Beef", "Tenderloin"],
    variants: [
      {
        name: "Rare",
        cookerState: {
          temperatureCelsius: "49",
          temperatureFahrenheit: "120",
          timeInMinutes: "60",
        },
      },
      {
        name: "Medium-Rare",
        cookerState: {
          temperatureCelsius: "54",
          temperatureFahrenheit: "129",
          timeInMinutes: "90",
        },
      },
      {
        name: "Medium",
        cookerState: {
          temperatureCelsius: "60",
          temperatureFahrenheit: "140",
          timeInMinutes: "120",
        },
      },
      {
        name: "Medium-Well",
        cookerState: {
          temperatureCelsius: "65",
          temperatureFahrenheit: "149",
          timeInMinutes: "120",
        },
      },
      {
        name: "Well-Done",
        cookerState: {
          temperatureCelsius: "71",
          temperatureFahrenheit: "160",
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
        cookerState: {
          temperatureCelsius: "49",
          temperatureFahrenheit: "120",
          timeInMinutes: "60",
        },
      },
      {
        name: "Medium-Rare",
        cookerState: {
          temperatureCelsius: "54",
          temperatureFahrenheit: "129",
          timeInMinutes: "90",
        },
      },
      {
        name: "Medium",
        cookerState: {
          temperatureCelsius: "60",
          temperatureFahrenheit: "140",
          timeInMinutes: "120",
        },
      },
      {
        name: "Medium-Well",
        cookerState: {
          temperatureCelsius: "65",
          temperatureFahrenheit: "149",
          timeInMinutes: "120",
        },
      },
      {
        name: "Well-Done",
        cookerState: {
          temperatureCelsius: "71",
          temperatureFahrenheit: "160",
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
        cookerState: {
          temperatureCelsius: "58",
          temperatureFahrenheit: "136",
          timeInMinutes: "90",
        },
      },
      {
        name: "Medium",
        cookerState: {
          temperatureCelsius: "63",
          temperatureFahrenheit: "145",
          timeInMinutes: "90",
        },
      },
      {
        name: "Well-Done",
        cookerState: {
          temperatureCelsius: "70",
          temperatureFahrenheit: "158",
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
        cookerState: {
          temperatureCelsius: "63",
          temperatureFahrenheit: "145",
          timeInMinutes: "120",
        },
      },
      {
        name: "Medium",
        cookerState: {
          temperatureCelsius: "66",
          temperatureFahrenheit: "151",
          timeInMinutes: "120",
        },
      },
      {
        name: "Well-Done",
        cookerState: {
          temperatureCelsius: "72",
          temperatureFahrenheit: "162",
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
        cookerState: {
          temperatureCelsius: "58",
          temperatureFahrenheit: "136",
          timeInMinutes: "90",
        },
      },
      {
        name: "Medium",
        cookerState: {
          temperatureCelsius: "60",
          temperatureFahrenheit: "140",
          timeInMinutes: "90",
        },
      },
      {
        name: "Well-Done",
        cookerState: {
          temperatureCelsius: "65",
          temperatureFahrenheit: "149",
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
        cookerState: {
          temperatureCelsius: "58",
          temperatureFahrenheit: "136",
          timeInMinutes: "60",
        },
      },
      {
        name: "Medium",
        cookerState: {
          temperatureCelsius: "60",
          temperatureFahrenheit: "140",
          timeInMinutes: "60",
        },
      },
      {
        name: "Well-Done",
        cookerState: {
          temperatureCelsius: "65",
          temperatureFahrenheit: "149",
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
        cookerState: {
          temperatureCelsius: "85",
          temperatureFahrenheit: "185",
          timeInMinutes: "15",
        },
      },
      {
        name: "Tender",
        cookerState: {
          temperatureCelsius: "90",
          temperatureFahrenheit: "194",
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
        cookerState: {
          temperatureCelsius: "85",
          temperatureFahrenheit: "185",
          timeInMinutes: "20",
        },
      },
      {
        name: "Tender",
        cookerState: {
          temperatureCelsius: "90",
          temperatureFahrenheit: "194",
          timeInMinutes: "20",
        },
      },
    ],
  },
];
