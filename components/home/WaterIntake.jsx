import Colors from "@/shared/Colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function WaterIntake() {
  const [glasses, setGlasses] = useState(6);
  const target = 10;

  const addGlass = () => {
    if (glasses < target) {
      setGlasses(glasses + 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.iconBox}>
          <MaterialIcons name="water-drop" size={24} color="#ff6a00" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Water Intake</Text>
          <Text style={styles.subtitle}>{glasses} of {target} glasses</Text>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.addButton} 
        onPress={addGlass}
        activeOpacity={0.8}
      >
        <MaterialIcons name="add" size={24} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 106, 0, 0.05)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 106, 0, 0.1)',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 106, 0, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    gap: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1c1c1e',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ff6a00',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#ff6a00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
