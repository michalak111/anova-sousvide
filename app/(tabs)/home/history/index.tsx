import { useHistoryStore } from "@/stores/historyStore";
import { FlatList, SafeAreaView, StyleSheet } from "react-native";
import React from "react";
import { HistoryItem } from "@/app/(tabs)/home/history/HistoryItem";

export default function HistoryPage() {
  const { history, remove } = useHistoryStore();

  return (
    <SafeAreaView>
      <FlatList
        data={history}
        renderItem={(info) => <HistoryItem data={info.item} remove={remove} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
    gap: 8,
  },
});
