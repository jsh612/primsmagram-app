import React, { useState } from "react";
import styled from "styled-components";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import { useMutation } from "@apollo/react-hooks";
import AuthButton from "../../components/AuthButton";
import AuthInput from "../../components/AuthInput";
import useInput from "../../hooks/useInput";
import { Alert } from "react-native";
import { CREATE_ACCOUNT } from "../Auth/AuthQueries";

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Text = styled.Text``;

export default ({ navigation }) => {
  const fNameInput = useInput("");
  const lNameInput = useInput("");
  //# params 중 email 없을 경우 key "" 찾기
  //  - console.log("빈", navigation.getParam(""));// undefined
  const emailInput = useInput(navigation.getParam("email", ""));
  const usernameInput = useInput("");

  const [loading, setLoading] = useState(false);

  const [createAccountMutation] = useMutation(CREATE_ACCOUNT, {
    variables: {
      username: usernameInput.value,
      email: emailInput.value,
      firstName: fNameInput.value,
      lastName: lNameInput.value
    }
  });

  const handleSignup = async () => {
    const { value: fName } = fNameInput;
    const { value: lName } = lNameInput;
    const { value: email } = emailInput;
    const { value: username } = usernameInput;

    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) {
      return Alert.alert("해당 email은 유효하지 않습니다.");
    }
    if (fName === "") {
      return Alert.alert("first name을 작성해 주세요");
    }
    if (username === "") {
      return Alert.alert("유효하지 않은 username 입니다.");
    }
    try {
      setLoading(true);
      const {
        data: { createAccount }
      } = await createAccountMutation();
      if (createAccount) {
        Alert.alert("Account created", "Log in now!");
        navigation.navigate("Login", { email });
      }
    } catch (error) {
      Alert.alert("해당 유저가 이미 있습니다.", "로그인 페이지로 이동합니다.");
      console.log("Signup.js : ", error);
      navigation.navigate("Login", { email });
    } finally {
      setLoading(false);
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View>
        <AuthInput
          {...fNameInput}
          placeholder={"First name"}
          autoCorrect={false}
        />
        <AuthInput
          {...lNameInput}
          placeholder={"Last name"}
          autoCorrect={false}
        />
        <AuthInput
          {...emailInput}
          placeholder={"Email"}
          keyboardType={"email-address"}
          returnKeyType="send"
          autoCorrect={false}
        />
        <AuthInput
          {...usernameInput}
          placeholder={"Username"}
          returnKeyType="send"
          autoCorrect={false}
        />
        <AuthButton
          loading={loading}
          text={"가입하기"}
          onPress={handleSignup}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};
