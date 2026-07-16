import { Text, View, TouchableOpacity, Animated } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect, useRef } from "react";
import { useGame } from "./context/GameContext";

export default function Recording() {
  const router = useRouter();
  const { currentPlayer, currentCountry } = useGame();
  const [phase, setPhase] = useState("countdown");
  const [count, setCount] = useState(3);
  const [timeLeft, setTimeLeft] = useState(30);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (phase === "countdown") {
      const interval = setInterval(() => {
        setCount(prev => {
          if (prev <= 1) { clearInterval(interval); setPhase("recording"); return 0; }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === "recording") {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.3, duration: 500, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        ])
      ).start();
      const interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) { clearInterval(interval); setPhase("done"); return 0; }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [phase]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1A0A2E", padding: 24 }}>
      {phase === "countdown" && (
        <View style={{ alignItems: "center" }}>
          <Text style={{ color: "#C9963A", fontSize: 13, letterSpacing: 4, textTransform: "uppercase", marginBottom: 40 }}>
            {currentPlayer ? `${currentPlayer.name}, get in position!` : "Get in position!"}
          </Text>
          <Text style={{ color: "#F0E6FF", fontSize: 160, fontWeight: "700" }}>{count}</Text>
        </View>
      )}
      {phase === "recording" && (
        <View style={{ alignItems: "center" }}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }], marginBottom: 40 }}>
            <Text style={{ fontSize: 60 }}>🔴</Text>
          </Animated.View>
          <Text style={{ color: "#F0E6FF", fontSize: 100, fontWeight: "700" }}>{timeLeft}</Text>
          <Text style={{ color: "#C9963A", fontSize: 13, letterSpacing: 4, textTransform: "uppercase", marginTop: 16 }}>
            {currentCountry ? `${currentCountry.dance}!` : "Dance!"}
          </Text>
        </View>
      )}
      {phase === "done" && (
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 80, marginBottom: 24 }}>🎉</Text>
          <Text style={{ color: "#F0E6FF", fontSize: 32, fontWeight: "700", marginBottom: 48 }}>Time's up!</Text>
          <TouchableOpacity onPress={() => router.push("/reveal")} style={{ backgroundColor: "#C9963A", paddingHorizontal: 48, paddingVertical: 18 }}>
            <Text style={{ color: "#1A0A2E", fontSize: 16, fontWeight: "700", letterSpacing: 4 }}>SEE RESULTS</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
