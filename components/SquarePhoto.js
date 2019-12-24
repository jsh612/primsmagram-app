import React from "react";
import { withNavigation } from "react-navigation";
import PropTypes from "prop-types";
import { Image, TouchableOpacity } from "react-native";
import constants from "../constants";

const SqarePhoto = ({ files = [], id, navigation }) => (
  <TouchableOpacity onPress={() => navigation.navigate("Detail", { id })}>
    <Image
      source={{ uri: files[0].url }}
      style={{ width: constants.width / 3, height: constants.height / 6 }}
    />
  </TouchableOpacity>
);

SqarePhoto.propTypes = {
  files: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired
    })
  ).isRequired,
  id: PropTypes.string.isRequired
};

export default withNavigation(SqarePhoto);
