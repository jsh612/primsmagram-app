import React, { useState } from "react";
import styled from "styled-components";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import { useMutation } from "@apollo/react-hooks";
import * as Facebook from "expo-facebook";
import * as Google from "expo-google-app-auth";
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

const FBContainer = styled.View`
  margin-top: 25px;
  padding-top: 25px;
  border-top-width: 1px;
  border-color: ${props => props.theme.lightGreyColor};
  border-style: solid;
`;

const GoogleContainer = styled.View`
  margin-top: 20px;
`;

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

  const fbLogin = async () => {
    try {
      await Facebook.initializeAsync("2437846576444335");
      const { type, token } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ["public_profile", "email"]
      });
      if (type === "success") {
        // Get the user's name using Facebook's Graph API
        const response = await fetch(
          `https://graph.facebook.com/me?access_token=${token}&fields=id,last_name,first_name,email`
        );

        const { email, first_name, last_name } = await response.json();
        updateFormData(email, first_name, last_name);
        setLoading(false);
      } else {
        // type === 'cancel'
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  };

  const googleLogin = async () => {
    try {
      const result = await Google.logInAsync({
        iosClientId:
          //참조
          "1010359324965-3hdrnlec4n9tosl19ho3jubs6ojf10lu.apps.googleusercontent.com",
        scopes: ["profile", "email"]
      });

      if (result.type === "success") {
        const user = await fetch("https://www.googleapis.com/userinfo/v2/me", {
          headers: { Authorization: `Bearer ${result.accessToken}` }
        });
        const { email, family_name, given_name } = await user.json();
        updateFormData(email, given_name, family_name);
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (email, firstName, lastName) => {
    emailInput.setValue(email);
    fNameInput.setValue(firstName);
    lNameInput.setValue(lastName);
    const [username] = email.split("@");
    usernameInput.setValue(username);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <>
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
          <FBContainer>
            <AuthButton
              loading={false}
              text={"페이스북 연동"}
              onPress={fbLogin}
              bgColor={"#2D4DA7"}
            />
          </FBContainer>
          <GoogleContainer>
            <AuthButton
              loading={false}
              text={"구글 연동"}
              onPress={googleLogin}
              bgColor={"#EE1922"}
            />
          </GoogleContainer>
        </View>
      </>
    </TouchableWithoutFeedback>
  );
};
