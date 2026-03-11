import Colors from "@/shared/Colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { Image, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { UserContext } from "../../context/UserContext";

export default function HomeHeader() {
  const { user } = useContext(UserContext);
  const router = useRouter();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.userInfo}>
        <View style={styles.avatarWrapper}>
          <Image
            source={
              user?.picture
                ? { uri: user.picture }
                : require("../../assets/images/user.png")
            }
            style={styles.avatar}
          />
          <View style={styles.onlineDot} />
        </View>
        <View style={styles.textBlock}>
          <Text style={styles.greeting}>Welcome back</Text>
          <Text style={styles.userName} numberOfLines={1}>
            {getGreeting()}, {user?.name?.split(' ')[0] || "User"}!
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => router.push("/generate-ai-recipe")}
          style={styles.actionButton}
          activeOpacity={0.7}
        >
          <MaterialIcons name="center-focus-strong" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 12,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flex: 1,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#ffffff',
    backgroundColor: '#f1f5f9',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#ff6a00',
    borderWidth: 2.5,
    borderColor: '#ffffff',
  },
  textBlock: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1c1c1e',
    marginTop: -2,
    letterSpacing: -0.5,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    backgroundColor: '#1c1c1e',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
});
