import Button from "@/components/shared/Button";
import { UserContext } from "@/context/UserContext";
import { api } from "@/convex/_generated/api";
import Colors from "@/shared/Colors";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useConvex, useMutation } from "convex/react";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  ToastAndroid,
  View
} from "react-native";

const { width } = Dimensions.get("window");

export default function SignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const convex = useConvex();
  const createNewUser = useMutation(api.Users.CreateNewUser);
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    });
  }, []);

  const showToastOrAlert = (title, message) => {
    if (Platform.OS === "ios") {
      Alert.alert(title, message);
    } else {
      ToastAndroid.show(`${title}: ${message}`, ToastAndroid.SHORT);
    }
  };

  const onGoogleSignIn = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      // The structure of userInfo from @react-native-google-signin/google-signin v11+ 
      // is { data: { user: { email, name, photo, ... } } }
      const user = userInfo.data ? userInfo.data.user : userInfo.user;

      if (!user) {
        throw new Error("User data not found from Google.");
      }

      console.log("Google User Data:", user);

      // Sync with Convex
      const userData = await createNewUser({
        name: user.name,
        email: user.email,
        picture: user.photo,
      });

      setUser(userData);
      showToastOrAlert("Welcome", `Signed in as ${user.name}`);
      router.replace("/(tabs)/Home");
    } catch (error) {
      console.log("Google Sign-In Error:", error);
      showToastOrAlert("Sign-In Failed", "Could not complete Google Sign-In");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Image
          source={require("./../../assets/images/logo.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>AI Diet Planner</Text>
        <Text style={styles.subtitle}>
          Your personalized nutrition journey starts here.
        </Text>
      </View>

      <View style={styles.bottomSection}>
        <Text style={styles.welcomeText}>Welcome back!</Text>
        <Text style={styles.instructionText}>
          Sign in to access your meal plans and track your progress.
        </Text>

        <View style={{ width: "100%", marginTop: 35 }}>
          <Button
            title={loading ? "Connecting..." : "Continue with Google"}
            onPress={onGoogleSignIn}
            disabled={loading}
            icon="logo-google"
          />
        </View>

        {loading && (
          <ActivityIndicator
            size="large"
            color={Colors.PRIMARY}
            style={{ marginTop: 20 }}
          />
        )}

        <Text style={styles.footerText}>
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  topSection: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.PRIMARY,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.WHITE,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.WHITE,
    opacity: 0.8,
    marginTop: 5,
    textAlign: "center",
    paddingHorizontal: 40,
  },
  bottomSection: {
    flex: 0.5,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#333",
  },
  instructionText: {
    fontSize: 15,
    color: "#777",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 22,
  },
  footerText: {
    fontSize: 12,
    color: "#bbb",
    textAlign: "center",
    marginTop: "auto",
    paddingBottom: 20,
  },
});
