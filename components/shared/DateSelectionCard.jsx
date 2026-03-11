import moment from "moment";
import { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View, StyleSheet } from "react-native";

export default function DateSelectionCard({ setSelectedDate }) {
  const [selectedDate_, setSelectedDate_] = useState(moment().format("DD/MM/YYYY"));
  const [dateList, setDateList] = useState([]);

  useEffect(() => {
    GenerateDates();
  }, []);

  const GenerateDates = () => {
    const result = [];
    for (let i = 0; i < 7; i++) {
      const date = moment().add(i, "days").format("DD/MM/YYYY");
      result.push(date);
    }
    setDateList(result);
    setSelectedDate(result[0]);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={dateList}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const isSelected = selectedDate_ === item;
          const dayName = moment(item, "DD/MM/YYYY").format("ddd");
          const dayNum = moment(item, "DD/MM/YYYY").format("DD");
          const isToday = moment(item, "DD/MM/YYYY").isSame(moment(), "day");

          return (
            <TouchableOpacity
              onPress={() => {
                setSelectedDate(item);
                setSelectedDate_(item);
              }}
              activeOpacity={0.8}
              style={[
                styles.dateItem,
                isSelected && styles.selectedDateItem,
                isToday && !isSelected && styles.todayDateItem,
              ]}
            >
              {isToday && !isSelected && (
                <Text style={styles.todayLabel}>Today</Text>
              )}
              <Text style={[styles.dayText, isSelected && styles.selectedText]}>
                {dayName}
              </Text>
              <Text style={[styles.dateText, isSelected && styles.selectedText]}>
                {dayNum}
              </Text>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item) => item}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    marginBottom: 0,
  },
  listContent: {
    paddingHorizontal: 24,
    gap: 12,
  },
  dateItem: {
    width: 68,
    height: 92,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  todayDateItem: {
    borderColor: 'rgba(255, 106, 0, 0.2)',
    backgroundColor: 'rgba(255, 106, 0, 0.05)',
  },
  selectedDateItem: {
    backgroundColor: '#ff6a00',
    borderColor: '#ff6a00',
    shadowColor: '#ff6a00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  todayLabel: {
    color: '#ff6a00',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  dayText: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: '500',
    marginBottom: 2,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '700',
    color: "#1c1c1e",
  },
  selectedText: {
    color: '#ffffff',
  },
});
