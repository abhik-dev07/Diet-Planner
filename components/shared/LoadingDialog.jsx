import { useEffect, useState } from "react";
import { ActivityIndicator, Modal, StyleSheet, Text, View } from "react-native";

export default function LoadingDialog({ loading = false, title = "" }) {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <Modal transparent visible={loading} statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <View style={styles.loaderCircle}>
            <ActivityIndicator size="large" color="#ff6a00" />
          </View>
          <Text style={styles.title}>
            {title}
            {dots}
            <Text style={{ opacity: 0 }}>{"." .repeat(3 - dots.length)}</Text>
          </Text>
          <Text style={styles.subtitle}>This may take a moment</Text>

          {/* Simulated Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressLabelRow}>
              <Text style={styles.progressLabelText}>AI PROCESSING</Text>
              <Text style={styles.progressPercent}>60%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '60%' }]} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    paddingTop: 100, // Move it up like in the design
    alignItems: "center",
    backgroundColor: "rgba(15, 23, 42, 0.4)", // Slate-900/40
    paddingHorizontal: 40,
  },
  dialog: {
    padding: 32,
    borderRadius: 28,
    backgroundColor: '#ffffff',
    alignItems: "center",
    width: '100%',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
  },
  loaderCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 106, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    color: "#1c1c1e",
    fontSize: 18,
    fontWeight: '700',
    textAlign: "center",
  },
  subtitle: {
    color: "#64748b",
    fontSize: 14,
    marginTop: 4,
  },
  progressContainer: {
    width: '100%',
    marginTop: 24,
    gap: 8,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabelText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ff6a00',
    letterSpacing: 0.5,
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ff6a00',
  },
  progressBarBg: {
    height: 8,
    width: '100%',
    backgroundColor: 'rgba(255, 106, 0, 0.1)',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#ff6a00',
    borderRadius: 8,
  },
});
