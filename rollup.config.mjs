// rollup.config.mjs (Updated clearly)
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import terser from "@rollup/plugin-terser";
import postcss from "rollup-plugin-postcss";
import dts from "rollup-plugin-dts";
import url from "@rollup/plugin-url";

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.cjs.js",
        format: "cjs",
        sourcemap: true,
      },
      {
        file: "dist/index.esm.js",
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(), // explicitly avoids bundling peerDependencies
      resolve({
        extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
        browser: true,
        preferBuiltins: false,
      }),
      json({ compact: true }),
      commonjs(),
      postcss({
        extensions: ['.css'],
        inject: true,
        extract: false,
        minimize: true,
      }),
      url({
        include: ['**/*.otf', '**/*.ttf', '**/*.woff', '**/*.woff2'],
        limit: Infinity, // Bundle all fonts regardless of size
        fileName: '[dirname][name][extname]',
      }),
      typescript({ tsconfig: "./tsconfig.json" }),
    ],
    external: ["react", "react-dom", "react/jsx-runtime"], // clearly externalize React
  },

  // Types bundle
  {
    input: "dist/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    plugins: [dts()],
    external: [/\.css$/, "react", "react-dom"],
  },
];
