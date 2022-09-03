/* eslint-disable no-template-curly-in-string */
module.exports = {
  branches: ['main', { name: 'develop', prerelease: true }],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'conventionalcommits',
        parserOpts: {
          noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES', 'BREAKING']
        }
      }
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'conventionalcommits',
        parserOpts: {
          noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES', 'BREAKING']
        },
        writerOpts: {
          commitsSort: ['subject', 'scope']
        }
      }
    ],
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'docs/CHANGELOG.md'
      }
    ],
    [
      '@semantic-release/git',
      {
        assets: ['docs/CHANGELOG.md', 'lerna.json', 'packages/**/package*.json'],
        message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
      }
    ],
    [ // Bump the version of all the package.json and publish non private packages to Jfrog using lerna.
      '@semantic-release/exec',
      {
        verifyReleaseCmd: 'npm run ci:version:set ${nextRelease.version}',
        publishCmd: 'npm run ci:npm:publish'
      }
    ],
    '@semantic-release/github'
  ]
}
