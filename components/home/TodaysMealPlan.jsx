import { RefreshDataContext } from "@/context/RefreshDataContex";
import { UserContext } from "@/context/UserContext";
import { api } from "@/convex/_generated/api";
import Colors from "@/shared/Colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useConvex } from "convex/react";
import { useRouter } from "expo-router";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import MealPlanCard from "./MealPlanCard";

export default function TodaysMealPlan({ selectedDate }) {
  const [mealPlan, setMealPlan] = useState();
  const { user } = useContext(UserContext);
  const convex = useConvex();
  const { refreshData, setRefreshData } = useContext(RefreshDataContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && selectedDate !== undefined) {
      GetTodaysMealPlan();
    }
  }, [selectedDate]);

  useEffect(() => {
    if (user) {
      convex
        .query(api.MealPlan.GetTodaysMealPlan, {
          date: selectedDate ?? moment().format("DD/MM/YYYY"),
          uid: user?._id,
        })
        .then((result) => setMealPlan(result));
    }
  }, [refreshData]);

  const GetTodaysMealPlan = async () => {
    setLoading(true);
    try {
      const result = await convex.query(api.MealPlan.GetTodaysMealPlan, {
        date: selectedDate ?? moment().format("DD/MM/YYYY"),
        uid: user?._id,
      });
      setMealPlan(result);
    } catch (error) {
      console.error("Error fetching meal plan:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDayLabel = () => {
    if (!selectedDate) return "Today";
    if (moment(selectedDate, "DD/MM/YYYY").isSame(moment(), "day")) return "Today";
    if (moment(selectedDate, "DD/MM/YYYY").isSame(moment().add(1, "day"), "day")) return "Tomorrow";
    return "this day";
  };

  const mealGroups = [
    { type: 'breakfast', label: 'Breakfast', icon: 'wb-twilight' },
    { type: 'lunch', label: 'Lunch', icon: 'light-mode' },
    { type: 'dinner', label: 'Dinner', icon: 'bedtime' },
    { type: 'snacks', label: 'Snacks', icon: 'restaurant' }
  ];

  const getMealsByType = (type) => {
    return (mealPlan || []).filter(item => 
      item.mealPlan?.mealType?.toLowerCase() === type.toLowerCase()
    );
  };

  const getNextMealId = () => {
    if (!mealPlan) return null;
    const uncompleted = mealPlan.find(m => m.mealPlan?.status !== true);
    return uncompleted ? uncompleted.mealPlan?._id : null;
  };

  const nextMealId = getNextMealId();

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#ff6a00" />
        </View>
      ) : !mealPlan || mealPlan.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <MaterialIcons name="calendar-today" size={32} color="#ff6a00" />
          </View>
          <Text style={styles.emptyTitle}>No meals planned</Text>
          <Text style={styles.emptySubtitle}>
            Your meal plan for {getDayLabel()} is currently empty
          </Text>

          <TouchableOpacity
            onPress={() => router.push("/(tabs)/Meals")}
            style={styles.createButton}
            activeOpacity={0.8}
          >
            <Text style={styles.createButtonText}>Plan Now</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ gap: 24 }}>
          {mealGroups.map((group) => {
            const meals = getMealsByType(group.type);
            return (
              <View key={group.type} style={styles.mealGroup}>
                <View style={styles.groupHeader}>
                  <View style={styles.groupTitleRow}>
                    <MaterialIcons name={group.icon} size={22} color="#ff6a00" />
                    <Text style={styles.groupLabel}>{group.label}</Text>
                  </View>
                  {meals.length > 0 && (
                    <Text style={styles.plannedCalories}>
                      Planned: {meals.reduce((acc, m) => acc + (m.recipe?.jsonData?.calories || 0), 0)} kcal
                    </Text>
                  )}
                </View>

                {meals.length > 0 ? (
                  <View style={{ gap: 10 }}>
                    {meals.map((item, index) => (
                      <MealPlanCard
                        key={item.mealPlan?._id || index}
                        mealPlanInfo={item}
                        isHighlighted={item.mealPlan?._id === nextMealId}
                        showCheckbox={
                          !selectedDate ||
                          moment(selectedDate, "DD/MM/YYYY").isSame(moment(), "day")
                        }
                      />
                    ))}
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => router.push("/(tabs)/Meals")}
                    style={styles.addMealPlaceholder}
                  >
                    <View style={styles.addIconCircle}>
                      <MaterialIcons name="add" size={24} color="#ff6a00" />
                    </View>
                    <Text style={styles.addMealText}>Add {group.label}</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  mealGroup: {
    gap: 12,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  groupTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  groupLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1c1c1e',
    letterSpacing: -0.3,
  },
  plannedCalories: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
  },
  addMealPlaceholder: {
    width: '100%',
    padding: 24,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 106, 0, 0.02)',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(255, 106, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  addMealText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748b',
  },
  loaderContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff5ed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1c1c1e',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: '#ff6a00',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 14,
  },
  createButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
});
