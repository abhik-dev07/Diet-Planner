import Colors from "@/shared/Colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, StyleSheet, View } from "react-native";

export default function GanerateRecipeCard() {
  const router = useRouter();
  
  return (
    <TouchableOpacity
      onPress={() => router.push("/generate-ai-recipe")}
      style={styles.container}
      activeOpacity={0.9}
    >
      <View style={styles.content}>
        <View style={styles.iconBox}>
          <MaterialIcons name="auto-awesome" color="#ffffff" size={24} />
        </View>
        <View style={styles.textBlock}>
          <Text style={styles.title}>AI Recipe Generator</Text>
          <Text style={styles.subtitle}>
            Create custom meals based on your cravings in seconds
          </Text>
        </View>
        <View style={styles.arrowIcon}>
          <MaterialIcons name="chevron-right" size={24} color="#64748b" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#ff6a00',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ff6a00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  textBlock: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1c1c1e',
    letterSpacing: -0.3,
  },
  subtitle: {
    color: '#64748b',
    fontSize: 13,
    marginTop: 2,
    lineHeight: 18,
  },
  arrowIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
