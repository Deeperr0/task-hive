import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";

export default function SideMenuTab({
  tabName,
  currentTab,
  setCurrentTab,
  tabText,
  tabIcon,
}) {
  return (
    <li
      onClick={() => {
        setCurrentTab(tabName);
      }}
      className={`${
        currentTab == tabName
          ? "bg-accent-100 text-accent-500 cursor-pointer"
          : "hover:bg-accent-100 hover:text-accent-500 cursor-pointer"
      }`}
    >
      <FontAwesomeIcon icon={tabIcon} />
      <span>{tabText}</span>
    </li>
  );
}

SideMenuTab.propTypes = {
  tabName: PropTypes.string,
  currentTab: PropTypes.string,
  setCurrentTab: PropTypes.func,
};
