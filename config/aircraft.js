const Aircraft = require("../models/Aircraft");
const { isEmptyOrNull } = require("../helpers/validation");

const aircraftToSeed = [
  {
    name: "F/A-18C",
    bvrCapable: true,
    carrierOpsCapable: true,
    agCapable: true,
  },
  {
    name: "F-16",
    bvrCapable: true,
    carrierOpsCapable: false,
    agCapable: true,
  },
  {
    name: "F-15C",
    bvrCapable: true,
    carrierOpsCapable: false,
    agCapable: false,
  },
  {
    name: "A/V-8B",
    bvrCapable: false,
    carrierOpsCapable: true,
    agCapable: true,
  },
  {
    name: "F-14",
    bvrCapable: true,
    carrierOpsCapable: true,
    agCapable: true,
  },
  {
    name: "A-10",
    bvrCapable: false,
    carrierOpsCapable: false,
    agCapable: true,
  },
  {
    name: "F-86",
    bvrCapable: false,
    carrierOpsCapable: false,
    agCapable: true,
  },
  {
    name: "MiG-29",
    bvrCapable: true,
    carrierOpsCapable: false,
    agCapable: true,
  },
  {
    name: "Su-27 or J-11",
    bvrCapable: true,
    carrierOpsCapable: false,
    agCapable: true,
  },
  {
    name: "Su-33",
    bvrCapable: true,
    carrierOpsCapable: true,
    agCapable: true,
  },
  {
    name: "MiG-15",
    bvrCapable: false,
    carrierOpsCapable: false,
    agCapable: true,
  },
  {
    name: "MiG-21",
    bvrCapable: true,
    carrierOpsCapable: false,
    agCapable: true,
  },
  {
    name: "MiG-19",
    bvrCapable: false,
    carrierOpsCapable: false,
    agCapable: true,
  },
  {
    name: "Mirage 2000",
    bvrCapable: true,
    carrierOpsCapable: false,
    agCapable: true,
  },
  {
    name: "Ka-50",
    bvrCapable: false,
    carrierOpsCapable: false,
    agCapable: true,
  },
  {
    name: "Huey",
    bvrCapable: false,
    carrierOpsCapable: false,
    agCapable: true,
  },
  {
    name: "Gazelle",
    bvrCapable: false,
    carrierOpsCapable: false,
    agCapable: true,
  },
  {
    name: "L-39",
    bvrCapable: false,
    carrierOpsCapable: false,
    agCapable: true,
  },
  {
    name: "C-101",
    bvrCapable: false,
    carrierOpsCapable: false,
    agCapable: true,
  },
  {
    name: "F-5",
    bvrCapable: false,
    carrierOpsCapable: false,
    agCapable: true,
  },
  {
    name: "Su-25(T)",
    bvrCapable: false,
    carrierOpsCapable: false,
    agCapable: true,
  },
  {
    name: "Mi-8",
    bvrCapable: false,
    carrierOpsCapable: false,
    agCapable: true,
  },
  {
    name: "JF-17",
    bvrCapable: true,
    carrierOpsCapable: false,
    agCapable: true,
  },
  {
    name: "Viggen",
    bvrCapable: false,
    carrierOpsCapable: false,
    agCapable: true,
  },
];

const seedAircraft = async () => {
  try {
    await Aircraft.create(aircraftToSeed);
  } catch (err) {
    console.warn(`Failed to seed aircraft: ${err}`);
  }
};

module.exports = seedAircraft;
