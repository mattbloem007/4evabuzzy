const path = require("path");
const getBaseUrl = require("./src/utils/getBaseUrl");
const { defaultLang, langTextMap = {} } = require("./config/site");
const { createFilePath, createRemoteFileNode } = require(`gatsby-source-filesystem`);

/**
 * add fileName to node for markdown files
 */
exports.onCreateNode = async ({ node, getNode, actions, store, cache, createNodeId, _auth, }) => {
  const { createNodeField, createNode } = actions;
  let fileNode

  if (node.internal.type === `SitePage`) {
   if (node.context != undefined) {
     console.log("CONTEXT", node.context)
     if (node.context.featuredImage) {
       console.log("NODE: ", node.context.featuredImage.sourceUrl)

       try {
         fileNode = await createRemoteFileNode({
           url: node.context.featuredImage.sourceUrl,
           parentNodeId: node.id,
           store,
           cache,
           createNode,
           createNodeId,
           auth: _auth,
         })
       } catch (e) {
         console.log(e)
       }
     }
    }
  }
  if (fileNode) {
    node.localFile___NODE = fileNode.id
  }

  if (node.internal.type === "MarkdownRemark") {
    const fileName = path.basename(node.fileAbsolutePath, ".md");
    createNodeField({
      node,
      name: "fileName",
      value: fileName,
    });

    createNodeField({
      node,
      name: "directoryName",
      value: path.basename(path.dirname(node.fileAbsolutePath)),
    });
  }
};

/**
 * define nullable items
 */
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = [
    "type MarkdownRemark implements Node { frontmatter: Frontmatter }",
    `type Frontmatter {
      anchor: String
      jumpToAnchor: String
      jumpToAnchorText: String
      social: Social
      services: [Service]
      teamMember: [TeamMember]
    }`,
    `type TeamMember {
      social: Social
    }`,
    `type Service {
      iconName: String
      imageFileName: String
      header: String
      content: String
    }`,
    `
    type Social {
      twitter: String
      facebook: String
      linkedin: String
      medium: String
      github: String
    }
    `,
  ];

  createTypes(typeDefs);
};

/**
 * generate i18n top pages
 */
exports.createPages = ({ graphql, actions: { createPage } }) => {
  const topIndex = path.resolve("./src/templates/top-index.jsx");

  return new Promise((resolve, reject) => {
    resolve(
      graphql(
        `
          {
            allMarkdownRemark {
              distinct(field: fields___langKey)
            }

            wpgraphql {

              posts (first: 10000) {
                edges {
                  node {
                    id
                    slug
                    content
                    title
                    excerpt
                    featuredImage{
                      sourceUrl
                    }
                    categories {
                      edges {
                        node {
                          name
                        }
                      }
                    }

                  }
                }
              }

            pages {
              edges {
                node {
                  id
                  slug
                  content
                  title
                }
              }
            }
          }


          }
        `,
      ).then(({ errors, data }) => {
        if (errors) {
          console.log(errors);
          reject(errors);
        }

        data.allMarkdownRemark.distinct.forEach((langKey) => {
          createPage({
            path: getBaseUrl(defaultLang, langKey),
            component: topIndex,
            context: {
              langKey,
              defaultLang,
              langTextMap,
            },
          });
        });
         const blogPosts = data.wpgraphql.posts.edges;
        // const allPages = data.wpgraphql.pages.edges;
        //
        //
        //
        blogPosts.forEach(({node}) => {
          createPage({
            path: node.slug,
            component: topIndex,
            context: {
              id: node.id,
              slug: node.slug,
              featuredImage: node.featuredImage,
              langKey: "en"
            },
          });
        });
        //
        // allPages.forEach(({node}) => {
        //   createPage({
        //     path: node.slug,
        //     component: topIndex,
        //     context: {
        //       id: node.id,
        //       slug: node.slug,
        //       featuredImage: node.featuredImage,
        //       id2:  {"eq": "SitePage /" + node.slug},
        //       id3: "SitePage /" + node.slug,
        //       langKey: "en"
        //     },
        //   });
        // });

        return null;
      }),
    );
  });
};
