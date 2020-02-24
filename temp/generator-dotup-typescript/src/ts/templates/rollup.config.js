import pkg from "./package.json";
// import typescript from "@rollup/plugin-typescript";
import typescript from "rollup-plugin-typescript2";
import sass from "rollup-plugin-sass";
import commonjs from "@rollup/plugin-commonjs";
import external from "rollup-plugin-peer-deps-external";
import nodeResolve from "@rollup/plugin-node-resolve";

export const getConfig = (pkg, browserName, tsconfig, input) => {
  input = input === undefined ? "src/index.ts" : input;
  tsconfig = tsconfig === undefined ? "tsconfig.json" : tsconfig;
  return [
    {
      input: input,
      output: [
        {
          file: pkg.main,
          format: "cjs",
          exports: "named",
          sourcemap: true
        },
        {
          file: pkg.module,
          format: "es",
          exports: "named",
          sourcemap: true
        },
        {
          name: browserName,
          file: pkg.browser,
          format: "umd"
        }
      ],
      plugins: [
        external(),
        nodeResolve({
          browser: true
        }),
        typescript({
          tsconfig: tsconfig,
          exclude: [
            "spec",
            "**/node_modules",
            "src/**/*.spec.ts",
            "src/**/*.test.ts",
            "src/**/__tests__/**",
            "src/**/__specs__/**"
          ]
        }),
        commonjs({
          include: ["node_modules/**"],
          exclude: ["**/*.stories.js"],
          namedExports: {
            "node_modules/react/react.js": [
              "Children",
              "Component",
              "PropTypes",
              "createElement"
            ],
            "node_modules/react-dom/index.js": ["render"]
          }
        }),
        sass({
          insert: true
        })
      ]
    }
  ];
};

export default getConfig(pkg, "dotup", "tsconfig.esnext.json");
