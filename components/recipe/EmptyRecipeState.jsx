import Colors from "@/shared/Colors";
import { Image, StyleSheet, Text, View } from "react-native";

const EmptyRecipeState = () => {
  return (
    <View style={styles.container}>
      <View style={styles.emojiCircle}>
        <Text style={styles.emoji}>👨‍🍳</Text>
      </View>
      <Text style={styles.title}>No Recipes Generated Yet</Text>
      <Text style={styles.subtitle}>
        Your AI-crafted culinary creations will appear right here.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    marginTop: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    minHeight: 300,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
  },
  emojiCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 106, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emoji: {
    fontSize: 36,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1c1c1e",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 240,
  },
});

export default EmptyRecipeState;
