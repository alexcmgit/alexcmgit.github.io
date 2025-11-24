const { createRemoteFileNode } = require(`gatsby-source-filesystem`);

module.exports = async function onCreateNode(...args) {
  const [
    {
      node,
      actions: { createNode, createNodeField, ...actions },
      createNodeId,
      getCache,
    },
    pluginOptions,
  ] = args;
};
