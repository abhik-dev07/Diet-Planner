import { UserContext } from "@/context/UserContext";
import { api } from "@/convex/_generated/api";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { Alert, Dimensions, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get('window');

export default function Profile() {
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();

  const fullUserData = useQuery(api.Users.GetUserByEmail, { email: user?.email ?? "" });
  const displayUser = fullUserData || user;

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to sign out?", [
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
            console.log("Sign-out error:", error);
          }
        },
      },
    ]);
  };

  const OnMenuOptionClick = (menu) => {
    if (menu.path) {
      router.push(menu.path);
    }
  };

  return (
    <ScrollView style={styles.container} bounces={false} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f7f5" />

      {/* Top Header */}
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <MaterialIcons name="arrow-back" size={24} color="#1c1c1e" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerButton} />
      </View> */}

      {/* User Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarWrapper}>
          <Image
            source={
              displayUser?.picture
                ? { uri: displayUser.picture }
                : require("../../assets/images/user.png")
            }
            style={styles.avatar}
          />
        </View>
        <Text style={styles.userNameText}>{displayUser?.name}</Text>
      </View>

      {/* Wellness Stats */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionLabel}>Wellness Stats</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statBoxLabel}>RECIPES</Text>
            <Text style={styles.statBoxValue}>42</Text>
            <View style={styles.statTrend}>
              <MaterialIcons name="trending-up" size={12} color="#10b981" />
              <Text style={styles.trendText}>+5</Text>
            </View>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statBoxLabel}>MAINTAINABLE</Text>
            <Text style={styles.statBoxValue}>{displayUser?.bmr || '2,200'}</Text>
            <Text style={styles.statBoxSub}>kcal / day</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statBoxLabel}>GOAL</Text>
            <Text style={styles.statBoxValue}>75%</Text>
            <View style={styles.goalBarContainer}>
              <View style={[styles.goalBarFill, { width: '75%' }]} />
            </View>
          </View>
        </View>
      </View>

      {/* Account Settings */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionLabel}>Account Settings</Text>
        <View style={styles.settingsList}>
          <SettingItem
            icon="person"
            title="Personal Information"
            subtitle="Update your basic profile data"
            onPress={() => { }}
          />
          <SettingItem
            icon="restaurant"
            title="Dietary Preferences"
            subtitle="Vegan, Keto, Allergies, etc."
            onPress={() => { }}
          />
          <SettingItem
            icon="monitoring"
            title="Nutritional Goals"
            subtitle="Daily macros and calorie targets"
            onPress={() => { }}
          />
          <SettingItem
            icon="notifications"
            title="Notifications"
            subtitle="Meal reminders and AI tips"
            onPress={() => { }}
          />
          <SettingItem
            icon="help"
            title="Help & Support"
            subtitle="FAQs and contact our team"
            onPress={() => { }}
          />
        </View>
      </View>

      {/* Logout & Footer */}
      <View style={styles.footerSection}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons name="logout" size={20} color="#1c1c1e" />
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
        <Text style={styles.madeByText}>Made with ❤️ by Abhik</Text>
      </View>
    </ScrollView>
  );
}

const SettingItem = ({ icon, title, subtitle, onPress }) => (
  <TouchableOpacity style={styles.settingItem} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.settingIconWrap}>
      <MaterialIcons name={icon} size={20} color="#ff6a00" />
    </View>
    <View style={styles.settingTextWrap}>
      <Text style={styles.settingTitle}>{title}</Text>
      <Text style={styles.settingSubtitle}>{subtitle}</Text>
    </View>
    <MaterialIcons name="chevron-right" size={20} color="#cbd5e1" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f7f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 55,
    paddingHorizontal: 16,
    paddingBottom: 15,
    backgroundColor: '#f8f7f5',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 106, 0, 0.05)',
  },
  headerButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1c1c1e',
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: 32,
    marginTop: 20,
  },
  avatarWrapper: {
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 4,
    borderColor: 'rgba(255, 106, 0, 0.15)',
    padding: 2,
    marginBottom: 16,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  userNameText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1c1c1e',
    letterSpacing: -0.5,
  },
  sectionContainer: {
    paddingHorizontal: 16,
    marginBottom: 10,
    marginTop: 10,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1c1c1e',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 106, 0, 0.05)',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
  },
  statBoxLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 1,
    marginBottom: 8,
  },
  statBoxValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1c1c1e',
  },
  statBoxSub: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 4,
  },
  statTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10b981',
  },
  goalBarContainer: {
    width: '100%',
    height: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 3,
    marginTop: 8,
    overflow: 'hidden',
  },
  goalBarFill: {
    height: '100%',
    backgroundColor: '#ff6a00',
    borderRadius: 3,
  },
  settingsList: {
    gap: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 106, 0, 0.05)',
  },
  settingIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 106, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingTextWrap: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1c1c1e',
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  footerSection: {
    padding: 24,
    paddingBottom: 120,
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 20,
    gap: 8,
    marginBottom: 24,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1c1c1e',
  },
  madeByText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
});
