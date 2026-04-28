import nextVitals from "eslint-config-next/core-web-vitals";

const config = [
  {
    ignores: ["WebAppBody.js", ".next/**", "node_modules/**"],
  },
  ...nextVitals,
];

export default config;
