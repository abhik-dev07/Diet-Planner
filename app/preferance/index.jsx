import { UserContext } from "@/context/UserContext";
import { api } from "@/convex/_generated/api";
import {
  MaterialIcons
} from "@expo/vector-icons";
import { useConvex, useMutation } from "convex/react";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  UIManager,
  View,
} from "react-native";
import LoadingDialog from "../../components/shared/LoadingDialog";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Preferance() {
  const [weight, setWeight] = useState();
  const [height, setHeight] = useState();
  const [age, setAge] = useState();
  const [gender, setGender] = useState();
  const [goal, setGoal] = useState();
  const [activityLevel, setActivityLevel] = useState();
  const [loading, setLoading] = useState(false);

  const { user, setUser } = useContext(UserContext);
  const UpdateUserPref = useMutation(api.Users.UpdateUserPref);
  const router = useRouter();
  const convex = useConvex();

  function normalizeHeight(input) {
    const numInput = Number(input);
    if (!isNaN(numInput) && numInput > 100) {
      return numInput;
    }

    if (!isNaN(numInput) && numInput < 10) {
      const feet = Math.floor(numInput);
      const inches = Math.round((numInput - feet) * 10);
      return feet * 30.48 + inches * 2.54;
    }

    if (typeof input === "string" && input.includes(".")) {
      const parts = input.split(".");
      const feet = parseInt(parts[0]);
      const inches = parseInt(parts[1]);
      return feet * 30.48 + (isNaN(inches) ? 0 : inches * 2.54);
    }

    return 170;
  }

  function calculateFitnessMetrics(
    age,
    weightKg,
    heightRaw,
    gender,
    goal,
    activityLevel
  ) {
    const heightCm = normalizeHeight(heightRaw);

    const multipliers = {
      sedentary: 1.2,
      "lightly active": 1.375,
      "moderately active": 1.55,
      "very active": 1.725,
      "extra active": 1.9,
    };
    const activeVal = multipliers[activityLevel.toLowerCase()] || 1.2;

    const bmr =
      gender.toLowerCase() === "male"
        ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
        : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

    const tdee = bmr * activeVal;

    const goals = {
      "muscle gain": { cal: 300, prot: 2.2 },
      "muscle build": { cal: 300, prot: 2.2 },
      "weight gain": { cal: 500, prot: 1.8 },
      "weight loss": { cal: -500, prot: 2.0 },
    };
    const selection = goals[goal.toLowerCase()] || { cal: 0, prot: 0.8 };

    const dailyCalories = Math.round(tdee + selection.cal);

    const proteinGrams = Math.round(weightKg * selection.prot);
    const proteinKcal = proteinGrams * 4;

    const fatKcal = dailyCalories * 0.25;
    const fatGrams = Math.round(fatKcal / 9);

    const carbKcal = dailyCalories - (proteinKcal + fatKcal);
    const carbGrams = Math.round(carbKcal / 4);

    const fiberGrams = Math.round((dailyCalories / 1000) * 14);

    return {
      targetCalories: dailyCalories,
      protein: proteinGrams,
      carbs: carbGrams,
      fats: fatGrams,
      fiber: fiberGrams,
      bmr: Math.round(bmr),
      maintenance: Math.round(tdee),
      summary: `Target: ${dailyCalories}kcal | P: ${proteinGrams}g | C: ${carbGrams}g | F: ${fatGrams}g | Fiber: ${fiberGrams}g`,
      heightCm: heightCm.toFixed(1),
    };
  }

  const OnContinue = async () => {
    if (!weight || !height || !gender || !age || !goal || !activityLevel) {
      Alert.alert("Fill all the fields", "Enter all details to continue");
      return;
    }

    if (loading) return;

    setLoading(true);

    try {
      const metrics = calculateFitnessMetrics(
        Number(age),
        Number(weight),
        height,
        gender,
        goal,
        activityLevel
      );

      const data = {
        email: user?.email,
        weight: weight.toString(),
        height: metrics.heightCm,
        gender,
        goal,
        activityLevel,
        calories: Number(metrics.targetCalories),
        proteins: Number(metrics.protein),
        carbs: Number(metrics.carbs),
        fats: Number(metrics.fats),
        fiber: Number(metrics.fiber),
        bmr: Number(metrics.bmr),
        maintenance: Number(metrics.maintenance),
      };

      await UpdateUserPref(data);

      const latestUser = await convex.query(api.Users.GetUserByEmail, {
        email: user?.email,
      });

      setUser(latestUser);
      router.replace("/(tabs)/Home");
    } catch (error) {
      console.error("Update failed:", error);
      Alert.alert(
        "Update Failed",
        `Error: ${error.message}\n\nPlease check your input and try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const showListener = Keyboard.addListener("keyboardWillShow", () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    });
    const hideListener = Keyboard.addListener("keyboardWillHide", () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    });

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  const goalOptions = [
    {
      id: "Weight Loss",
      title: "Weight Loss",
      sub: "Focus on calorie deficit",
      icon: "trending-down",
    },
    {
      id: "Muscle Gain",
      title: "Muscle Gain",
      sub: "High protein & strength",
      icon: "fitness-center",
    },
    {
      id: "Weight Gain",
      title: "Weight Gain",
      sub: "Bulk up safely",
      icon: "trending-up",
    },
  ];

  const activityOptions = [
    { id: "Sedentary", title: "Sedentary (Office job)" },
    { id: "Lightly Active", title: "Lightly Active" },
    { id: "Moderately Active", title: "Moderately Active (3-5 days/wk)" },
    { id: "Very Active", title: "Very Active" },
    { id: "Extra Active", title: "Extra Active (Athlete)" },
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#f8f7f5" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <MaterialIcons name="restaurant-menu" size={36} color="#ff6a00" />
            </View>
            <Text style={styles.headerLabel}>SET YOUR PREFERENCES</Text>
            <Text style={styles.headerTitle}>Tell us about yourself</Text>
            <Text style={styles.headerSubtitle}>
              This helps us create your personalized meal plan
            </Text>
          </View>

          {/* Body Metrics Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="straighten" size={20} color="#ff6a00" />
              <Text style={styles.cardTitle}>Body Metrics</Text>
            </View>
            <View style={styles.metricsGrid}>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>WEIGHT</Text>
                <TextInput
                  style={styles.metricInput}
                  placeholder="70"
                  placeholderTextColor="#cbd5e1"
                  keyboardType="numeric"
                  onChangeText={setWeight}
                />
                <Text style={styles.metricUnit}>kg</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>HEIGHT</Text>
                <TextInput
                  style={styles.metricInput}
                  placeholder="175"
                  placeholderTextColor="#cbd5e1"
                  keyboardType="numeric"
                  onChangeText={setHeight}
                />
                <Text style={styles.metricUnit}>cm</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>AGE</Text>
                <TextInput
                  style={styles.metricInput}
                  placeholder="28"
                  placeholderTextColor="#cbd5e1"
                  keyboardType="numeric"
                  onChangeText={setAge}
                />
                <Text style={styles.metricUnit}>yrs</Text>
              </View>
            </View>
          </View>

          {/* Gender Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="wc" size={20} color="#ff6a00" />
              <Text style={styles.cardTitle}>Gender</Text>
            </View>
            <View style={styles.genderGrid}>
              <TouchableOpacity
                style={[styles.genderButton, gender === "Male" && styles.genderButtonActive]}
                onPress={() => setGender("Male")}
                activeOpacity={0.8}
              >
                <MaterialIcons 
                  name="male" 
                  size={32} 
                  color={gender === "Male" ? "#ff6a00" : "#94a3b8"} 
                />
                <Text style={[styles.genderText, gender === "Male" && styles.genderTextActive]}>
                  Male
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.genderButton, gender === "Female" && styles.genderButtonActive]}
                onPress={() => setGender("Female")}
                activeOpacity={0.8}
              >
                <MaterialIcons 
                  name="female" 
                  size={32} 
                  color={gender === "Female" ? "#ff6a00" : "#94a3b8"} 
                />
                <Text style={[styles.genderText, gender === "Female" && styles.genderTextActive]}>
                  Female
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Goal Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="emoji-events" size={20} color="#ff6a00" />
              <Text style={styles.cardTitle}>What is your goal?</Text>
            </View>
            <View style={styles.optionsList}>
              {goalOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[styles.optionItem, goal === option.id && styles.optionItemActive]}
                  onPress={() => setGoal(option.id)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.optionIconContainer, goal === option.id && styles.optionIconContainerActive]}>
                    <MaterialIcons 
                      name={option.icon} 
                      size={20} 
                      color={goal === option.id ? "#ffffff" : "#ff6a00"} 
                    />
                  </View>
                  <View style={styles.optionContent}>
                    <Text style={[styles.optionTitle, goal === option.id && styles.optionTitleActive]}>
                      {option.title}
                    </Text>
                    <Text style={styles.optionSubtitle}>{option.sub}</Text>
                  </View>
                  <View style={[styles.optionRadio, goal === option.id && styles.optionRadioActive]}>
                    {goal === option.id && <MaterialIcons name="check" size={12} color="#ffffff" />}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Activity Level Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="bolt" size={20} color="#ff6a00" />
              <Text style={styles.cardTitle}>Activity Level</Text>
            </View>
            <View style={styles.activityList}>
              {activityOptions.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.activityItem}
                  onPress={() => setActivityLevel(item.id)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.radioDot, activityLevel === item.id && styles.radioDotActive]}>
                    {activityLevel === item.id && <View style={styles.radioDotInner} />}
                  </View>
                  <Text style={[styles.activityText, activityLevel === item.id && styles.activityTextActive]}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity 
            style={styles.footerButton}
            onPress={OnContinue}
            activeOpacity={0.9}
            disabled={loading}
          >
            <Text style={styles.footerButtonText}>Continue</Text>
            <MaterialIcons name="arrow-forward" size={20} color="#ffffff" />
          </TouchableOpacity>

          <LoadingDialog loading={loading} title="Setting up your plan" />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f7f5',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    paddingTop: 48,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  logoContainer: {
    width: 64,
    height: 64,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  headerLabel: {
    color: '#ff6a00',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    color: '#111827',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 106, 0, 0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  metricInput: {
    width: '100%',
    backgroundColor: '#f8fafc',
    height: 54,
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  metricUnit: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 4,
    fontWeight: '500',
  },
  genderGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  genderButton: {
    flex: 1,
    height: 100,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  genderButtonActive: {
    backgroundColor: 'rgba(255, 106, 0, 0.08)',
    borderColor: '#ff6a00',
  },
  genderText: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: '700',
    color: '#94a3b8',
  },
  genderTextActive: {
    color: '#ff6a00',
  },
  optionsList: {
    gap: 12,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  optionItemActive: {
    backgroundColor: 'rgba(255, 106, 0, 0.05)',
    borderColor: '#ff6a00',
  },
  optionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 106, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionIconContainerActive: {
    backgroundColor: '#ff6a00',
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  optionTitleActive: {
    color: '#111827',
  },
  optionSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  optionRadio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: 'rgba(255, 106, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionRadioActive: {
    backgroundColor: '#ff6a00',
    borderColor: '#ff6a00',
  },
  activityList: {
    gap: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  radioDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioDotActive: {
    borderColor: '#ff6a00',
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    shadowColor: '#ff6a00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  radioDotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ff6a00',
  },
  activityText: {
    fontSize: 15,
    color: '#64748b',
    flex: 1,
  },
  activityTextActive: {
    color: '#111827',
    fontWeight: '700',
  },
  footerButton: {
    margin: 16,
    backgroundColor: '#ff6a00',
    height: 64,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#ff6a00',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  footerButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  },
});
