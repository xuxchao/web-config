import { writeFileSync } from "fs";
import { getPackage } from "../utils/dealPackage";
import { debugInfo } from "../utils/debug";
import { packageConsole } from "../utils/index";

const devDependencies = {
  prettier: "^2.7.1",
};
const scripts = {
  "prettier:fix": "prettier --write src/**",
};

/** 生成 prettier 配置文件 */
function generatePrettier() {
  let text = {
    semi: true,
    tabWidth: 2,
    jsxSingleQuote: false,
    singleQuote: false,
    arrowParens: "always",
    bracketSpacing: true,
    endOfLine: "lf",
  };
  writeFileSync(`${process.cwd()}/.prettierrc`, JSON.stringify(text, null, 2));
  writeFileSync(
    `${process.cwd()}/.prettierignore`,
    `
**/*.svg
package.json
.umi
.umi-production
/dist
/build
/public
.gitignore
.prettierignore
.eslintignore
.stylelintignore
.dockerignore
.editorconfig
Dockerfile*
LICENSE
.eslintcache
.DS_Store
yarn.lock
package-lock.json
yarn-error.log
.history
CNAME
    `
  );
}

/** 给 package.json 添加依赖 */
function packageAddDep() {
  const packageJson = getPackage();
  packageJson.devDependencies = {
    ...devDependencies,
    ...packageJson.devDependencies,
  };
  writeFileSync(
    `${process.cwd()}/package.json`,
    JSON.stringify(packageJson, null, 2)
  );
}

/** 给 package.json 添加修复命令 */
function packageAddScript() {
  const packageJson = getPackage();
  packageJson.scripts = {
    ...packageJson.scripts,
    ...scripts,
  };
  writeFileSync(
    `${process.cwd()}/package.json`,
    JSON.stringify(packageJson, null, 2)
  );
}

/** 所有配置 */
export function prettierAllConfig() {
  generatePrettier();
  packageAddDep();
  packageAddScript();
  packageConsole(devDependencies);
  packageConsole(scripts, ":");
}
