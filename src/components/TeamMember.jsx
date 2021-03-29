import React from "react";
import PropTypes from "prop-types";
import Img from "gatsby-image";
import Image from "components/Image";
import * as SocialIcons from "components/SocialIcons";

import "./TeamMember.scss";

const TeamMember = ({
  imageFileName,
  imageAlt,
  header,
  subheader,
  social: { twitter, facebook, linkedin, github, medium },
  img
}) => {
  const twitterPart = twitter ? <SocialIcons.Twitter userName={twitter} /> : null;
  const facebookPart = facebook ? <SocialIcons.Facebook userName={facebook} /> : null;
  const linkedinPart = linkedin ? <SocialIcons.Linkedin userName={linkedin} /> : null;
  const githubPart = github ? <SocialIcons.Github userName={github} /> : null;
  const mediumPart = medium ? <SocialIcons.Medium userName={medium} /> : null;

  return (
    <div className="team-member">
      <Img
        className="mx-auto circle rounded-circle"
        fluid={img.fluid}
      />
      <h4>{header}</h4>
      <p className="text-muted" dangerouslySetInnerHTML={{
          __html: subheader
      }} />

    </div>
  );
};

TeamMember.propTypes = {
  imageFileName: PropTypes.string.isRequired,
  imageAlt: PropTypes.string,
  header: PropTypes.string,
  subheader: PropTypes.string,
  img: PropTypes.any,
  social: PropTypes.shape({
    twitter: PropTypes.string,
    facebook: PropTypes.string,
    linkedin: PropTypes.string,
    github: PropTypes.string,
    medium: PropTypes.string,
  }),
};

TeamMember.defaultProps = {
  imageAlt: null,
  header: "",
  subheader: "",
  img: null,
  social: {
    twitter: null,
    facebook: null,
    linkedin: null,
    github: null,
    medium: null,
  },
};

export default TeamMember;

// <div>
//   {twitterPart}
//   {facebookPart}
//   {linkedinPart}
//   {githubPart}
//   {mediumPart}
// </div>
