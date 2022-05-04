const config = {
  preset: "eslint",
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        releaseRules: [
          { tag: "MINOR", release: "minor" },
          { tag: "PATCH", release: "patch" },
          { tag: "MAJOR", release: "major" },
        ],
        parserOpts: {
          headerPattern: /^(MINOR|PATCH|MAJOR): (.*)$/,
          headerCorrespondence: ["tag", "subject"],
        },
      },
    ],
    "@semantic-release/release-notes-generator",
    // "@semantic-release/npm",
    // [
    //   "@semantic-release/github",
    //   {
    //     assets: "release/*.tgz",
    //   },
    // ],
    "@semantic-release/git",
  ],
  branches: [
    "main",
    {
      name: "release/[0-9]+(.[0-9]+)?.(x|X)",
      channel: '${name.replace(/^release\\//g, "")}',
      range: '${name.replace(/^release\\//g, "")}',
    },
    {
      name: "develop",
      channel: "next",
      prerelease: "rc",
    },
  ],
};

const branch = process.env.GITHUB_REF.split("/").pop();

if (branch === "main") {
  config.plugins.splice(2, 0, "@semantic-release/changelog");
}

module.exports = config;
