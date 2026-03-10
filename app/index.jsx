import { UserContext } from "@/context/UserContext";
import { api } from "@/convex/_generated/api";
import Colors from "@/shared/Colors";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useConvex } from "convex/react";
import { useRootNavigationState, useRouter } from "expo-router";
import { useContext, useEffect } from "react";
import { Image, Text, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const navigationState = useRootNavigationState();
  const { user, setUser } = useContext(UserContext);
  const convex = useConvex();

  useEffect(() => {
    if (!navigationState?.key) return;

    // Small delay to ensure navigation is fully ready to handle 'replace'
    const timer = setTimeout(() => {
      checkUserStatus();
    }, 100);

    return () => clearTimeout(timer);
  }, [navigationState?.key]);

  const checkUserStatus = async () => {
    try {
      if (!GoogleSignin) {
        throw new Error("GoogleSignin module is undefined");
      }

      GoogleSignin.configure({
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
      });

      const hasPreviousSignIn = await GoogleSignin.hasPreviousSignIn();
      if (hasPreviousSignIn) {
        const userInfo = await GoogleSignin.getCurrentUser();
        // In v16+, getCurrentUser returns the user object directly, not wrapped in {data: ...} usually for CURRENT user.
        // But let's be safe.
        const googleUser = userInfo?.user || userInfo;

        if (googleUser && googleUser.email) {
          console.log("Authenticated User:", googleUser.email);
          const userData = await convex.query(api.Users.GetUser, {
            email: googleUser.email,
          });

          if (userData) {
            console.log("Convex user found:", userData);
            setUser(userData);
            router.replace("/(tabs)/Home");
            return;
          }
        }
      }

      // If not signed in or no user in convex, go to SignIn
      console.log("No authenticated user, redirecting to SignIn...");
      router.replace("/auth/SignIn");
    } catch (error) {
      console.log("Error checking user status:", error);
      router.replace("/auth/SignIn");
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.WHITE,
      }}
    >
      <View style={{ alignItems: "center" }}>
        <Image
          source={require("../assets/images/logo.png")}
          style={{ height: 120, width: 120, marginBottom: 20 }}
        />
        <Text style={{ fontSize: 18, color: Colors.GRAY }}>Loading your experience...</Text>
      </View>
    </View>
  );
}
