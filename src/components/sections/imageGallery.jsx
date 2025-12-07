import React from "react";
import { motion } from "motion/react";
import { galleryItemsData } from "@/db/galleryItemsData.js";

const itemVariants = {
  initial: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

const ImageGallery = ({ className = "", isTitleShow }) => {
  return (
    <div className={`gallery-section pb-100 ${className}`}>
      <div className="container">
        {isTitleShow && (
          <div
            className="section-title-2"
            data-animation="fade-up"
            data-delay="{0.1}"
          >
            <div className="sub-title-2">
              <p>Prepare With AI</p>
            </div>
            <h2>Upgrade with AI</h2>
          </div>
        )}

        {/* Single static image, no filters, no click */}
        <div className="item-grid">
          {galleryItemsData.map((item) => (
            <motion.div
              key={item.id}
              className="item"
              variants={itemVariants}
              initial="initial"
              animate="visible"
              transition={{ duration: 0.3 }}
            >
              <img
                src={item.src}
                alt="SelfMock preview"
                className="gallery-img"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;
