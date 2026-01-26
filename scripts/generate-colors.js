import fs from "fs";
import path from "path";

const inputPath = "./material-theme.json";
const outputPath = "../theme/colors.generated.ts";

const STEP_MAP = {
    0: "98",
    50: "95",
    100: "90",
    200: "80",
    300: "70",
    400: "60",
    500: "50",
    600: "40",
    700: "35",
    800: "30",
    900: "25",
    950: "20", // fallback to "100" if missing
  };

const data = JSON.parse(fs.readFileSync(inputPath, "utf8"));

/* ---------------------------------- */
/* Helpers                            */
/* ---------------------------------- */

const kebab = (s) =>
  s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);

const pickTone = (palette, tone) => {
  if (palette[tone]) return palette[tone];
  if (tone === "95") return palette["100"];
  if (tone === "5") return palette["0"];
  return undefined;
};

/* ---------------------------------- */
/* Colors (direct reference)          */
/* ---------------------------------- */

const Colors = {
  scheme: {
    light: { ...data.schemes.light },
    dark: { ...data.schemes.dark },
  },
};

/* ---------------------------------- */
/* ColorVariables (CSS vars)          */
/* ---------------------------------- */

const ColorVariables = {
  light: {},
  dark: {},
};

// schemes → CSS vars
for (const mode of ["light", "dark"]) {
  for (const [key, hex] of Object.entries(data.schemes[mode])) {
    ColorVariables[mode][`--color-${kebab(key)}`] = hex;
  }
}

// palettes → CSS vars (only once, same for light/dark)
for (const [paletteName, tones] of Object.entries(data.palettes)) {
  for (const [twStep, materialTone] of Object.entries(STEP_MAP)) {
    const hex = pickTone(tones, materialTone);
    if (!hex) continue;

    const varName = `--color-${kebab(paletteName)}-${twStep}`;
    ColorVariables.light[varName] = hex;
    ColorVariables.dark[varName] = hex;
  }
}

/* ---------------------------------- */
/* Emit                               */
/* ---------------------------------- */

const output = `// AUTO-GENERATED — DO NOT EDIT

export const Colors = ${JSON.stringify(Colors, null, 2)};

export const ColorVariables = ${JSON.stringify(ColorVariables, null, 2)};
`;

fs.writeFileSync(outputPath, output);
console.log("✅ tokens generated →", outputPath);
