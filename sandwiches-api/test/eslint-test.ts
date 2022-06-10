/**
 * Eslint-tests all source and test files.
 */
// dependencies only needed when running tests:
/* eslint-disable import/no-extraneous-dependencies */
import glob from 'glob';
import { CLIEngine, ESLint, Linter } from 'eslint';
import { assert } from 'chai';

const paths = glob.sync('./+(app|test)/**/*.ts');
const engine = new CLIEngine({
  envs: ['node', 'mocha'],
  useEslintrc: true,
});

const { results } = engine.executeOnFiles(paths);

function formatMessages(messages: Linter.LintMessage[]) {
  const errors = messages.map(
    message => (
      `${message.line}:${message.column} ${message.message.slice(0, -1)} - ${message.ruleId}\n`
    )
  );

  return `\n${errors.join('')}`;
}
function generateTest(result: ESLint.LintResult) {
  const { filePath, messages } = result;

  it(`validates ${filePath}`, () => {
    if (messages.length > 0) {
      assert.fail(false, true, formatMessages(messages));
    }
  });
}

describe('ESLint', () => {
  results.forEach(result => generateTest(result));
});

export { };
