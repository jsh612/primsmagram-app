// 모든 화면에서 width 와 heigtht 작성
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("screen"); // screen의 가로, 높이 가져옴

export default { width, height };
