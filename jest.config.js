module.exports = {
  roots: ['src'],
  globals: {
    "ts-jest": {
      packageJson: 'package.json',
      tsConfig: "tsconfig.json"
    }
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'node'],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  testMatch: [
    "**/*.(test|spec).(ts|js)",
    "**/(test|spec)/**/*.(test|spec).(ts|js)"
  ],
  testEnvironment: "node"
};