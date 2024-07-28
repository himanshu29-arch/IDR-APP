import {
  View,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import CustomInput from "../../components/customInput";
import MyText from "../../components/customtext";
import { ImagePaths } from "../../utils/imagepaths";
import { Image } from "react-native";
import { AppColors } from "../../utils/colors";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../../utils/Dimensions";
import CustomButton from "../../components/customButton";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginValidationSchema } from "../../utils/validationScemas";
import { useLoginMutation } from "../../services/RTKClient";
import { useDispatch } from "react-redux";
import { signIn } from "../../redux/slices/authSlice";
import { useToast } from "react-native-toast-notifications";
import Loader from "../../components/Loader";
import CustomIcon from "../../components/customIcon";
import {
  clearUserEmail,
  getCheckStatus,
  getUserEmail,
  getUserPassword,
  storeCheckStatus,
  storeUserEmail,
  storeUserPassword,
} from "../../utils/storage/RememberMe/RememberMeStorage";
import { saveString } from "../../utils/storage/storageHelpers";

type prop = { email: string; password: string };

export default function Login({ navigation }) {
  const [login, { isLoading }] = useLoginMutation();

  const [ischeck, setIsCheck] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [emailLoaded, setEmailLoaded] = useState(false);
  const [password, setPassword] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "all",
    defaultValues: {
      email: email,
      password: password,
    },
    values: { email: email, password: password },
    resolver: yupResolver(loginValidationSchema),
  });
  console.log("🚀 ~ Login ~ email:", email);
  console.log("🚀 ~ Login ~ password:", password);
  const toast = useToast();

  const onSubmit = (data: prop) => {
    const { email, password } = data;
    const body = {
      email_id: email,
      password: password,
    };
    storeUserEmail(email);
    storeUserPassword(password);
    login(body)
      .unwrap()
      .then((payload) => {
        console.log("🚀 ~ .then ~ payload:", payload);
        toast.show(payload.message, {
          type: "success",
        });
        dispatch(signIn({ payload: payload, rememberMe: ischeck }));
        saveString("token", payload.token);
      })
      .catch((error) => {
        toast.show(error.data.message, {
          type: "danger",
        });
      });
  };
  useEffect(() => {
    const fetchValuesFormStorage = async () => {
      try {
        const { emailValue } = await getUserEmail();
        const { passValue } = await getUserPassword();
        console.log("🚀 ~ fetchValuesFormStorage ~ passValue:", passValue);
        const { checkValue } = await getCheckStatus();
        console.log("got status value:", checkValue);
        console.log("got email value:", emailValue);
        setIsCheck(checkValue);
        setEmail(emailValue);
        setPassword(passValue);

        setEmailLoaded(true);
        if (!checkValue) {
          clearUserEmail();
        }
      } catch (error) {
        console.error("Error fetching checkValue or email:", error);
      }
    };
    fetchValuesFormStorage();
  }, []);
  async function handleRememberMe() {
    await storeCheckStatus(!ischeck);
    setIsCheck(!ischeck);
  }
  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "white",
        }}
      >
        <Loader loading={isLoading} />
        <StatusBar
          backgroundColor={AppColors.white}
          barStyle={"dark-content"}
        />
        <ScrollView>
          <View style={styles.logobg}>
            <Image
              source={ImagePaths.LOGO}
              style={{ height: 30 }}
              resizeMode="contain"
            />
          </View>

          <View style={{ marginHorizontal: 20 }}>
            <MyText
              fontType="regular"
              style={{ fontSize: 32, marginBottom: SCREEN_HEIGHT * 0.05 }}
            >
              Log in
            </MyText>

            <CustomInput
              control={control}
              name="email"
              placeholder="Email Address"
              label="Email Address"
              isOutline
              leftIcon="mail-outline"
              defaultValue={email}
              errors={errors}
              externalValue={"areact native"}
            />

            <CustomInput
              control={control}
              name="password"
              placeholder="password"
              label="Password"
              isOutline
              leftIcon="lock-closed-outline"
              rightIcon={showPassword ? "eye-outline" : "eye-off-outline"}
              onRighticonPress={() => setShowPassword(!showPassword)}
              secureTextEntry={showPassword}
              errors={errors}
              externalValue={password}
            />

            <View style={styles.conditions}>
              <CustomIcon
                name={ischeck ? "checkbox" : "square-outline"}
                onPress={handleRememberMe}
                color={ischeck ? AppColors?.primary : AppColors.black}
              />
              <MyText style={{ marginLeft: 10, color: AppColors.iconsGrey }}>
                Remember me
              </MyText>
            </View>
            <MyText
              style={{
                fontSize: 16,
                margin: 10,
                color: AppColors.primary,
                alignSelf: "flex-end",
              }}
              onPress={() => navigation.navigate("Forgotpassword")}
            >
              Forgot password?
            </MyText>

            <View style={{ marginTop: 30 }}>
              <CustomButton
                title="Login"
                onPress={handleSubmit(onSubmit)}
                isdisabled={!isValid}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  logobg: {
    backgroundColor: AppColors.white,
    padding: 10,
    borderRadius: 10,
    width: SCREEN_WIDTH * 0.8,
    alignSelf: "center",
    alignItems: "center",
    marginTop: SCREEN_HEIGHT * 0.1,
  },
  conditions: {
    flexDirection: "row",
    marginTop: 20,
  },
});
