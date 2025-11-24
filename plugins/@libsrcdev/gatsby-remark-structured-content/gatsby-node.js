exports.onPreInit = () => {};

exports.sourceNodes = require(`./source-nodes`);

exports.onCreateNode = require(`./on-create-node`);

exports.createSchemaCustomization = require(`./create-schema-customization`);

exports.pluginOptionsSchema = require(`./plugin-options-schema`);
