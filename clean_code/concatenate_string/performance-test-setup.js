import { performance, PerformanceObserver } from "perf_hooks"
import {
  concat_solution_1,
  concat_solution_2,
  concat_solution_3,
  concat_solution_4,
  concat_solution_5,
  concat_solution_6
} from "./string-concat.js"

const average = (list) => list.reduce((prev, curr) => prev + curr) / list.length

const obs = new PerformanceObserver((list, observer) => {
  const results = {}
  const measurements = list.getEntriesByType('measure')

  for (const measurement of measurements) {
    const name = measurement.name
    const duration = measurement.duration

    if (!results[name]) {
      results[name] = []
    }

    results[name].push(duration)
    results[name] = Array(1).fill(average(results[name]))
  }

  console.log(results) // Check results
});

obs.observe({ entryTypes: ['measure'], buffered: true });

const measureDurations = () => {
  performance.measure("concat_solution_1", "start", "v1")
  performance.measure("concat_solution_2", "v1", "v2")
  performance.measure("concat_solution_3", "v2", "v3")
  performance.measure("concat_solution_4", "v3", "v4")
  performance.measure("concat_solution_5", "v4", "v5")
  performance.measure("concat_solution_6", "v5", "v6")
}

const concatPerformance = (len) => {
  performance.mark("start")

  concat_solution_1(len)
  performance.mark("v1")

  concat_solution_2(len)
  performance.mark("v2")

  concat_solution_3(len)
  performance.mark("v3")

  concat_solution_4(len)
  performance.mark("v4")

  concat_solution_5(len)
  performance.mark("v5")

  concat_solution_6(len)
  performance.mark("v6")

  measureDurations()
}

// Entry:
const len = 10
const rounds = 1000000

for (let i = 0; i < rounds; i++) {
  concatPerformance(len)
}