module.exports = {
  // This will check TypeScript, JavaScript and TypeScript React files
  "**/*.(js|ts|tsx)": () => "npx tsc --noEmit",

  // This will lint and format TypeScript, JavaScript and TypeScript React files
  "**/*.(js|ts|tsx)": (filenames) => [
    `npx eslint --fix ${filenames.join(" ")}`,
    `npx prettier --write ${filenames.join(" ")}`,
  ],

  // This will format JSON, Markdown, and other files
  "**/*.(json|md)": (filenames) =>
    `npx prettier --write ${filenames.join(" ")}`,
};
