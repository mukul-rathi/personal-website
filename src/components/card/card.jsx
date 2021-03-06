import React from "react";
import classNames from "classnames";
import Img from "gatsby-image";
import SocialButton from "./social-button";
import LinkButton from "../blog-post/link-button";
import styles from "../../../css/card.module.scss";

const Card = props => {
  // display social/link button only if defined

  const {
    img,
    category,
    date,
    title,
    description,
    link1,
    link2,
    socialButton,
    className
  } = props;

  return (
    <section className={classNames(styles.card, className)}>
      <Img fluid={img.fluid} className={styles.mainImage} />

      <div className={styles.metaData}>
        <h4 className={styles.category}>{category}</h4>
        <h4 className={styles.date}>{date}</h4>
      </div>

      <h3 className={styles.title}>{title} </h3>

      <div className={styles.description}> {description}</div>

      <nav className={styles.linkButtons}>
        {link1 && <LinkButton href={link1.href}>{link1.text}</LinkButton>}
        {link2 && <LinkButton href={link2.href}>{link2.text}</LinkButton>}
      </nav>

      {socialButton && (
        <div className={styles.socialButtonDiv}>
          <SocialButton
            img={socialButton.img}
            href={socialButton.href}
            className={styles.socialButton}
          />
        </div>
      )}
    </section>
  );
};

export default Card;
