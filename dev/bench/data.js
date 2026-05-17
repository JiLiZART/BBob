window.BENCHMARK_DATA = {
  "lastUpdate": 1779047670492,
  "repoUrl": "https://github.com/JiLiZART/BBob",
  "entries": {
    "Benchmark.js Benchmark": [
      {
        "commit": {
          "author": {
            "name": "JiLiZART",
            "username": "JiLiZART"
          },
          "committer": {
            "name": "JiLiZART",
            "username": "JiLiZART"
          },
          "id": "046231181b2e6c3e35c76dc868ce8d68bbd77981",
          "message": "feat: add more parsers to benchmark",
          "timestamp": "2026-05-16T14:21:15Z",
          "url": "https://github.com/JiLiZART/BBob/pull/322/commits/046231181b2e6c3e35c76dc868ce8d68bbd77981"
        },
        "date": 1779047669074,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "regex/parser",
            "value": 3.71,
            "range": "±24.65%",
            "unit": "ops/sec",
            "extra": "15 samples"
          },
          {
            "name": "ya-bbcode",
            "value": 238,
            "range": "±0.77%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "xbbcode/parser",
            "value": 111,
            "range": "±1.34%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "@bbob/parser",
            "value": 162,
            "range": "±1.27%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "js-bbcode-parser",
            "value": 10363,
            "range": "±0.21%",
            "unit": "ops/sec",
            "extra": "95 samples"
          }
        ]
      }
    ]
  }
}