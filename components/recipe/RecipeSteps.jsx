import { FlatList, StyleSheet, Text, View } from "react-native";

export default function RecipeSteps({ recipeDetail }) {
  const steps = recipeDetail?.jsonData?.steps;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Directions</Text>
      <View style={styles.stepsContainer}>
        <View style={styles.timelineLine} />
        <FlatList
          data={steps}
          keyExtractor={(item, index) => index.toString()}
          scrollEnabled={false}
          renderItem={({ item, index }) => (
            <View style={styles.stepRow}>
              <View style={styles.stepNumberContainer}>
                <Text style={styles.stepNumber}>{index + 1}</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Step {index + 1}</Text>
                <Text style={styles.stepText}>{item}</Text>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    paddingBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: "#1c1c1e",
    letterSpacing: -0.3,
    marginBottom: 24,
  },
  stepsContainer: {
    position: 'relative',
    paddingLeft: 4,
  },
  timelineLine: {
    position: 'absolute',
    left: 19,
    top: 32,
    bottom: -16,
    width: 2,
    backgroundColor: '#e2e8f0', // slate-200
  },
  stepRow: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 16,
  },
  stepNumberContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ff6a00',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  stepContent: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: "#1c1c1e",
    marginBottom: 6,
  },
  stepText: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 22,
  },
});
