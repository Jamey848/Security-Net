module.exports = {
    testEnvironment: 'node',
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/database.js' // Exclude database config from coverage
    ],
    testMatch: [
        '**/tests/**/*.test.js'
    ],
    verbose: true
};
