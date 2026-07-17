import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useGame } from "./context/GameContext";

export default function Leaderboard() {
  const router = useRouter();
  const { players, currentRoundIndex } = useGame();

  const sorted = [...players].sort((a, b) => b.score - a.score);

  return (
    <View style={{ flex: 1, justifyContent: "center", backgroundColor: "#1A0A2E", padding: 20 }}>
      <Text style={{ color: "#C9963A", fontSize: 12, letterSpacing: 3, textTransform: "uppercase", marginBottom: 6, textAlign: "center" }}>After Round {currentRoundIndex}</Text>
      <Text style={{ color: "#F0E6FF", fontSize: 28, fontStyle: "italic", marginBottom: 16, textAlign: "center" }}>Leaderboard</Text>
      {/* Row count grows with player count and has no upper bound, unlike the
          rest of this screen — this is the one place that may need its own
          small internal scroll; the header and NEXT ROUND button always stay
          fully visible and the page itself never scrolls. */}
      <ScrollView style={{ maxHeight: 380 }} showsVerticalScrollIndicator={false}>
        {sorted.map((p, i) => (
          <View key={i} style={{ flexDirection: "row", alignItems: "center", width: "100%", backgroundColor: "#2D1B4E", borderWidth: i === 0 ? 1 : 0, borderColor: "#C9963A", borderRadius: 4, padding: 12, marginBottom: 8 }}>
            <Text style={{ color: i === 0 ? "#C9963A" : "#F0E6FF", fontSize: 20, fontWeight: "700", width: 32 }}>{i + 1}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ color: i === 0 ? "#C9963A" : "#F0E6FF", fontSize: 15, fontWeight: "700" }}>{p.name}</Text>
              <Text style={{ color: "#C9963A", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", marginTop: 1 }}>{p.type}</Text>
            </View>
            <Text style={{ color: i === 0 ? "#C9963A" : "#F0E6FF", fontSize: 22, fontWeight: "700" }}>{p.score}</Text>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity onPress={() => router.push("/round")} style={{ backgroundColor: "#C9963A", paddingHorizontal: 48, paddingVertical: 14, width: "100%", alignItems: "center", marginTop: 16 }}>
        <Text style={{ color: "#1A0A2E", fontSize: 15, fontWeight: "700", letterSpacing: 3 }}>NEXT ROUND</Text>
      </TouchableOpacity>
    </View>
  );
}
