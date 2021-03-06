import React, { useState } from "react";
import styled from "styled-components";
import { Image, ActivityIndicator, Alert } from "react-native";
import axios from "axios";
import { gql } from "apollo-boost";
import styles from "../../styles";
import constants from "../../constants";
import useInput from "../../hooks/useInput";
import { useMutation } from "@apollo/react-hooks";
import { FEED_QUERY } from "../Tabs/Home";
import { ME } from "../Tabs/Profile";

const UPLOAD = gql`
  mutation upload($caption: String!, $files: [String!]!, $location: String!) {
    upload(caption: $caption, files: $files, location: $location) {
      id
      caption
      location
    }
  }
`;

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

  const captionInput = useInput("");
  const locationInput = useInput("");

  const photo = navigation.getParam("photo");
  const [uploadMutation] = useMutation(UPLOAD, {
    refetchQueries: () => [{ query: FEED_QUERY }, { query: ME }] // 업로드시 해당 두개의 쿼리를 다시 해줌으로써, 홈화면과 프로필화면의 포스트 갱신
  });

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

    // "file" 나중에 백엔드에서 업로드 작성시, mutler가 파일을 찾는 키값(아무거나 해도 상관없음.)
    formData.append("file", {
      name,
      type: type.toLowerCase(),
      uri: photo.uri
    });

    try {
      setIsLoading(true);
      const {
        data: { location }
      } = await axios.post(
        "https://sh-prisma-test.herokuapp.com/api/upload",
        formData,
        {
          headers: {
            "content-type": "multipart/form-data"
          }
        }
      );

      const {
        data: { upload }
      } = await uploadMutation({
        variables: {
          files: [location],
          caption: captionInput.value,
          location: locationInput.value
        }
      });
      if (upload.id) {
        navigation.navigate("TabNavigation");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("업로드 불가", error);
    } finally {
      setIsLoading(false);
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
