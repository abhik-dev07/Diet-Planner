import { UserContext } from "@/context/UserContext";
import { api } from "@/convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useMutation } from "convex/react";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ImageBackground,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function SignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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

      const user = userInfo.data ? userInfo.data.user : userInfo.user;

      if (!user) {
        throw new Error("User data not found from Google.");
      }

      console.log("Google User Data:", user);

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
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Top Section (48%) with vibrant background */}
      <View style={styles.topSection}>
        <ImageBackground
          source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCtrvJWesprI4Hlsu2kIEnzo0pCZ_64l9UE0oxh960wYvyO7HEZ68o7LVMbtlwQvXaxAns0urGnWS9Ldv13gTXDmTv3HSRJu-BHkEcfq4xPWJrMjOSogzuWzPxUgPOZPR_CMLIVtiP6viI_xeQ_pCv-Lz9fdcCZb2cTGNoces98xdr7aQCQUd4QiQbvC2YopS1WBTWeYp_ycEHmWnyo5nzdm7ftVZQbIkytvcSg1285CeVC_6OJweL9h1jfto6HZY0Xs0aGWqbo1ow" }}
          style={styles.foodBg}
          blurRadius={2}
          imageStyle={{ opacity: 0.9 }}
        >
          <View style={styles.overlay}>
            <View style={styles.brandingContainer}>
              {/* Logo Card */}
              <View style={styles.logoCard}>
                <View style={styles.logoIcon}>
                  <MaterialIcons name="restaurant" size={40} color="#ffffff" />
                </View>
              </View>
              {/* Branding */}
              <Text style={styles.brandTitle}>AI Diet Planner</Text>
              <Text style={styles.tagline}>
                Your personalized nutrition journey starts here
              </Text>
            </View>
          </View>
        </ImageBackground>
      </View>

      {/* Bottom Section (52%) */}
      <View style={styles.bottomSection}>
        <View style={styles.contentWrapper}>
          <View style={styles.welcomeHeader}>
            <Text style={styles.welcomeEmoji}>👋</Text>
            <Text style={styles.welcomeTitle}>Welcome!</Text>
            <Text style={styles.welcomeSubtitle}>Sign in to continue your healthy lifestyle</Text>
          </View>

          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={[styles.googleButton, loading && { opacity: 0.8 }]}
              onPress={onGoogleSignIn}
              disabled={loading}
              activeOpacity={0.9}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <View style={styles.buttonContent}>
                  <Ionicons name="logo-google" size={24} color="#ffffff" />
                  <Text style={styles.googleButtonText}>Continue with Google</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By continuing, you agree to our{" "}
              <Text style={styles.footerLink}>Terms of Service</Text> and{" "}
              <Text style={styles.footerLink}>Privacy Policy</Text>
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  topSection: {
    height: '48%',
    width: '100%',
  },
  foodBg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 106, 0, 0.25)', // Sophisticated overlay
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  brandingContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  logoCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 28,
    shadowColor: '#ff6a00',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 50,
    elevation: 20,
    marginBottom: 24,
  },
  logoIcon: {
    width: 64,
    height: 64,
    backgroundColor: '#ff6a00',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: -1,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  tagline: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.9,
    maxWidth: 260,
  },
  bottomSection: {
    height: '57%', // Slightly larger to overlap
    width: '100%',
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -40,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -20 },
    shadowOpacity: 0.08,
    shadowRadius: 40,
    elevation: 20,
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 48,
    paddingBottom: 32,
  },
  welcomeHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeEmoji: {
    fontSize: 36,
    marginBottom: 12,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1c1c1e',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
  },
  actionContainer: {
    width: '100%',
  },
  googleButton: {
    width: '100%',
    height: 60,
    backgroundColor: '#ff6a00',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ff6a00',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  googleButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 16,
  },
  footerLink: {
    color: '#ff6a00',
    fontWeight: '700',
  },
});
