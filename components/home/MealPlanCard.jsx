import { RefreshDataContext } from "@/context/RefreshDataContex";
import { api } from "@/convex/_generated/api";
import Colors from "@/shared/Colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useMutation } from "convex/react";
import { useRouter } from "expo-router";
import { useContext } from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ToastAndroid,
  Alert
} from "react-native";

export default function MealPlanCard({ mealPlanInfo, showCheckbox, isHighlighted }) {
  const UpdateStatus = useMutation(api.MealPlan.updateStatus);
  const { setRefreshData } = useContext(RefreshDataContext);
  const router = useRouter();

  const onCheck = async (status) => {
    try {
      await UpdateStatus({
        id: mealPlanInfo?.mealPlan?._id,
        status: status,
        calories: mealPlanInfo?.recipe?.jsonData?.calories,
        proteins: mealPlanInfo?.recipe?.jsonData?.proteins,
      });

      if (Platform.OS === "ios") {
        Alert.alert("Success", status ? "Meal tracked! 🍴" : "Status updated");
      } else {
        ToastAndroid.show(status ? "Meal tracked! 🍴" : "Status updated", ToastAndroid.SHORT);
      }
      setRefreshData(Date.now());
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const getTimeByMealType = (type) => {
    const t = type?.toLowerCase();
    if (t === 'breakfast') return '08:00 AM';
    if (t === 'lunch') return '12:30 PM';
    if (t === 'dinner') return '07:30 PM';
    if (t === 'snacks') return '04:00 PM';
    return '01:00 PM';
  };

  const isCompleted = mealPlanInfo?.mealPlan?.status === true;

  if (isHighlighted) {
    return (
      <View style={[styles.highlightedCard, isCompleted && styles.completedCard]}>
        <View style={styles.largeImageContainer}>
          {mealPlanInfo?.recipe?.imageUrl ? (
            <Image
              source={{ uri: mealPlanInfo.recipe.imageUrl }}
              style={styles.largeImage}
            />
          ) : (
            <View style={[styles.largeImage, styles.imagePlaceholder]}>
              <MaterialIcons name="restaurant" size={48} color="#cbd5e1" />
            </View>
          )}
          <View style={styles.highlightBadge}>
            <Text style={styles.highlightBadgeText}>
              {mealPlanInfo?.mealPlan?.mealType.toUpperCase()} • {getTimeByMealType(mealPlanInfo?.mealPlan?.mealType)}
            </Text>
          </View>
        </View>

        <View style={styles.highlightContent}>
          <TouchableOpacity 
            onPress={() => onCheck(!isCompleted)}
            style={styles.checkboxContainer}
          >
            <MaterialIcons 
              name={isCompleted ? "check-box" : "check-box-outline-blank"} 
              color={isCompleted ? "#ff6a00" : "#cbd5e1"} 
              size={26}
            />
          </TouchableOpacity>
          
          <View style={styles.textContainer}>
            <Text style={[styles.highlightTitle, isCompleted && styles.completedText]} numberOfLines={1}>
              {mealPlanInfo?.recipe?.recipeName}
            </Text>
            <Text style={[styles.highlightSubtitle, isCompleted && styles.completedText]}>
              <MaterialIcons name="schedule" size={12} color="#94a3b8" /> 15 mins • {mealPlanInfo?.recipe?.jsonData?.calories} kcal
            </Text>
          </View>

          <TouchableOpacity 
            onPress={() => router.push({
              pathname: "/recipe-detail",
              params: { recipeId: mealPlanInfo?.mealPlan?.recipeId }
            })}
            style={styles.recipeButton}
          >
            <Text style={styles.recipeButtonText}>Recipe</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.card, isCompleted && styles.completedCard]}>
      {showCheckbox && (
        <TouchableOpacity 
          onPress={() => onCheck(!isCompleted)}
          style={styles.checkboxSide}
        >
          <MaterialIcons 
            name={isCompleted ? "check-box" : "check-box-outline-blank"} 
            color={isCompleted ? "#ff6a00" : "#cbd5e1"} 
            size={24}
          />
        </TouchableOpacity>
      )}

      {mealPlanInfo?.recipe?.imageUrl ? (
        <Image
          source={{ uri: mealPlanInfo.recipe.imageUrl }}
          style={styles.image}
        />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <MaterialIcons name="restaurant" size={24} color="#cbd5e1" />
        </View>
      )}
      
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={[styles.badgeText, isCompleted && styles.completedText]}>
            {mealPlanInfo?.mealPlan?.mealType}
          </Text>
          <Text style={styles.timeText}>{getTimeByMealType(mealPlanInfo?.mealPlan?.mealType)}</Text>
        </View>

        <Text style={[styles.recipeName, isCompleted && styles.completedText]} numberOfLines={1}>
          {mealPlanInfo?.recipe?.recipeName}
        </Text>

        <Text style={[styles.metaText, isCompleted && styles.completedText]}>
          {mealPlanInfo?.recipe?.jsonData?.calories} kcal • {mealPlanInfo?.recipe?.jsonData?.proteins}g Protein
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 14,
    marginTop: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
  },
  highlightedCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    marginTop: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 106, 0, 0.15)',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  completedCard: {
    opacity: 0.6,
    backgroundColor: '#f8fafc',
  },
  largeImageContainer: {
    position: 'relative',
    height: 180,
    width: '100%',
  },
  largeImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f1f5f9',
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
  },
  highlightBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
  },
  highlightBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#ff6a00',
    letterSpacing: 0.5,
  },
  highlightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  checkboxContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  highlightTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1c1c1e',
    letterSpacing: -0.5,
  },
  highlightSubtitle: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 2,
    fontWeight: '500',
  },
  recipeButton: {
    backgroundColor: '#ff6a00',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#ff6a00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  recipeButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  checkboxSide: {
    marginRight: 12,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
  },
  content: {
    flex: 1,
    marginLeft: 14,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#ff6a00',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timeText: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '600',
  },
  recipeName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1c1c1e',
    letterSpacing: -0.3,
  },
  metaText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
    fontWeight: '500',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#94a3b8',
  },
});
