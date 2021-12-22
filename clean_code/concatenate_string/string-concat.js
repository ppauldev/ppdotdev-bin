import { performance, PerformanceObserver } from "perf_hooks"

const step1 = "start"
const step2 = "version1"
const step3 = "version2"
const step4 = "version3"
const step5 = "version4"
const step6 = "version5"
const step7 = "version6"

const performanceResults = {
  "version1": [],
  "version2": [],
  "version3": [],
  "version4": [],
  "version5": [],
  "version6": [],
}

const average = (list) => list.reduce((prev, curr) => prev + curr) / list.length;

const obs = new PerformanceObserver((list, observer) => {
  const measureResults = list.getEntriesByType('measure');

  for (const measureResult of measureResults) {
    const name = measureResult.name
    const duration = measureResult.duration
    performanceResults[name].push(duration)
    const avg = average(performanceResults[name])
    performanceResults[name] = Array(1).fill(avg)
  }

  console.log(performanceResults) // Check results
});
obs.observe({ entryTypes: ['measure'], buffered: true });

const version1 = (len) => {
  let stepColumns = ""

  for (let i = 1; i <= len; i++) {
    stepColumns += `,${i}`
  }

  return stepColumns.replace(",", "") // replaces only 1st occurence
}

const version2 = (len) => {
  return Array.from({ length: len }, (_, i) => i + 1)
}

const version3 = (len) => {
  return Array.from(Array(len + 1).keys()).slice(1)
}

const version4 = (len) => {
  return [...Array(len + 1).keys()].slice(1)
}

const version5 = (len) => {
  return [...Array(len)].map((_, i) => ++i)
  //return Array.from(Array(len)).map((_, i) => ++i) // no difference in performance
}

const version6 = (len) => {
  return [...Array(len + 1).keys()].slice(1)
}

const measureStepDurations = () => {
  performance.measure("version1", step1, step2)
  performance.measure("version2", step2, step3)
  performance.measure("version3", step3, step4)
  performance.measure("version4", step4, step5)
  performance.measure("version5", step5, step6)
  performance.measure("version6", step6, step7)
}

const concatPerformance = () => {
  performance.mark(step1)

  version1(10)
  performance.mark(step2)

  version2(10)
  performance.mark(step3)

  version3(10)
  performance.mark(step4)

  version4(10)
  performance.mark(step5)

  version5(10)
  performance.mark(step6)

  version6(10)
  performance.mark(step7)

  measureStepDurations()
}

for (let i = 0; i < 1000000; i++) {
  concatPerformance()
}

/*
in milliseconds:

1.
{
  version1: [ 0.0015734043582879415 ],
  version2: [ 0.0018691464018534883 ],
  version3: [ 0.001538877949225019 ],
  version4: [ 0.0015920885007500768 ],
  version5: [ 0.0012868567147981342 ],
  version6: [ 0.001502588013619421 ]
}

2.
{
  version1: [ 0.0016067179500575545 ],
  version2: [ 0.001842534949851398 ],
  version3: [ 0.0015062909307477763 ],
  version4: [ 0.001582429475979735 ],
  version5: [ 0.0012919666375556167 ],
  version6: [ 0.001530085324590058 ]
}

3.
{
  version1: [ 0.0015749629766403834 ],
  version2: [ 0.001839513736587578 ],
  version3: [ 0.0015211544036645111 ],
  version4: [ 0.001547925392900752 ],
  version5: [ 0.00127334113729455 ],
  version6: [ 0.0015594762560950121 ]
}
*/