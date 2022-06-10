/**
 * @type {import("mocha").MochaInstanceOptions}
 */
const mochaConfig = {
  require: [
    'jsdom-global/register',
    './.mocha/setup.js',
  ],
  recursive: true,
}

module.exports = mochaConfig;
