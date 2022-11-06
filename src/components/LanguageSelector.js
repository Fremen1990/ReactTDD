import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import useHover from "../useHover";

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const ref = useRef();
  const on = useHover(ref.current);

  let size = 12;
  if (on) {
    size = 24;
  }
  return (
    <div ref={ref}>
      <span
        className="m-2"
        title="Polish"
        onClick={() => i18n.changeLanguage("pl")}
        style={{ fontSize: size }}
      >
        PL
      </span>
      <span
        className="m-2"
        title="English"
        onClick={() => i18n.changeLanguage("en")}
        style={{ fontSize: size }}
      >
        EN
      </span>
    </div>
  );
};

export default LanguageSelector;
