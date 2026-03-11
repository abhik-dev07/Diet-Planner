import { RefreshDataContext } from "@/context/RefreshDataContex";
import { api } from "@/convex/_generated/api";
import AnimatedCounter from "@/shared/AnimatedCounter";
import Colors from "@/shared/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useConvex } from "convex/react";
import moment from "moment";
import { useContext, useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { UserContext } from "../../context/UserContext";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

function CalorieRing({ consumed, target, size = 130 }) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = target > 0 ? Math.min(consumed / target, 1) : 0;
  const strokeDashoffset = circumference * (1 - progress);
  const remaining = Math.max(target - consumed, 0);

  return (
    <View style={styles.ringContainer}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#f1f5f9"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#ff6a00"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
      <View style={styles.ringCenter}>
        <Text style={styles.remainingValueRing}>{remaining.toLocaleString()}</Text>
        <Text style={styles.remainingLabel}>kcal left</Text>
      </View>
    </View>
  );
}

export default function TodayProgress({ selectedDate, variant = 'light' }) {
  const { user } = useContext(UserContext);
  const convex = useConvex();
  const { refreshData } = useContext(RefreshDataContext);
  const isDark = variant === 'dark';

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
  }, [user, refreshData, selectedDate]);

  const FetchConsumedMetrics = async () => {
    try {
      if (!user?._id) return;
      
      const result = await convex.query(api.MealPlan.GetTotalConsumedMetrics, {
        date: selectedDate ?? moment().format("DD/MM/YYYY"),
        uid: user?._id,
      });

      if (result) {
        setConsumed(result);
        animateAll(result);
      }
    } catch (error) {
      console.error("Error in FetchConsumedMetrics:", error);
    }
  };

  const animateAll = (data) => {
    if (!data || typeof data !== 'object') return;

    const keys = ['calories', 'proteins', 'carbs', 'fats', 'fiber'];
    const animations = keys.map((key) => {
      const targetValue = user?.[key] || (key === 'calories' ? 2000 : 1);
      const progressValue = data[key] || 0;
      const percentage = Math.min((progressValue / targetValue) * 100, 100);
      
      if (animatedValues[key]) {
        return Animated.timing(animatedValues[key], {
          toValue: percentage,
          duration: 1000,
          useNativeDriver: false,
        });
      }
      return null;
    }).filter(anim => anim !== null);

    if (animations.length > 0) {
      Animated.parallel(animations).start();
    }
  };

  const ProgressBar = ({ label, consumed, target, animValue }) => {
    const width = animValue.interpolate({
      inputRange: [0, 100],
      outputRange: ["0%", "100%"],
    });

    return (
      <View style={styles.progressBarWrapper}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>{label}</Text>
          <Text style={styles.progressValue}>{consumed}g / {target}g</Text>
        </View>
        <View style={styles.barContainer}>
          <View style={styles.barBg}>
             <Animated.View style={[styles.barFill, { width, backgroundColor: '#ff6a00' }]} />
          </View>
        </View>
      </View>
    );
  };

  const CalorieBar = () => {
    const width = animatedValues.calories.interpolate({
      inputRange: [0, 100],
      outputRange: ["0%", "100%"],
    });

    return (
      <View style={{ marginTop: 8 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={{ color: '#94a3b8', fontSize: 13, fontWeight: '500' }}>Calories</Text>
          <Text style={{ color: '#ffffff', fontSize: 13, fontWeight: '700' }}>
            {Math.round(consumed.calories)} / {user?.calories || 2100} kcal
          </Text>
        </View>
        <View style={{ height: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
          <Animated.View style={{ height: '100%', width, backgroundColor: '#ff6a00', borderRadius: 4 }} />
        </View>
      </View>
    );
  };

  if (isDark) {
    return (
      <View style={styles.darkCard}>
        <Text style={styles.darkTitle}>Daily Nutrition Status</Text>
        
        <View style={{ gap: 20 }}>
          <CalorieBar />

          <View style={styles.darkMacroGrid}>
            <View>
              <Text style={styles.darkMacroLabel}>PROTEIN</Text>
              <Text style={styles.darkMacroValue}>{Math.round(consumed.proteins)}g <Text style={styles.darkMacroTarget}>/ {user?.proteins || 120}g</Text></Text>
            </View>
            <View>
              <Text style={styles.darkMacroLabel}>CARBS</Text>
              <Text style={styles.darkMacroValue}>{Math.round(consumed.carbs)}g <Text style={styles.darkMacroTarget}>/ {user?.carbs || 250}g</Text></Text>
            </View>
            <View>
              <Text style={styles.darkMacroLabel}>FATS</Text>
              <Text style={styles.darkMacroValue}>{Math.round(consumed.fats)}g <Text style={styles.darkMacroTarget}>/ {user?.fats || 70}g</Text></Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.summaryCard}>
        {/* Header inside card */}
        <View style={styles.headerRowInside}>
          <Text style={styles.cardTitle}>Daily Summary</Text>
          <Text style={styles.todayLabel}>Today</Text>
        </View>

        <View style={styles.contentWrap}>
          {/* Centered Calorie Ring on Mobile */}
          <View style={styles.ringCenterWrap}>
            <CalorieRing
              consumed={consumed.calories}
              target={user?.calories || 2000}
            />
          </View>

          {/* Macro Progress Bars below */}
          <View style={styles.barsContainer}>
            <ProgressBar
              label="Protein"
              consumed={consumed.proteins}
              target={user?.proteins || 100}
              animValue={animatedValues.proteins}
            />
            <ProgressBar
              label="Carbs"
              consumed={consumed.carbs}
              target={user?.carbs || 200}
              animValue={animatedValues.carbs}
            />
            <ProgressBar
              label="Fats"
              consumed={consumed.fats}
              target={user?.fats || 60}
              animValue={animatedValues.fats}
            />
            <ProgressBar
              label="Fiber"
              consumed={consumed.fiber}
              target={user?.fiber || 30}
              animValue={animatedValues.fiber}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 106, 0, 0.05)',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
  },
  darkCard: {
    backgroundColor: '#1c1c1e',
    borderRadius: 24,
    padding: 24,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
  darkTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 16,
  },
  darkMacroGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  darkMacroLabel: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  darkMacroValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#ffffff',
  },
  darkMacroTarget: {
    fontSize: 11,
    fontWeight: '400',
    color: '#64748b',
  },
  headerRowInside: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1c1c1e',
    margin: 0,
  },
  todayLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ff6a00',
  },
  contentWrap: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 24,
  },
  ringCenterWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 144,
    height: 144,
  },
  ringCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  remainingValueRing: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1c1c1e',
    letterSpacing: -0.5,
  },
  remainingLabel: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginTop: -2,
  },
  barsContainer: {
    width: '100%',
    gap: 16,
  },
  progressBarWrapper: {
    gap: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1c1c1e',
  },
  progressValue: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  barContainer: {
    width: '100%',
  },
  barBg: {
    height: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
});
