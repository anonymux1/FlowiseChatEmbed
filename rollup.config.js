import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import { babel } from "@rollup/plugin-babel";
import postcss from "rollup-plugin-postcss";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import typescript from "@rollup/plugin-typescript";
import { typescriptPaths } from "rollup-plugin-typescript-paths";
import commonjs from "@rollup/plugin-commonjs";
import { uglify } from "rollup-plugin-uglify";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import html from "@rollup/plugin-html";
//import copy from 'rollup-plugin-copy';

const extensions = [".ts", ".tsx"];

const indexConfig = {
  plugins: [
    resolve({ extensions, browser: true }),
    commonjs(),
    uglify(),
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**",
      presets: ["solid", "@babel/preset-typescript"],
      extensions,
    }),
    postcss({
      plugins: [autoprefixer(), tailwindcss()],
      extract: false,
      modules: false,
      autoModules: false,
      minimize: true,
      inject: false,
    }),
    typescript(),
    typescriptPaths({ preserveExtensions: true }),
    terser({ output: { comments: false } }),
    
    // Add the html plugin configuration here
    html({
      title: "Your Application",
      fileName: "index.html",
      template: ({ attributes, files, meta, title }) => {
        return `
          <!DOCTYPE html>
          <html ${attributes}>
            <head>
              <meta charset="utf-8">
              <title>${title}</title>
              ${meta}
            </head>
            <body>
            <div id="app"></div>
            ${files.js.map((file) => `<script src="${file}"></script>`).join("")}
            <script type="module">
            import Chatbot from "./web.js";
            Chatbot.init({
              chatflowid: "80dde17d-aa68-4816-8750-0ac1d90682ba",
              apiHost: "https://butterbot-ml2y.onrender.com",
              chatflowConfig: {
                pineconeNamespace: "FlowiseChat Modify",
              },
              theme: {
                "chatWindow": {
                  "height": "2800",
                  "width": "1200"
                }
               }
              })
          </script></body>
          </html>
        `;
      },
    }),

    // If you want to see the live app
    serve({
      open: true,
      verbose: true,
      contentBase: ["dist"],
      host: "localhost",
      port: 5678,
    }),
    livereload({ watch: "dist" }),
  ],
};

const configs = [
  {
    ...indexConfig,
    input: "./src/web.ts",
    output: {
      file: "dist/web.js",
      format: "es",
    },
  },
];

export default configs;