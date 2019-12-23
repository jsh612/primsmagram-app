import React from "react";
import { Ionicons } from "@expo/vector-icons";
import PropTyes from "prop-types";
import styles from "../styles";

const NavIcon = ({ name, color = styles.blackColor, size = 26 }) => (
  <Ionicons name={name} color={color} size={size} />
);

NavIcon.proptypes = {
  name: PropTyes.string.isRequired,
  color: PropTyes.string,
  size: PropTyes.number
};

export default NavIcon;
