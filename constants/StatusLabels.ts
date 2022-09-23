export enum TestStatusLabels {
  QUARANTINED = 'Quarantined',
  BLOCKLISTED = 'Blocklisted',
  FAILED = 'Failed',
  PASSED = 'Passed',
  SKIPPED = 'Skipped',
  UNIMPACTED = 'Unimpacted',
  IMPACTED = 'Impacted',
  TOTAL = 'Total Tests',
}

export enum FlakyTestStatusLabels {
  FLAKY = 'Flaky',
  NONFLAKY = 'Stable',
  BLOCKLISTED = 'Blocklisted',
  SKIPPED = 'Skipped',
}

export enum BuildStatusLabels {
  // ABORTED = 'Aborted',
  ERROR = 'TAS Error',
  FAILED = 'Failed',
  INITIATING = 'Queued',
  PASSED = 'Passed',
  RUNNING = 'Running',
  TOTAL = 'Total Builds',
}

export enum TaskStatusLabels {
  // ABORTED = 'Aborted',
  ERROR = 'TAS Error',
  FAILED = 'Failed',
  INITIATING = 'Queued',
  PASSED = 'Passed',
  RUNNING = 'Running',
}