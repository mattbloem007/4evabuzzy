import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import Img from "gatsby-image";
import Image from "components/Image";

import "./TimelineItem.scss";

const TimelineItem = ({
  invert,
  imageFileName,
  imageAlt,
  imageContent,
  header,
  subheader,
  content,
  img,
}) => {
  const headerPart = header ? <h4>{header}</h4> : null;
  const subheaderPart = subheader ? <h4 className="subheading"dangerouslySetInnerHTML={{
      __html: subheader
  }} /> : null;

  let isImage = false
  if (img) {
    isImage = true
  }

  const liClassName = clsx("timeline-item", { "timeline-inverted": invert });

  return (
    <li className={liClassName}>
      <div className="timeline-image">
        {imageContent || (
          <Img
            className="rounded-circle img-fluid"
            fluid={img.fluid}
          />
        )}
      </div>
      <div className="timeline-panel">
        <div className="timeline-heading">
          {headerPart}
          {subheaderPart}
        </div>
        <div className="timeline-body">
          <p className="text-muted" dangerouslySetInnerHTML={{
              __html: content
          }}/>
        </div>
      </div>
    </li>
  );
};

TimelineItem.propTypes = {
  invert: PropTypes.bool,
  imageFileName: PropTypes.string,
  imageAlt: PropTypes.string,
  imageContent: PropTypes.any,
  header: PropTypes.string,
  subheader: PropTypes.string,
  content: PropTypes.string,
  img: PropTypes.any,
};

TimelineItem.defaultProps = {
  invert: false,
  imageFileName: "",
  imageAlt: "",
  imageContent: null,
  header: "",
  subheader: "",
  content: "",
  img: null,
};

export default TimelineItem;
