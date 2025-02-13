import React, { useContext } from 'react';
import { HorizontalMenu, HorizontalMenuVariant } from 'src/components';
import { DEFAULT_LANGUAGE } from '../../../data/createPages/constants';
import PageLanguageContext from '../../contexts/page-language-context';
import { HomePageLink } from './HomePageLink/HomePageLink';
import { LanguageDropdownSelector } from './LanguageDropdownSelector/LanguageDropdownSelector';
import VersionMenu, { VersionMenuProps } from './VersionMenu';

const TopCodeMenu = ({ languages, versionData }: { languages: string[]; versionData: VersionMenuProps }) => {
  const pageLanguage = useContext(PageLanguageContext);
  const showVersionMenu = versionData && versionData.versions.length > 0;
  const showLanguageSelector = languages.length > 0;
  const showCodeMenu = showLanguageSelector || showVersionMenu;
  const showDefaultLink = pageLanguage !== DEFAULT_LANGUAGE;

  return showCodeMenu ? (
    <div
      id="top-code-menu"
      className="fixed right-0 z-10 top-64 left-0 md:pl-244 w-full items-end border-b border-mid-grey bg-white px-24"
    >
      <HorizontalMenu variant={HorizontalMenuVariant.end}>
        <HomePageLink />
        <VersionMenu {...versionData} />
        {showLanguageSelector ? (
          <LanguageDropdownSelector language={pageLanguage} languages={languages} showDefaultLink={showDefaultLink} />
        ) : null}
      </HorizontalMenu>
    </div>
  ) : null;
};

export default TopCodeMenu;
