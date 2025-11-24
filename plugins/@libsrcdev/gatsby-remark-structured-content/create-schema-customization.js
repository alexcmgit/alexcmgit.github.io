module.exports = async function createSchemaCustomization(...args) {
  const [gatsbyNodeApis, pluginOptions] = args;

  const createTypes = gatsbyNodeApis.actions.createTypes;

  const typeDefs = `
    type MarkdownRemark implements Node {
      structuredContent: [Node!] @link(by: "parent.id", from: "id")
    }
  `;

  createTypes(typeDefs);

  const createSchemaCustomizationCallbacks = pluginOptions.transformers?.map(t => t.createSchemaCustomization).filter(Boolean);

  if (createSchemaCustomizationCallbacks) {
    for (const callback of createSchemaCustomizationCallbacks) {
      await callback(...args);
    }
  }
};
