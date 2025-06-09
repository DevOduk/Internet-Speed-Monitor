import { useEffect, useState } from "react";

function App() {
  const [speedMbps, setSpeedMbps] = useState(0);

  const testDownloadSpeed = async () => {
    const fileSizeBytes = 50 * 1024 * 1024; // 50MB
    const url = "https://internet-speed-monitor-six.vercel.app/testfile-50mb.bin" + Date.now(); // prevent caching
    const startTime = performance.now();

    try {
      const response = await fetch(url);
      const reader = response.body.getReader();
      let received = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        received += value.length;
      }
      const endTime = performance.now();
      const durationSeconds = (endTime - startTime) / 1000;
      const bitsLoaded = received * 8;
      const speed = bitsLoaded / durationSeconds / 1_000_000; // Mbps
      setSpeedMbps(speed.toFixed(2));
    } catch (err) {
      console.error("Speed test error:", err);
      setSpeedMbps(0);
    }
  };

  useEffect(() => {
    testDownloadSpeed();
    const interval = setInterval(testDownloadSpeed, 5000); // every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Internet Speed Meter</h1>
      <p>{speedMbps} Mbps</p>
    </div>
  );
}

export default App;
