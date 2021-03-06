const {createFilePath} = require(`gatsby-source-filesystem`);
const path = require(`path`);

// uses Gatsby createNodeField API
exports.onCreateNode = ({node, getNode, actions}) => {
  const {createNodeField} = actions;
  if (node.internal.type === `Mdx`) {
    // create URL slug for all MDX blog posts
    const slug = createFilePath({node, getNode, basePath: `pages`});
    // graphQL mutation query - adds slug field to node
    createNodeField({node, name: `slug`, value: slug});
  }
};

// Gatsby createPages API
exports.createPages = ({graphql, actions}) => {
  const {createPage, createRedirect} = actions;

  return new Promise(resolve => {
    // first query the data using graphQL

    // we sort the files in terms of date published
    // we  return the slug and the title
    graphql(`
      {
        allMdx(sort: { fields: [frontmatter___datePublished], order: ASC }) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
                include_KaTeX
                redirect_from
                series
                part
              }
            }
          }
        }
      }
    `).then(result => {
      // for each MDX file, create a corresponding page using the blog-post
      // template
      const posts = result.data.allMdx.edges;

      posts.forEach(({node}, index) => {
        createPage({
          path: node.fields.slug,
          component: path.resolve(`./src/templates/blog-post.jsx`),
          context: {
            // Data passed to context is available
            // in page queries as GraphQL variables.
            slug: node.fields.slug,
            // prev and next are the previous and next posts
            // we queried their title to use in the prev/next buttons in hte
            // blog post template
            prevPost: index === 0 ? null : posts[index - 1].node,
            nextPost: index === posts.length - 1 ? null : posts[index + 1].node,
            // if part of a series then store the nodes in the same series
            seriesPosts: node.frontmatter.series ?
                posts.filter(
                    post => post.node.frontmatter.series ==
                        node.frontmatter.series) :
                []
          }
        });
        if (node.frontmatter.include_KaTeX !== true) {
          createPage({
            path: `${node.fields.slug}amp/`,
            component: path.resolve('./src/templates/blog-post.amp.jsx'),
            context: {
              slug: node.fields.slug,
              prevPost: index === 0 ? null : posts[index - 1].node,
              nextPost: index === posts.length - 1 ? null :
                                                     posts[index + 1].node,
              // if part of a series then store the nodes in the same series
              seriesPosts: node.frontmatter.series ?
                  posts.filter(
                      post => post.node.frontmatter.series ==
                          node.frontmatter.series) :
                  []
            }
          });
        }
        createRedirect({
          fromPath: String(node.frontmatter.redirect_from),
          toPath: String(node.fields.slug),
          isPermanent: true
        });
      });

      resolve();
    });
  });
};

exports.onCreateWebpackConfig = ({stage, actions, getConfig, loaders}) => {
  const config = getConfig();

  // exclude node_modules in Babel
  config.module.rules = [
    // Omit the default rule where test === '\.jsx?$'
    ...config.module.rules.filter(
        rule => String(rule.test) !== String(/\.jsx?$/)),
    // Recreate it with custom exclude filter
    {
      // Called without any arguments, `loaders.js()` will return an
      // object like:
      // {
      //   options: undefined,
      //   loader: '/path/to/node_modules/gatsby/dist/utils/babel-loader.js',
      // }
      ...loaders.js(),
      test: /\.jsx?$/,
      // Exclude all node_modules from transpilation
      exclude: modulePath => /node_modules/.test(modulePath)
    }
  ];

  // ignore order of css styling chunks
  if (stage === 'build-javascript') {
    const miniCssExtractPlugin = config.plugins.find(
        plugin => plugin.constructor.name === 'MiniCssExtractPlugin');
    if (miniCssExtractPlugin) {
      miniCssExtractPlugin.options.ignoreOrder = true;
    }
  }

  actions.replaceWebpackConfig(config);
};

exports.createSchemaCustomization = ({actions}) => {
  const {createTypes} = actions
  const typeDefs = `
    type Mdx implements Node {
      frontmatter: Frontmatter
    }
    type Frontmatter {
      title: String!
      datePublished: Date!
      dateModified: Date
      description: String!
      include_KaTeX: Boolean
      series: String
      part: Int
      tags: [String!]
      isDraft: Boolean
      redirect_from: String
      caption: String
    }
  `
  createTypes(typeDefs)
}
