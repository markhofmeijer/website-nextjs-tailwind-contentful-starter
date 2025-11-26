import tseslint from "@typescript-eslint/eslint-plugin"
import next from "eslint-config-next"
import prettier from "eslint-config-prettier"

const config = [
  {
    ignores: ["node_modules/**", ".next/**", "out/**", "dist/**"],
  },
  ...next,
  prettier,
  {
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "react-hooks/error-boundaries": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/immutability": "off",
    },
  },
]

export default config
