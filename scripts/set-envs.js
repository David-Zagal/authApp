const { mkdirSync, writeFileSync } = require ('fs');

require ('dotenv').config ();

const targetPath = './src/environments/environment.ts';
const envFileContent =
`export const environment = {
	baseUrl: "${ process.env['BASE_URL'] }",
	otra: "Las que hagan falta",
};`;

mkdirSync ('./src/environments', { recursive: true });
writeFileSync (targetPath, envFileContent);