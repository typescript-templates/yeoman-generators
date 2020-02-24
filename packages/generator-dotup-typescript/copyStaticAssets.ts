import * as shell from "shelljs";

// shell.cp("-R", "src/public/js/lib", "dist/public/js/");
// shell.cp("-R", "src/public/fonts", "dist/public/");
// shell.cp("-R", "src/public/images", "dist/public/");

shell.mkdir("generators");
shell.mkdir("generators/templates");
const sourcePath = [
  `src/ts/templates/**`,
  `src/ts-app/templates/**`,
  `src/ts-lib/templates/**`,
];
const targetPath = `generators/templates/`;

for (const iterator of sourcePath) {
  shell.cp("-R", iterator, targetPath);
}

//console.log(config);


// const x = [1, 2];
// const r = x.find(item => item === 1);
// console.log(r);
