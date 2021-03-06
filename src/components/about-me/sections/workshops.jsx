import React from "react";
import { StaticQuery, graphql } from "gatsby";
import GridCards from "../../card/grid-cards";
import styles from "../../../../css/section.module.scss";

const Workshops = () => {
  return (
    <StaticQuery
      query={graphql`
        {
          allFile(filter: { relativePath: { glob: "workshops/*" } }) {
            edges {
              node {
                name
                childImageSharp {
                  fluid(maxWidth: 1000) {
                    ...GatsbyImageSharpFluid
                  }
                }
              }
            }
          }
        }
      `}
      render={data => {
        const findImage = name => {
          const images = data.allFile.edges;
          const correctImg = images.find(img => img.node.name === name);
          return correctImg.node.childImageSharp.fluid;
        };
        const workshops = {
          IntroDeepLearn1: {
            title: "Intro to Neural Networks",
            img: {
              fluid: findImage("deep-learn-1"),
              alt: "Workshop Banner"
            },
            date: "November 2018",
            category: "Deep Learning",
            link1: {
              href: "https://hackersatcambridge.com/workshops/deep-learning",
              text: "View Workshop Material"
            },
            link2: {
              href:
                "https://github.com/hackersatcambridge/workshop-deep-learning",
              text: "GitHub Repo"
            },
            socialButton: {
              href: "https://www.youtube.com/watch?v=84iCkb7hqKs",
              img: "youtube"
            },
            description:
              "An Introduction to Neural Networks and how they learn."
          },
          IntroDeepLearn2: {
            title: "Convolutional Neural Networks",
            img: {
              fluid: findImage("deep-learn-2"),
              alt: "Workshop Banner"
            },
            date: "November 2018",
            category: "Deep Learning",
            link1: {
              href: "https://hackersatcambridge.com/workshops/deep-learning",
              text: "View Workshop Material"
            },
            link2: {
              href:
                "https://github.com/hackersatcambridge/workshop-deep-learning",
              text: "GitHub Repo"
            },
            socialButton: {
              href: "https://www.youtube.com/watch?v=bqPfxwrCBUk",
              img: "youtube"
            },
            description: "Deep learning for Computer Vision"
          },
          IntroDeepLearn3: {
            title: "Recurrent Neural Networks",
            img: {
              fluid: findImage("deep-learn-3"),
              alt: "Workshop Banner"
            },
            date: "February 2019",
            category: "Deep Learning",
            link1: {
              href: "https://hackersatcambridge.com/workshops/deep-learning",
              text: "View Workshop Material"
            },
            link2: {
              href:
                "https://github.com/hackersatcambridge/workshop-deep-learning",
              text: "GitHub Repo"
            },
            socialButton: {
              href: "https://www.youtube.com/watch?v=QQs-9VwnyOk",
              img: "youtube"
            },
            description: "Deep learning for Natural Language Processing"
          }
        };
        return (
          <section className={styles.section}>
            <h2>Workshops</h2>
            {<GridCards {...workshops} />}
          </section>
        );
      }}
    />
  );
};

export default Workshops;
