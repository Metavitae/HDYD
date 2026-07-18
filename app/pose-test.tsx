import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "expo-router";
import {
  Camera,
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
  type CameraPosition,
} from "react-native-vision-camera";
import {
  usePoseDetection,
  RunningMode,
  Delegate,
  type PoseDetectionResultBundle,
  type ViewCoordinator,
  type Landmark,
} from "react-native-mediapipe-posedetection";

type ViewPoint = { x: number; y: number };

export default function PoseTest() {
  const router = useRouter();
  const { hasPermission, requestPermission } = useCameraPermission();
  const [cameraPosition, setCameraPosition] = useState<CameraPosition>("front");
  const [points, setPoints] = useState<ViewPoint[]>([]);
  const [posesDetected, setPosesDetected] = useState(0);
  const [inferenceMs, setInferenceMs] = useState<number | null>(null);

  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission, requestPermission]);

  // This package's shipped types disagree with its own README on where
  // landmarks/frame-size land on the result object (top-level vs nested
  // under `results[0]`). Reading both shapes defensively until confirmed
  // which one the native side actually emits.
  const onResults = useCallback((result: PoseDetectionResultBundle, vc: ViewCoordinator) => {
    const r = result as unknown as {
      landmarks?: Landmark[][];
      results?: { landmarks: Landmark[][] }[];
      inputImageWidth?: number;
      inputImageHeight?: number;
      inferenceTime?: number;
    };
    const allPoses = r.landmarks ?? r.results?.[0]?.landmarks ?? [];
    setPosesDetected(allPoses.length);
    setInferenceMs(r.inferenceTime ?? null);

    const pose = allPoses[0];
    if (!pose || !r.inputImageWidth || !r.inputImageHeight) {
      setPoints([]);
      return;
    }
    const frameDims = vc.getFrameDims({
      inferenceTime: r.inferenceTime ?? 0,
      inputImageWidth: r.inputImageWidth,
      inputImageHeight: r.inputImageHeight,
    });
    setPoints(pose.map(lm => vc.convertPoint(frameDims, { x: lm.x, y: lm.y })));
  }, []);

  const onError = useCallback((error: { code: number; message: string }) => {
    console.error("Pose detection error:", error.code, error.message);
  }, []);

  const solution = usePoseDetection(
    { onResults, onError },
    RunningMode.LIVE_STREAM,
    "pose_landmarker_lite.task",
    {
      numPoses: 1,
      minPoseDetectionConfidence: 0.5,
      minPosePresenceConfidence: 0.5,
      minTrackingConfidence: 0.5,
      delegate: Delegate.GPU,
    }
  );

  const device = useCameraDevice(cameraPosition);
  // Rear camera's native max resolution is much higher than front's default,
  // which was driving inference time up (~150ms vs ~70ms). Constrain rear to
  // roughly front's resolution; leave front format selection untouched.
  const rearFormat = useCameraFormat(cameraPosition === "back" ? device : undefined, [
    { videoResolution: { width: 1280, height: 720 } },
  ]);
  const format = cameraPosition === "back" ? rearFormat : undefined;

  useEffect(() => {
    if (device) solution.cameraDeviceChangeHandler(device);
  }, [solution, device]);

  useEffect(() => {
    solution.resizeModeChangeHandler("cover");
  }, [solution]);

  if (!hasPermission) {
    return (
      <View style={styles.center}>
        <Text style={styles.info}>Waiting for camera permission…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {device == null ? (
        <Text style={styles.info}>Loading camera…</Text>
      ) : (
        <Camera
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
          device={device}
          format={format}
          pixelFormat="rgb"
          isActive={true}
          frameProcessor={solution.frameProcessor}
          onLayout={solution.cameraViewLayoutChangeHandler}
          onOutputOrientationChanged={solution.cameraOrientationChangedHandler}
          photo={true}
        />
      )}
      {points.map((p, i) => (
        <View key={i} style={[styles.dot, { left: p.x - 4, top: p.y - 4 }]} />
      ))}
      <View style={styles.hud}>
        <Text style={styles.hudText}>camera: {cameraPosition}</Text>
        <Text style={styles.hudText}>poses: {posesDetected}</Text>
        <Text style={styles.hudText}>
          inference: {inferenceMs !== null ? `${inferenceMs.toFixed(1)}ms` : "—"}
        </Text>
      </View>
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setCameraPosition(p => (p === "front" ? "back" : "front"))}
        >
          <Text style={styles.buttonText}>
            Switch to {cameraPosition === "front" ? "rear" : "front"} camera
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.exitButton]} onPress={() => router.back()}>
          <Text style={[styles.buttonText, styles.exitButtonText]}>Exit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1A0A2E" },
  info: { color: "#F0E6FF", fontSize: 16 },
  dot: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00FF88",
  },
  hud: {
    position: "absolute",
    top: 48,
    left: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 6,
  },
  hudText: { color: "#F0E6FF", fontSize: 13 },
  controls: {
    position: "absolute",
    bottom: 40,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#C9963A",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 8,
  },
  exitButton: { backgroundColor: "#444" },
  buttonText: { color: "#1A0A2E", fontWeight: "700" },
  exitButtonText: { color: "#F0E6FF" },
});
