import TodayProgress from "@/components/home/TodayProgress";
import TodaysMealPlan from "@/components/home/TodaysMealPlan";
import Colors from "@/shared/Colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DateSelectionCard from "../../components/shared/DateSelectionCard";

export default function Progress() {
  const [selectedDate, setSelectedDate] = useState();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.LIGHT_BG} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.headerSection}>
          <View style={styles.headerTitleRow}>
            <MaterialIcons name="calendar-month" size={32} color="#ff6a00" />
            <Text style={styles.headerTitle}>Meal Planner</Text>
          </View>
          <TouchableOpacity style={styles.headerButton}>
            <MaterialIcons name="search" size={24} color="#1c1c1e" />
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          {/* Date Selection Section (The Calendar) */}
          <View style={styles.calendarCard}>
            <DateSelectionCard setSelectedDate={setSelectedDate} />
          </View>

          {/* Meal Journal (Daily Meals) */}
          <View style={styles.section}>
            <TodaysMealPlan selectedDate={selectedDate} />
          </View>

          {/* Nutrition Status (Stats) */}
          <View style={styles.section}>
            <TodayProgress selectedDate={selectedDate} variant="dark" />
          </View>

          <View style={{ marginBottom: 100 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f7f5',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: 'rgba(248, 247, 245, 0.8)',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1c1c1e',
    letterSpacing: -0.5,
  },
  headerButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
  },
  contentContainer: {
    paddingHorizontal: 16,
  },
  calendarCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 106, 0, 0.05)',
    marginBottom: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
  },
  section: {
    marginBottom: 24,
  },
});
