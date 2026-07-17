import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { useGame } from "./context/GameContext";
import type { PlayerType } from "./context/GameContext";

// Fallback pool, used until (and unless) the daily-generated pool loads
// successfully. Never delete this — it's what keeps the game playable if
// the fetch fails, the JSON is missing, or it's gone stale.
const FALLBACK_SOLO_NAMES = [
  "Two Left Feets", "Reluctant Baryshnikov", "Accidental Flossing",
  "Twerkulese", "Fred Astep", "Shakira Shakira", "John Travoltage", "Beyonslay"
];

const FALLBACK_GROUP_NAMES = [
  "The Wobbling Dead", "WiFi Password", "Unexpected Turbulence",
  "Technically Dancing", "The Reluctant Beyoncés", "Sober at a Wedding",
  "Three Guys One Rhythm", "Graceful Disaster"
];

// Public content repo, updated daily by a GitHub Action (see
// /scripts/generate-player-names.mjs and .github/workflows). Served via
// jsDelivr's GitHub CDN since raw.githubusercontent.com has no real caching.
const PLAYER_NAMES_URL = "https://cdn.jsdelivr.net/gh/Metavitae/hdyd-content@main/playerNames.json";
const STALE_AFTER_MS = 1000 * 60 * 60 * 24 * 7; // 7 days — a few missed daily runs is fine, weeks of silence isn't

function isValidNameList(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(n => typeof n === "string" && n.trim().length > 0)
  );
}

export default function Players() {
  const router = useRouter();
  const { mode: modeParam } = useLocalSearchParams<{ mode?: string }>();
  const { players, addPlayer, mode, setMode } = useGame();
  const [step, setStep] = useState("type");
  const [currentType, setCurrentType] = useState<PlayerType | null>(null);
  const [shuffles, setShuffles] = useState(0);
  const [shownNames, setShownNames] = useState<string[]>([]);
  const [soloNames, setSoloNames] = useState<string[]>(FALLBACK_SOLO_NAMES);
  const [groupNames, setGroupNames] = useState<string[]>(FALLBACK_GROUP_NAMES);

  useEffect(() => {
    if ((modeParam === "pure" || modeParam === "crowd") && modeParam !== mode) {
      setMode(modeParam);
    }
  }, [modeParam]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(PLAYER_NAMES_URL);
        if (!res.ok) throw new Error(`status ${res.status}`);
        const data = await res.json();
        const generatedAt = new Date(data?.generatedAt).getTime();
        const isFresh = Number.isFinite(generatedAt) && Date.now() - generatedAt < STALE_AFTER_MS;
        if (!cancelled && isFresh && isValidNameList(data.solo) && isValidNameList(data.group)) {
          setSoloNames(data.solo);
          setGroupNames(data.group);
        }
      } catch {
        // Network error, malformed JSON, missing file, etc. — the fallback
        // lists already in state stay in place, so the game never breaks.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const takenNames = players.map(p => p.name);

  const getAvailable = (type: PlayerType, taken: string[]) => {
    const pool = type === "solo" ? soloNames : groupNames;
    return pool.filter(n => !taken.includes(n));
  };

  const selectType = (type: PlayerType) => {
    setCurrentType(type);
    const available = getAvailable(type, takenNames);
    setShownNames(available.sort(() => Math.random() - 0.5).slice(0, 8));
    setShuffles(0);
    setStep("name");
  };

  const pickName = (name: string) => {
    if (currentType) {
      addPlayer(name, currentType);
    }
    setStep("type");
  };

  const shuffle = () => {
    if (shuffles < 2 && currentType) {
      setShuffles(shuffles + 1);
      const available = getAvailable(currentType, takenNames);
      setShownNames([...available].sort(() => Math.random() - 0.5).slice(0, 8));
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#1A0A2E", padding: 20, justifyContent: "center" }}>
      {step === "type" && (
        <View style={{ width: "100%" }}>
          {players.length > 0 && (
            <View style={{ marginBottom: 16 }}>
              <Text style={{ color: "#C9963A", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", marginBottom: 6 }}>Players</Text>
              {/* Roster grows with player count and has no upper bound, unlike the
                  rest of this screen — this is the one place on the page that may
                  need its own small internal scroll; everything else (header,
                  buttons) always stays fully visible and the page itself never scrolls. */}
              <ScrollView style={{ maxHeight: 130 }} showsVerticalScrollIndicator={false}>
                {players.map((p, i) => (
                  <Text key={i} style={{ color: "#F0E6FF", fontSize: 14, marginBottom: 4 }}>
                    {i + 1}. {p.name} <Text style={{ color: "#C9963A", fontSize: 11 }}>({p.type})</Text>
                  </Text>
                ))}
              </ScrollView>
            </View>
          )}
          <Text style={{ color: "#C9963A", fontSize: 12, letterSpacing: 3, textTransform: "uppercase", marginBottom: 8, textAlign: "center" }}>
            {players.length === 0 ? "First Player" : "Next Player"}
          </Text>
          <Text style={{ color: "#F0E6FF", fontSize: 26, fontStyle: "italic", marginBottom: 20, textAlign: "center" }}>Solo or Group?</Text>
          <TouchableOpacity onPress={() => selectType("solo")} style={{ backgroundColor: "#C9963A", padding: 16, marginBottom: 10, alignItems: "center" }}>
            <Text style={{ color: "#1A0A2E", fontSize: 16, fontWeight: "700", letterSpacing: 3 }}>SOLO</Text>
            <Text style={{ color: "#1A0A2E", fontSize: 11, marginTop: 4, opacity: 0.7 }}>One dancer</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => selectType("group")} style={{ borderWidth: 1, borderColor: "#C9963A", padding: 16, alignItems: "center" }}>
            <Text style={{ color: "#C9963A", fontSize: 16, fontWeight: "700", letterSpacing: 3 }}>GROUP</Text>
            <Text style={{ color: "#F0E6FF", fontSize: 11, marginTop: 4, opacity: 0.7 }}>Two or more dancers</Text>
          </TouchableOpacity>
          {players.length > 0 && (
            <TouchableOpacity onPress={() => router.push("/round")} style={{ marginTop: 16, alignItems: "center", padding: 10 }}>
              <Text style={{ color: "#C9963A", fontSize: 12, letterSpacing: 3, textTransform: "uppercase" }}>Start Game →</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {step === "name" && (
        <View style={{ width: "100%" }}>
          <Text style={{ color: "#C9963A", fontSize: 12, letterSpacing: 3, textTransform: "uppercase", marginBottom: 10, textAlign: "center" }}>Pick Your Name</Text>
          {shownNames.map((name, i) => (
            <TouchableOpacity key={i} onPress={() => pickName(name)} style={{ borderWidth: 1, borderColor: "#C9963A", padding: 11, marginBottom: 6, alignItems: "center" }}>
              <Text style={{ color: "#F0E6FF", fontSize: 14, fontWeight: "600" }}>{name}</Text>
            </TouchableOpacity>
          ))}
          {shuffles < 2 && (
            <TouchableOpacity onPress={shuffle} style={{ marginTop: 8, alignItems: "center", padding: 10 }}>
              <Text style={{ color: "#C9963A", fontSize: 12, letterSpacing: 3 }}>Shuffle ({2 - shuffles} left)</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}
