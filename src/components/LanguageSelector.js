import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSelector = (props) => {
  const { i18n } = useTranslation();
  return (
    <>
      <span
        className="m-2"
        title="Polish"
        onClick={() => i18n.changeLanguage("pl")}
      >
        PL
      </span>
      <span
        className="m-2"
        title="English"
        onClick={() => i18n.changeLanguage("en")}
      >
        EN
      </span>
    </>
  );
};

export default LanguageSelector;
