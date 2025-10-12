/* config-overrides.js */

const postcssFlexbugsFixes = require('postcss-flexbugs-fixes');

module.exports = function override(config, env) {
  // Add styled-jsx babel plugin
  config.module.rules.forEach(rule => {
    if (rule.oneOf) {
      rule.oneOf.forEach(oneOfRule => {
        if (oneOfRule.loader && oneOfRule.loader.includes('babel-loader')) {
          oneOfRule.options.plugins = oneOfRule.options.plugins || [];
          oneOfRule.options.plugins.push('styled-jsx/babel');
        }
        if (oneOfRule.loader && oneOfRule.loader.includes('postcss-loader')) {
          oneOfRule.options.plugins = oneOfRule.options.plugins || [];
          oneOfRule.options.plugins.push(postcssFlexbugsFixes);
        }
      });
    }
  });

  return config;
}