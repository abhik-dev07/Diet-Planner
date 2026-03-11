import { RefreshDataContext } from "@/context/RefreshDataContex";
import { UserContext } from "@/context/UserContext";
import { api } from "@/convex/_generated/api";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { useMutation } from "convex/react";
import { useContext, useState } from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View
} from "react-native";
import DateSelectionCard from "../shared/DateSelectionCard";

export default function AddToMealActionSheet({
  recipeDetail,
  hideActionSheet,
}) {
  const [selectedDate, setSelectedDate] = useState();
  const [selectedMeal, setSelectedMeal] = useState();
  const { refreshData, setRefreshData } = useContext(RefreshDataContext);
  const createMealPlan = useMutation(api.MealPlan.CreateMealPlan);
  const { user } = useContext(UserContext);

  const mealOption = [
    {
      title: "Breakfast",
      icon: "light-mode",
      iconColor: "#ca8a04",
      bgColor: "#fef9c3",
    },
    {
      title: "Lunch",
      icon: "restaurant",
      iconColor: "#ea580c",
      bgColor: "#ffedd5",
    },
    {
      title: "Dinner",
      icon: "bedtime",
      iconColor: "#9333ea",
      bgColor: "#f3e8ff",
    },
  ];

  const AddToMealPlan = async () => {
    if (!selectedDate && !selectedMeal) {
      Alert.alert("Error!", "Please Select All Details");
      return;
    }

    const result = await createMealPlan({
      date: selectedDate,
      mealType: selectedMeal,
      recipeId: recipeDetail?._id,
      uid: user?._id,
    });

    console.log(result);

    if (Platform.OS === "ios") {
      Alert.alert("Added!", "Added to meal plan");
    } else {
      ToastAndroid.show("Added to meal plan 🥳", ToastAndroid.SHORT);
    }
    setRefreshData(Date.now());
    hideActionSheet();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add To Meal Plan</Text>
      <Text style={styles.subtitle}>Choose a date and meal type</Text>

      <DateSelectionCard setSelectedDate={setSelectedDate} />

      <Text style={styles.sectionLabel}>Select Meal</Text>

      <View style={styles.mealGrid}>
        {mealOption.map((item) => {
          const isSelected = selectedMeal === item.title;
          return (
            <TouchableOpacity
              key={item.title}
              onPress={() => setSelectedMeal(item.title)}
              style={[
                styles.mealCard,
                isSelected && styles.mealCardSelected,
              ]}
              activeOpacity={0.7}
            >
              <View style={[styles.mealIconBg, { backgroundColor: item.bgColor }]}>
                <MaterialIcons name={item.icon} size={24} color={item.iconColor} />
              </View>
              <Text style={styles.mealTitle}>
                {item.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          onPress={AddToMealPlan}
          style={styles.addButton}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>Add to Meal Plan</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => hideActionSheet()}
          style={styles.cancelButton}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
  },
  title: {
    fontWeight: "800",
    fontSize: 22,
    textAlign: "center",
    color: "#1c1c1e",
    letterSpacing: -0.5,
    paddingHorizontal: 24,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 32,
    marginBottom: 16,
    color: "#1c1c1e",
    paddingHorizontal: 24,
  },
  mealGrid: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
  },
  mealCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderWidth: 1,
    borderRadius: 16,
    borderColor: '#f1f5f9',
    backgroundColor: '#ffffff',
  },
  mealCardSelected: {
    borderWidth: 2,
    borderColor: '#ff6a00',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  mealIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mealTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
  },
  actionsContainer: {
    marginTop: 40,
    paddingHorizontal: 24,
    gap: 16,
    alignItems: 'center',
  },
  addButton: {
    width: '100%',
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff6a00',
    borderRadius: 16,
    shadowColor: '#ff6a00',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  cancelButton: {
    paddingVertical: 8,
  },
  cancelText: {
    textAlign: "center",
    fontSize: 16,
    color: "#94a3b8",
    fontWeight: '600',
  },
});
