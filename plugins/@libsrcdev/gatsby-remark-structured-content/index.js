const { createRemoteFileNode } = require("gatsby-source-filesystem")

const unistUtilVisit = require("unist-util-visit")

const { visit } = unistUtilVisit

function createImageExtractorTransformer() {
  return {
    createSchemaCustomization: function ({ actions }) {
      const { createTypes } = actions;
      const typeDefs = `
        type MarkdownRemark implements Node {
          embeddedImages: [File!] @link(by: "parent.id", from: "id")
        }
      `;
      createTypes(typeDefs);
    },
    traverse: function (markdownAST, { visit }, context) {
      getAllImagesFromMarkdownAST(markdownAST).forEach(context.scheduleTransformOf)
    },
    transform: async function ({ node, index, parent }, { saveNodeToFile, removeNodeFromMdAST }) {
      await saveNodeToFile(node, { transformer: true })
    }
  }
}

exports.createImageExtractorTransformer = createImageExtractorTransformer

function createThumbnailImageTransformer() {
  return {
    createSchemaCustomization: function ({ actions }) {
      const { createTypes } = actions;
      const typeDefs = `
        type MarkdownRemark implements Node {
          thumbnailImage: File @link(by: "parent.id", from: "id")
        }
      `;
      createTypes(typeDefs);
    },
    traverse: function (markdownAST, { visit }, context) {
      const thumbImgNode = getThumbnailImageOnly(markdownAST)

      if (thumbImgNode) {
        context.scheduleTransformOf({ node: thumbImgNode })
      }
    },
    transform: async function ({ node, index, parent }, { saveNodeToFile, removeNodeFromMdAST }) {
      await saveNodeToFile(node, { isThumbnail: true })
      await removeNodeFromMdAST(node)
    }
  }
}

exports.createThumbnailImageTransformer = createThumbnailImageTransformer

module.exports = async (remarkPluginAPI, pluginOptions) => {
  const {
    markdownAST,
    markdownNode,
    getCache,
    actions,
    createNodeId,
    ...rest
  } = remarkPluginAPI

  const { createNode, createNodeField } = actions

  const { transformers } = pluginOptions

  async function saveNodeToFile(node, extraFields) {
    const fileNode = await createRemoteFileNode({
      url: node.url,
      parentNodeId: markdownNode.id,
      getCache,
      createNode,
      createNodeId,
    })

    for (const [key, value] of Object.entries(extraFields || {})) {
      await createNodeField({ node: fileNode, name: key, value: value })
    }

    return fileNode
  }


  for (const transformer of transformers) {
    const context = {
      collected: [],
      scheduleTransformOf: function (data) {
        this.collected.push(data)
      },
    }

    transformerInstance.traverse(markdownAST, unistUtilVisit, context)

    for (const collectedItem of context.collected) {
      await transformer.transform(collectedItem, { saveNodeToFile, removeNodeFromMdAST }, remarkPluginAPI)
    }
  }

  return markdownAST
}

function getAllImagesFromMarkdownAST(markdownAST) {
  const images = []
  visit(markdownAST, "image", images.push)
  return images
}

/// Return an image node only if there is no text content before the image
/// Or if the content after the image is only whitespace
function getThumbnailImageOnly(markdownAST) {
  let thumbnailImage = null

  visit(markdownAST, "image", (node, index, parent) => {
    const nodesBefore = parent.children.slice(0, index)
    const nodesAfter = parent.children.slice(index + 1)

    const hasTextBefore = nodesBefore.some(
      (n) => n.type === "text" && n.value.trim().length > 0
    )
    const hasTextAfter = nodesAfter.some(
      (n) => n.type === "text" && n.value.trim().length > 0
    )

    if (!hasTextBefore && !hasTextAfter) {
      thumbnailImage = node
    }

    return [EXIT]
  })

  return thumbnailImage
}
/// Return an image node only if there is no text content before the image
/// Or if the content after the image is only whitespace
function visitAllImages(markdownAST, visitor) {
  visit(markdownAST, "image", (node, index, parent) => {
    return visitor(node, index, parent)
  })

  return thumbnailImage
}

async function removeNodeFromMdAST(node) {
  node.type = `html`
  node.children = []
  node.value = ``
}
