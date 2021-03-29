import React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";

import Navbar from "views/Navbar";
import Top from "views/Top";
import Footer from "views/Footer";
import * as Sections from "views/Sections";
import SEO from "components/SEO";
import LanguageSelector from "components/LanguageSelector";

import "utils/fixFontAwesome";
import breakDownAllNodes from "utils/breakDownAllNodes";
import fileNameToSectionName from "utils/fileNameToSectionName";

import "../style/main.scss";

/**
 * get file name list from content/sections folder
 */
export const query = graphql`
  query IndexQuery($langKey: String!) {
    site {
      siteMetadata {
        keywords
        description
      }
    }
    allMarkdownRemark(
      filter: { fields: { langKey: { eq: $langKey } } }
      sort: { order: ASC, fields: [fields___directoryName, fields___fileName] }
    ) {
      nodes {
        frontmatter {
          brand
          anchor
          clients {
            href
            imageFileName
          }
          content
          copyright
          header
          email
          imageFileName
          jumpToAnchor
          jumpToAnchorText
          menuText
          portfolios {
            content
            extraInfo
            header
            subheader
            imageFileNameDetail
            imageFileName
          }
          privacyHref
          privacyText
          services {
            content
            header
            iconName
            imageFileName
          }
          social {
            facebook
            github
            linkedin
            medium
            twitter
          }
          subheader
          teamMember {
            header
            imageFileName
            social {
              facebook
              github
              linkedin
              medium
              twitter
            }
            subheader
          }
          telephone
          termsHref
          termsText
          title
          timeline {
            content
            header
            imageContent
            imageFileName
            subheader
          }
        }
        fields {
          fileName
          directoryName
        }
      }
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
          tags {
            nodes {
              name
            }
          }
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

  allFile {
    edges {
      node {
        name
        parent {
          id
        }
        childImageSharp {
          fluid (maxWidth: 200, maxHeight: 200){
            srcSet
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  }

  }
`;

const IndexPage = ({ data, pathContext: { langKey, defaultLang, langTextMap } }) => {


  const {
    site: {
      siteMetadata: { keywords, description },
    },
    allMarkdownRemark: { nodes },
    wpgraphql: {
      posts: { edges }
    }
  } = data;
  const { topNode, navBarNode, anchors, footerNode, sectionsNodes } = breakDownAllNodes(nodes);

  console.log("data: ", sectionsNodes)
  console.log("posts: ", edges)
  const cont = []
  const titles = [];
  const files = [];

  edges.forEach((node, i) => {
    console.log(node, i)
    if (node.node.tags.nodes.length > 0) {
      cont.push({content: node.node.content, header: node.node.title, cat: node.node.categories.edges[0].node.name, excerpt: node.node.excerpt, telephone: node.node.tags.nodes[0].name, email: node.node.tags.nodes[1].name})
    }
    else {
      cont.push({content: node.node.content, header: node.node.title, cat: node.node.categories.edges[0].node.name, excerpt: node.node.excerpt})

    }
  })

  data.wpgraphql.pages.edges.forEach(node => {
    console.log("Pages: ", node)
    titles.push({header: node.node.title, subheader: node.node.content})
  })

  console.log("AllFIle, ", data.allFile.edges)
  let fileIndex;
  if (edges !== undefined) {
    const images = edges;
    images.forEach(function(e, i) {
        data.allFile.edges.forEach(({node}) => {
            if (node.parent) {
              console.log(node.parent.id, " ", `SitePage /` + e.node.slug)
              if (node.parent.id === `SitePage /` + e.node.slug) {
                files.push({file: node});
              }
            }
          })

    });
  }

  console.log("Files: ", files, cont)

  sectionsNodes[0].frontmatter.services.forEach((ser, i) => {
    if (sectionsNodes[0].frontmatter.anchor === cont[10].cat) {
      ser.content = cont[i+10].content
      ser.header = cont[i+10].header
      sectionsNodes[0].frontmatter.subheader = titles[3].subheader
      sectionsNodes[0].frontmatter.header = titles[3].header
    }
  })

  sectionsNodes[1].frontmatter.portfolios.forEach((ser, i) => {
    if (sectionsNodes[1].frontmatter.anchor === cont[4].cat) {
      ser.content = cont[i+4].content
      ser.header = cont[i+4].header
      ser.subheader = cont[i+4].excerpt
      ser.img = files[8-i].file.childImageSharp
      sectionsNodes[1].frontmatter.subheader = titles[2].subheader
      sectionsNodes[1].frontmatter.header = titles[2].header

    }
  })


  sectionsNodes[2].frontmatter.timeline.forEach((ser, i) => {
    if (sectionsNodes[2].frontmatter.anchor === cont[13].cat) {
      if (cont[i+13]) {
        ser.content = cont[i+13].content
        ser.header = cont[i+13].header
        ser.img = files[12-i].file.childImageSharp
        sectionsNodes[2].frontmatter.subheader = titles[1].subheader
        sectionsNodes[2].frontmatter.header = titles[1].header
      }
    }
  })

  sectionsNodes[3].frontmatter.teamMember.forEach((ser, i) => {
    if (sectionsNodes[3].frontmatter.anchor === cont[1].cat) {
      ser.subheader = cont[i+1].content
      ser.header = cont[i+1].header
      ser.img = files[2-i].file.childImageSharp
      sectionsNodes[3].frontmatter.subheader = titles[0].subheader
      sectionsNodes[3].frontmatter.header = titles[0].header
    }
  })


    if (sectionsNodes[5].frontmatter.anchor === cont[0].cat) {
      sectionsNodes[5].frontmatter.subheader = cont[0].content
      sectionsNodes[5].frontmatter.header = cont[0].header
      sectionsNodes[5].frontmatter.email = cont[0].email
      sectionsNodes[5].frontmatter.telephone = cont[0].telephone
    }


  console.log("content", sectionsNodes)

   // let langSelectorPart;
  // if (langTextMap != null && Object.keys(langTextMap).length > 1) {
  //   langSelectorPart = (
  //     <LanguageSelector langKey={langKey} defaultLang={defaultLang} langTextMap={langTextMap} />
  //   );
  // }

  return (
    <>
      <SEO lang={langKey} title="Top" keywords={keywords} description={description} />
      <Navbar
        anchors={anchors}
        frontmatter={navBarNode.frontmatter}
      />

      <Top frontmatter={topNode.frontmatter} />
      {
        // dynamically import sections
        sectionsNodes.map(({ frontmatter, fields: { fileName } }, ind) => {
          const sectionComponentName = fileNameToSectionName(fileName);
          const SectionComponent = Sections[sectionComponentName];

          return SectionComponent ? (
            <SectionComponent
              key={sectionComponentName}
              className={ind % 2 === 1 ? "bg-light" : null}
              frontmatter={frontmatter}
              postInfo={edges}
            />
          ) : null;
        })
      }
      <Footer frontmatter={footerNode.frontmatter} />
    </>
  );
};

IndexPage.propTypes = {
  data: PropTypes.object.isRequired,
  pathContext: PropTypes.object,
};

IndexPage.defaultProps = {
  pathContext: {
    langKey: "en",
    defaultLang: "en",
    langTextMap: {},
  },
};

export default IndexPage;
