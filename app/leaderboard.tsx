import { Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useGame } from "./context/GameContext";

export default function Leaderboard() {
  const router = useRouter();
  const { players, currentRoundIndex } = useGame();

  const sorted = [...players].sort((a, b) => b.score - a.score);

  return (
    <View style={{ flex: 1, justifyContent: "center", backgroundColor: "#1A0A2E", padding: 14 }}>
      <Text style={{ color: "#C9963A", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", marginBottom: 4, textAlign: "center" }}>After Round {currentRoundIndex}</Text>
      <Text style={{ color: "#F0E6FF", fontSize: 20, fontStyle: "italic", marginBottom: 8, textAlign: "center" }}>Leaderboard</Text>
      {sorted.map((p, i) => (
        <View key={i} style={{ flexDirection: "row", alignItems: "center", width: "100%", backgroundColor: "#2D1B4E", borderWidth: i === 0 ? 1 : 0, borderColor: "#C9963A", borderRadius: 4, padding: 6, marginBottom: 5 }}>
          <Text style={{ color: i === 0 ? "#C9963A" : "#F0E6FF", fontSize: 15, fontWeight: "700", width: 26 }}>{i + 1}</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ color: i === 0 ? "#C9963A" : "#F0E6FF", fontSize: 12, fontWeight: "700" }}>{p.name}</Text>
            <Text style={{ color: "#C9963A", fontSize: 8, letterSpacing: 2, textTransform: "uppercase" }}>{p.type}</Text>
          </View>
          <Text style={{ color: i === 0 ? "#C9963A" : "#F0E6FF", fontSize: 16, fontWeight: "700" }}>{p.score}</Text>
        </View>
      ))}
      <TouchableOpacity onPress={() => router.push("/round")} style={{ backgroundColor: "#C9963A", paddingHorizontal: 48, paddingVertical: 10, width: "100%", alignItems: "center", marginTop: 10 }}>
        <Text style={{ color: "#1A0A2E", fontSize: 13, fontWeight: "700", letterSpacing: 3 }}>NEXT ROUND</Text>
      </TouchableOpacity>
    </View>
  );
}
