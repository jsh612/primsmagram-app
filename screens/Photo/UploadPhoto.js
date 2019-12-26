import React, { useState } from "react";
import styled from "styled-components";
import { Image, ActivityIndicator, Alert } from "react-native";
import axios from "axios";
import styles from "../../styles";
import constants from "../../constants";
import useInput from "../../hooks/useInput";

const View = styled.View`
  flex: 1;
`;

const Container = styled.View`
  padding: 20px;
  flex-direction: row;
`;

const Form = styled.View`
  justify-content: flex-start;
`;

const STextInput = styled.TextInput`
  margin-bottom: 10px;
  border: 0px solid ${styles.lightGreyColor};
  border-bottom-width: 1px;
  padding-bottom: 10px;
  width: ${constants.width - 180};
`;

const Button = styled.TouchableOpacity`
  background-color: ${props => props.theme.blueColor};
  padding: 10px;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
`;

const Text = styled.Text`
  color: white;
  font-weight: 600;
`;

export default ({ navigation }) => {
  const [loading, setIsLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState("");

  const captionInput = useInput("test-caption");
  const locationInput = useInput("test-location");

  const photo = navigation.getParam("photo");

  const handleSubmit = async () => {
    if (captionInput.value === "" || locationInput.value === "") {
      Alert.alert("All fields are required");
    }

    // # FormData
    //  - HTML form 태그 처럼 작동
    //  - 사진을 백엔드가 이해할 수 있는 형태로 변환
    const formData = new FormData();
    const name = photo.filename;
    const [, type] = name.split(".");

    formData.append("file", {
      name,
      type: type.toLowerCase(),
      uri: photo.uri
    });

    try {
      const {
        data: { path }
      } = await axios.post("http://localhost:4000/api/upload", formData, {
        headers: {
          "content-type": "multipart/form-data"
        }
      });
      console.log(path);
      setFileUrl(path);
    } catch (error) {
      Alert.alert("업로드 불가", "다시 시도해주세요");
    }
  };

  return (
    <View>
      <Container>
        <Image
          source={{ uri: photo.uri }}
          style={{ height: 80, width: 80, marginRight: 30 }}
        />
        <Form>
          <STextInput
            onChangeText={captionInput.onChange}
            value={captionInput.value}
            placeholder="Caption"
            multiline={true}
            placeholderTextColor={styles.darkGreyColor}
          />
          <STextInput
            onChangeText={locationInput.onChange}
            value={locationInput.value}
            placeholder="Location"
            multiline={true}
            placeholderTextColor={styles.darkGreyColor}
          />
          <Button onPress={handleSubmit}>
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text>Upload </Text>
            )}
          </Button>
        </Form>
      </Container>
    </View>
  );
};
