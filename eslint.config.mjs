import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import stylistic from "@stylistic/eslint-plugin";
import react from "eslint-plugin-react";
import { dirname } from 'path';
import tseslint from "typescript-eslint";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
   baseDirectory: __dirname,
});


export default tseslint.config(
   ...tseslint.configs.recommended,
   js.configs.recommended,
   ...compat.extends('next/core-web-vitals', 'next/typescript'),
   {
      "plugins": {
         react: react,
         "@stylistic": stylistic,
      },
      languageOptions: {
         parser: tseslint.parser,
         parserOptions: {
            project: true,
         }
      },
      ignores: ["eslint.config.mjs", "app/generated/prisma/**"],
      rules: {
         "@stylistic/no-trailing-spaces": "error"
      }
   }
);
