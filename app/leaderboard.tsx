import { Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useGame } from "./context/GameContext";

export default function Leaderboard() {
  const router = useRouter();
  const { players, currentRoundIndex } = useGame();

  const sorted = [...players].sort((a, b) => b.score - a.score);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1A0A2E", padding: 24 }}>
      <Text style={{ color: "#C9963A", fontSize: 13, letterSpacing: 4, textTransform: "uppercase", marginBottom: 8 }}>After Round {currentRoundIndex}</Text>
      <Text style={{ color: "#F0E6FF", fontSize: 36, fontStyle: "italic", marginBottom: 48 }}>Leaderboard</Text>
      {sorted.map((p, i) => (
        <View key={i} style={{ flexDirection: "row", alignItems: "center", width: "100%", backgroundColor: "#2D1B4E", borderWidth: i === 0 ? 1 : 0, borderColor: "#C9963A", borderRadius: 4, padding: 20, marginBottom: 10 }}>
          <Text style={{ color: i === 0 ? "#C9963A" : "#F0E6FF", fontSize: 28, fontWeight: "700", width: 40 }}>{i + 1}</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ color: i === 0 ? "#C9963A" : "#F0E6FF", fontSize: 18, fontWeight: "700" }}>{p.name}</Text>
            <Text style={{ color: "#C9963A", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginTop: 2 }}>{p.type}</Text>
          </View>
          <Text style={{ color: i === 0 ? "#C9963A" : "#F0E6FF", fontSize: 32, fontWeight: "700" }}>{p.score}</Text>
        </View>
      ))}
      <TouchableOpacity onPress={() => router.push("/round")} style={{ backgroundColor: "#C9963A", paddingHorizontal: 48, paddingVertical: 18, width: "100%", alignItems: "center", marginTop: 32 }}>
        <Text style={{ color: "#1A0A2E", fontSize: 16, fontWeight: "700", letterSpacing: 4 }}>NEXT ROUND</Text>
      </TouchableOpacity>
    </View>
  );
}
