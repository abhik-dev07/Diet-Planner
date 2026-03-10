import { RefreshDataContext } from "@/context/RefreshDataContex";
import { api } from "@/convex/_generated/api";
import AnimatedCounter from "@/shared/AnimatedCounter";
import Colors from "@/shared/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useConvex } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";
import { useContext, useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { UserContext } from "../../context/UserContext";

export default function TodayProgress() {
  const { user } = useContext(UserContext);
  const convex = useConvex();
  const { refreshData } = useContext(RefreshDataContext);

  const [consumed, setConsumed] = useState({
    calories: 0,
    proteins: 0,
    carbs: 0,
    fats: 0,
    fiber: 0,
  });

  const animatedValues = {
    calories: useRef(new Animated.Value(0)).current,
    proteins: useRef(new Animated.Value(0)).current,
    carbs: useRef(new Animated.Value(0)).current,
    fats: useRef(new Animated.Value(0)).current,
    fiber: useRef(new Animated.Value(0)).current,
  };

  useEffect(() => {
    if (user) {
      FetchConsumedMetrics();
    }
  }, [user, refreshData]);

  const FetchConsumedMetrics = async () => {
    const result = await convex.query(api.MealPlan.GetTotalConsumedMetrics, {
      date: moment().format("DD/MM/YYYY"),
      uid: user?._id,
    });

    if (result) {
      setConsumed(result);
      animateAll(result);
    }
  };

  const animateAll = (data) => {
    const animations = Object.keys(data).map((key) => {
      const target = user?.[key === 'proteins' ? 'proteins' : key] || 1;
      const percentage = Math.min((data[key] / target) * 100, 100);
      return Animated.timing(animatedValues[key], {
        toValue: percentage,
        duration: 800,
        useNativeDriver: false,
      });
    });
    Animated.parallel(animations).start();
  };

  const MacroProgress = ({ label, consumed, target, color, animValue, icon, unit = "g" }) => {
    const width = animValue.interpolate({
      inputRange: [0, 100],
      outputRange: ["0%", "100%"],
    });

    return (
      <View style={styles.macroContainer}>
        <View style={styles.macroHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <MaterialCommunityIcons name={icon} size={18} color={color} />
            <Text style={styles.macroLabel}>{label}</Text>
          </View>
          <Text style={styles.macroValue}>
            {consumed}/{target}{unit}
          </Text>
        </View>
        <View style={styles.progressBarBg}>
          <Animated.View style={[styles.progressBarFill, { width, backgroundColor: color }]}>
            <LinearGradient
              colors={[color, color + '99']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ flex: 1, borderRadius: 99 }}
            />
          </Animated.View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Today's Progress</Text>
          <Text style={styles.subtitle}>{moment().format("MMMM DD, dddd")}</Text>
        </View>
        {/* <View style={styles.maintenanceBadge}>
          <Text style={styles.maintenanceText}>Target BMR: {user?.bmr || 0}</Text>
        </View> */}
      </View>

      <View style={styles.mainCalorieCard}>
        <LinearGradient
          colors={[Colors.PRIMARY, Colors.BLUE]}
          style={styles.calorieGradient}
        >
          <View style={styles.calorieInfo}>
            <MaterialCommunityIcons name="fire" size={40} color={Colors.WHITE} />
            <View>
              <AnimatedCounter
                targetValue={consumed.calories}
                suffix={` / ${user?.calories} kcal`}
                style={styles.calorieCounter}
              />
              <Text style={styles.calorieLabel}>Calories Consumed</Text>
            </View>
          </View>
          <View style={styles.maintenanceInfo}>
            <Text style={styles.maintenanceSubText}>Daily Maintenance: {user?.maintenance} kcal</Text>
          </View>
        </LinearGradient>
      </View>

      <View style={styles.macrosGrid}>
        <MacroProgress
          label="Protein"
          consumed={consumed.proteins}
          target={user?.proteins || 0}
          color={Colors.RED}
          animValue={animatedValues.proteins}
          icon="dumbbell"
        />
        <MacroProgress
          label="Carbs"
          consumed={consumed.carbs}
          target={user?.carbs || 0}
          color={Colors.BLUE}
          animValue={animatedValues.carbs}
          icon="barley"
        />
        <MacroProgress
          label="Fats"
          consumed={consumed.fats}
          target={user?.fats || 0}
          color={Colors.YELLOW || '#FFD700'}
          animValue={animatedValues.fats}
          icon="water-outline"
        />
        <MacroProgress
          label="Fiber"
          consumed={consumed.fiber}
          target={user?.fiber || 0}
          color={Colors.GREEN}
          animValue={animatedValues.fiber}
          icon="leaf"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 20,
    backgroundColor: Colors.WHITE,
    borderRadius: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.DARK,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.GRAY,
    marginTop: 2,
  },
  maintenanceBadge: {
    backgroundColor: Colors.SECONDARY,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  maintenanceText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.PRIMARY,
  },
  mainCalorieCard: {
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 25,
  },
  calorieGradient: {
    padding: 20,
  },
  calorieInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  calorieCounter: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.WHITE,
  },
  calorieLabel: {
    color: Colors.WHITE,
    opacity: 0.9,
    fontSize: 14,
  },
  maintenanceInfo: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    paddingTop: 10,
  },
  maintenanceSubText: {
    color: Colors.WHITE,
    fontSize: 12,
    fontWeight: '500',
  },
  macrosGrid: {
    gap: 15,
  },
  macroContainer: {
    width: "100%",
  },
  macroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  macroLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.DARK,
  },
  macroValue: {
    fontSize: 13,
    color: Colors.GRAY,
    fontWeight: "500",
  },
  progressBarBg: {
    height: 8,
    backgroundColor: "#F0F0F0",
    borderRadius: 99,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 99,
  },
});
