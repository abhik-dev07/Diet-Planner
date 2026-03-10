import { UserContext } from "@/context/UserContext";
import Colors from "@/shared/Colors";
import {
  AnalyticsUpIcon,
  CookBookIcon,
  Login03Icon,
  ServingFoodIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";

const MenuOption = [
  {
    tittle: "My Progress",
    icon: AnalyticsUpIcon,
    path: "/(tabs)/Progress",
  },
  {
    tittle: " Explore Recipes",
    icon: CookBookIcon,
    path: "/(tabs)/Meals",
  },
  {
    tittle: "Ai Recipies",
    icon: ServingFoodIcon,
    path: "/generate-ai-recipe",
  },
  {
    tittle: "Log out",
    icon: Login03Icon,
    path: "logout",
  },
];

export default function Profile() {
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();

  const OnMenuOptionClick = async (menu) => {
    if (menu.path === "logout") {
      try {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
        console.log("Logged out successfully");
        setUser(null);
        router.replace("/");
      } catch (error) {
        console.log("Sign-out error:", error);
      }
      return;
    }
    router.push(menu?.path);
  };
  return (
    <View
      style={{
        padding: 20,
        paddingTop: 40,
        backgroundColor: Colors.SECONDARY,
        height: "100%",
      }}
    >
      <Text
        style={{
          fontSize: 30,
          fontWeight: "bold",
        }}
      >
        Profile
      </Text>

      <View
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: 15,
        }}
      >
        <Image
          source={
            user?.picture
              ? { uri: user.picture }
              : require("../../assets/images/user.png")
          }
          style={{
            width: 100,
            height: 100,
            borderRadius: 99,
          }}
        />
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            marginTop: 5,
          }}
        >
          {user?.name}
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: Colors.GRAY,
            marginTop: 5,
          }}
        >
          {user?.email}
        </Text>
      </View>

      <FlatList
        data={MenuOption}
        style={{
          marginTop: 15,
        }}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => OnMenuOptionClick(item)}
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 6,
              alignItems: "center",
              padding: 15,
              borderWidth: 0.2,
              marginTop: 5,
              backgroundColor: Colors.WHITE,
              elevation: 1,
              borderRadius: 99,
            }}
          >
            <HugeiconsIcon icon={item.icon} size={35} color={Colors.PRIMARY} />
            <Text style={{ fontSize: 20, fontWeight: "300" }}>
              {item.tittle}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Footer */}
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 40,
        }}
      >
        <Text style={{ fontSize: 20, color: Colors.GRAY, fontWeight: "bold" }}>
          Made with ❤️ by Abhik
        </Text>
      </View>
    </View>
  );
}
