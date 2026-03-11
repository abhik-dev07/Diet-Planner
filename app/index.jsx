import { UserContext } from "@/context/UserContext";
import { api } from "@/convex/_generated/api";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useConvex } from "convex/react";
import { useRootNavigationState, useRouter } from "expo-router";
import { useContext, useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Easing, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const { height, width } = Dimensions.get("window");

const CAROUSEL_DATA = [
  {
    id: 1,
    image: { uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQr88l7gYEoTKb3sYpnAeNQR2XNjoED3arBT6ZVbsK8f6zO6jiMZc0YHgDsia7gPF9ASrWuxJX5Oq37jX4U3_FzXIvT5XrckiM5TvgPFB74DIuP7e_-7kSxfFZP4J98Y9qwnf46daZI00oQp0HmJyoB2eRBsTGCD2IODorURMCcRZhsRZim91AOjgq1Z7SrwVefhNk98_Aw_9AAAf7G_ZLDWgsU0s7s6vcEImhrVM1d3WQORiZwd3kN0-EEY5wQqHbBF8QZQiTENU" },
    title: "Simple Wellness to Naturally Nourish Your Life",
    subtitle: "Experience a smarter way to track your nutrition and reach your health goals with AI-powered insights."
  },
  {
    id: 2,
    image: require("../assets/images/landing.png"),
    title: "AI-Powered Recipe Generation",
    subtitle: "Get personalized meal suggestions tailored to your preferences and dietary needs."
  },
  {
    id: 3,
    image: require("../assets/images/recipe.png"),
    title: "Track Your Progress Effectively",
    subtitle: "Stay on top of your macros and calories with our intuitive daily progress tracking."
  }
];

export default function Index() {
  const router = useRouter();
  const navigationState = useRootNavigationState();
  const { user, setUser } = useContext(UserContext);
  const convex = useConvex();
  const [isLoading, setIsLoading] = useState(true);

  // Carousel state
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (!navigationState?.key) return;

    const timer = setTimeout(() => {
      checkUserStatus();
    }, 100);

    // Carousel auto-scroll
    const carouselTimer = setInterval(() => {
      if (!isLoading) {
        setActiveIndex((prev) => {
          const nextIndex = (prev + 1) % CAROUSEL_DATA.length;
          flatListRef.current?.scrollToIndex({
            index: nextIndex,
            animated: true,
          });
          return nextIndex;
        });
      }
    }, 4000);

    return () => {
      clearTimeout(timer);
      clearInterval(carouselTimer);
    };
  }, [navigationState?.key, isLoading]);

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

      // If no authenticated user, stop loading and animate onboarding UI in
      setIsLoading(false);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        })
      ]).start();

    } catch (error) {
      console.log("Error checking user status:", error);
      setIsLoading(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
        <View style={styles.loadingWrapper}>
          <Image
            source={require("../assets/images/logo.png")}
            style={styles.loadingLogo}
          />
          <View style={styles.loadingRow}>
            <View style={styles.loadingDot} />
            <View style={[styles.loadingDot, styles.loadingDotMid]} />
            <View style={styles.loadingDot} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Hero Carousel Section */}
      <View style={styles.imageContainer}>
        <Animated.FlatList
          ref={flatListRef}
          data={CAROUSEL_DATA}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            setActiveIndex(index);
          }}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={{ width, height: height * 0.6 }}>
              <Image
                source={item.image}
                style={styles.heroImage}
                resizeMode="cover"
              />
            </View>
          )}
        />
        {/* Gradient Overlay Simulation */}
        <View style={styles.imageOverlay} />
      </View>

      {/* Content Section */}
      <Animated.View style={[styles.contentContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

        {/* Dynamic Typography */}
        <View style={styles.textSection}>
          <Text style={styles.title}>{CAROUSEL_DATA[activeIndex].title}</Text>
          <Text style={styles.subtitle}>
            {CAROUSEL_DATA[activeIndex].subtitle}
          </Text>
        </View>

        {/* Action Section */}
        <View style={styles.actionSection}>
          {/* Progress Dots */}
          <View style={styles.progressContainer}>
            {CAROUSEL_DATA.map((_, index) => (
              <View
                key={index}
                style={[styles.dot, activeIndex === index && styles.dotActive]}
              />
            ))}
          </View>

          {/* Get Started Button */}
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => router.replace("/auth/SignIn")}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>

      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingWrapper: {
    alignItems: 'center',
  },
  loadingLogo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  loadingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ff6a00',
    opacity: 0.4,
  },
  loadingDotMid: {
    opacity: 0.8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  imageContainer: {
    height: height * 0.6,
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
  },
  contentContainer: {
    height: height * 0.4,
    paddingHorizontal: 32,
    paddingTop: 32,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  textSection: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  actionSection: {
    alignItems: 'center',
    width: '100%',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 32,
  },
  dot: {
    height: 8,
    width: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: '#ff6a00',
  },
  button: {
    width: '100%',
    backgroundColor: '#ff6a00',
    paddingVertical: 18,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ff6a00',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
