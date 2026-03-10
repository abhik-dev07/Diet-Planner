import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input";
import { UserContext } from "@/context/UserContext";
import { api } from "@/convex/_generated/api";
import Colors from "@/shared/Colors";
import {
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useConvex, useMutation } from "convex/react";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
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

      console.log("Calculated Data to Save:", data);
      console.log("Fitness Summary:", metrics.summary);

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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: Colors.SECONDARY }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, padding: 20 }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={require("../../assets/images/logo.png")}
                style={{
                  height: 100,
                  width: 100,
                  marginTop: 8,
                }}
              />
              <Text
                style={{
                  color: Colors.PRIMARY,
                  textAlign: "center",
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                Set Your Preferences
              </Text>
            </View>
          </View>
          <Text
            style={{
              textAlign: "center",
              fontSize: 30,
              fontWeight: "bold",
              marginTop: 30,
            }}
          >
            Tell us about yourself
          </Text>
          <Text
            style={{
              textAlign: "center",
              fontSize: 16,
              color: Colors.GRAY,
            }}
          >
            This help us create your personalized meal plan
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              marginTop: 15,
            }}
          >
            <View style={{ display: "flex", width: "32%" }}>
              <Input
                placeholder={"e.g 70"}
                lable="Weight (kg)"
                onChangeText={setWeight}
                keyboardType="numeric"
              />
            </View>
            <View style={{ display: "flex", width: "32%" }}>
              <Input
                placeholder={"e.g 172 or 5.8"}
                lable="Height (cm or ft.in)"
                onChangeText={setHeight}
                keyboardType="numeric"
              />
            </View>
            <View style={{ display: "flex", width: "32%" }}>
              <Input
                placeholder={"e.g 23"}
                lable="Age"
                onChangeText={setAge}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View
            style={{
              marginTop: 20,
            }}
          >
            <Text
              style={{
                fontWeight: "medium",
                fontSize: 18,
              }}
            >
              Gender
            </Text>
            <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
              <TouchableOpacity
                onPress={() => setGender("Male")}
                style={{
                  borderWidth: 1,
                  borderColor: gender == "Male" ? Colors.BLUE : Colors.GRAY,
                  borderRadius: 10,
                  padding: 15,
                  flex: 1,
                  alignItems: "center",
                }}
              >
                <Ionicons name="male-outline" size={40} color={Colors.BLUE} />
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 5,
                    fontWeight: "500",
                  }}
                >
                  Male
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setGender("Female")}
                style={{
                  borderWidth: 1,
                  borderColor: gender == "Female" ? Colors.PINK : Colors.GRAY,
                  borderRadius: 10,
                  padding: 15,
                  flex: 1,
                  alignItems: "center",
                }}
              >
                <Ionicons name="female-outline" size={40} color={Colors.PINK} />
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 5,
                    fontWeight: "500",
                  }}
                >
                  Female
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ marginTop: 15 }}>
            <Text style={{ fontWeight: "medium", fontSize: 18 }}>
              What's Your Goal?
            </Text>
            <TouchableOpacity
              onPress={() => setGoal("Weight Loss")}
              style={[
                styles.goalContainer,
                {
                  borderColor:
                    goal == "Weight Loss" ? Colors.PRIMARY : Colors.GRAY,
                },
              ]}
            >
              <View
                style={{
                  backgroundColor: "#fae3e5",
                  borderRadius: 99,
                  height: 35,
                  width: 35,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FontAwesome6
                  name="weight-scale"
                  size={18}
                  color={Colors.RED}
                />
              </View>
              <View>
                <Text style={styles.goalText}>Weight Loss</Text>
                <Text style={styles.goalSubText}>
                  Reduce body fat & get leaner
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setGoal("Weight Gain")}
              style={[
                styles.goalContainer,
                {
                  borderColor:
                    goal == "Weight Gain" ? Colors.PRIMARY : Colors.GRAY,
                },
              ]}
            >
              <View
                style={{
                  backgroundColor: "#e3e9ff",
                  borderRadius: 99,
                  height: 35,
                  width: 35,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MaterialCommunityIcons
                  name="silverware-fork-knife"
                  size={19}
                  color={Colors.BLUE}
                />
              </View>
              <View>
                <Text style={styles.goalText}>Weight Gain</Text>
                <Text style={styles.goalSubText}>
                  Increase healthy body mass
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setGoal("Muscle Gain")}
              style={[
                styles.goalContainer,
                {
                  borderColor:
                    goal == "Muscle Gain" ? Colors.PRIMARY : Colors.GRAY,
                },
              ]}
            >
              <View
                style={{
                  backgroundColor: "#dcfae7",
                  borderRadius: 99,
                  height: 35,
                  width: 35,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FontAwesome6 name="dumbbell" size={18} color={Colors.GREEN} />
              </View>
              <View>
                <Text style={styles.goalText}>Muscle Gain</Text>
                <Text style={styles.goalSubText}>
                  Build Muscle & get Stronger
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 20 }}>
            <Text style={{ fontWeight: "medium", fontSize: 18 }}>
              Activity Level
            </Text>
            {[
              {
                id: "Sedentary",
                title: "Sedentary",
                sub: "Office job, little/no exercise",
                icon: "briefcase-outline",
              },
              {
                id: "Lightly Active",
                title: "Lightly Active",
                sub: "Light exercise 1-3 days/week",
                icon: "walk-outline",
              },
              {
                id: "Moderately Active",
                title: "Moderately Active",
                sub: "Moderate exercise 3-5 days/week",
                icon: "fitness-outline",
              },
              {
                id: "Very Active",
                title: "Very Active",
                sub: "Hard exercise 6-7 days/week",
                icon: "flame-outline",
              },
              {
                id: "Extra Active",
                title: "Extra Active",
                sub: "Physical job + 2x daily training",
                icon: "flash-outline",
              },
            ].map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => setActivityLevel(item.id)}
                style={[
                  styles.goalContainer,
                  {
                    borderColor:
                      activityLevel == item.id ? Colors.PRIMARY : Colors.GRAY,
                  },
                ]}
              >
                <View
                  style={{
                    backgroundColor: "#e0f2ff",
                    borderRadius: 99,
                    height: 35,
                    width: 35,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name={item.icon} size={20} color={Colors.BLUE} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.goalText}>{item.title}</Text>
                  <Text style={styles.goalSubText}>{item.sub}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ marginTop: 50 }}>
            <Button
              title={"Continue"}
              onPress={OnContinue}
              icon="arrow-forward"
            />
          </View>
          <LoadingDialog loading={loading} title="Loading" />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  goalContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: Colors.GRAY,
    borderRadius: 15,
    marginTop: 10,
  },
  goalText: {
    fontWeight: "bold",
    fontSize: 20,
  },
  goalSubText: {
    color: Colors.GRAY,
  },
});
