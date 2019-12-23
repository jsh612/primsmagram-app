import React from "react";
import { Ionicons } from "@expo/vector-icons";
import PropTyes from "prop-types";
import styles from "../styles";

const NavIcon = ({
  name,
  color = styles.blackColor,
  size = 22,
  focused = true
}) => (
  <Ionicons
    name={name}
    color={focused ? color : styles.darkGreyColor}
    size={size}
  />
);

NavIcon.proptypes = {
  name: PropTyes.string.isRequired,
  color: PropTyes.string,
  size: PropTyes.number,
  focused: PropTyes.bool
};

export default NavIcon;
