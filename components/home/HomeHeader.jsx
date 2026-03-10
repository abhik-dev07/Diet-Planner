import Colors from "@/shared/Colors";
import { Ionicons } from "@expo/vector-icons";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { UserContext } from "../../context/UserContext";

export default function HomeHeader() {
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
            setUser(null);
            router.replace("/");
          } catch (error) {
            console.error("Sign-out error:", error);
          }
        },
      },
    ]);
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Image
          source={
            user?.picture
              ? { uri: user.picture }
              : require("../../assets/images/user.png")
          }
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
          }}
        />
        <View>
          <Text style={{ fontSize: 18 }}>Hello, 👋</Text>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>{user?.name}</Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
        <TouchableOpacity
          onPress={() => router.push("/generate-ai-recipe")}
          style={{
            backgroundColor: Colors.PRIMARY,
            padding: 8,
            borderRadius: 99,
          }}
        >
          <Ionicons name="add" size={24} color={Colors.WHITE} />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={30} color={Colors.RED} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
