import HomeHeader from "@/components/home/HomeHeader";
import TodayProgress from "@/components/home/TodayProgress";
import TodaysMealPlan from "@/components/home/TodaysMealPlan";
import WaterIntake from "@/components/home/WaterIntake";
import { UserContext } from "@/context/UserContext";
import Colors from "@/shared/Colors";
import { useRouter } from "expo-router";
import { useContext, useEffect, useRef } from "react";
import { ScrollView, StatusBar, StyleSheet, View } from "react-native";

export default function Home() {
  const { user } = useContext(UserContext);
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (!hasRedirected.current && user && !user.weight) {
      hasRedirected.current = true;
      router.replace("/preferance");
    }
  }, [user]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.LIGHT_BG} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <HomeHeader />
        </View>

        {/* Content Section */}
        <View style={styles.contentContainer}>
          <View style={styles.section}>
            <TodayProgress />
          </View>

          <View style={styles.section}>
            <WaterIntake />
          </View>

          <View style={[styles.section, { marginBottom: 100 }]}>
            <TodaysMealPlan />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHT_BG,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  headerSection: {
    paddingTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: Colors.LIGHT_BG,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  section: {
    marginBottom: 16,
  },
});
