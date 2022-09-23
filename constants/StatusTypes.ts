export enum TestStatusTypes {
  QUARANTINED = 'tests_quarantined',
  BLOCKLISTED = 'tests_blocklisted',
  FAILED = 'tests_failed',
  PASSED = 'tests_passed',
  SKIPPED = 'tests_skipped',
  UNIMPACTED = 'tests_unimpacted',
  IMPACTED = 'total_tests_executed',
  TOTAL = 'total_tests',
}

export enum FlakyTestStatusTypes {
  FLAKY = 'flaky',
  NONFLAKY = 'nonflaky',
  BLOCKLISTED = 'blocklisted',
  SKIPPED = 'skipped',
}

export enum BuildStatusTypes {
  // ABORTED = 'builds_aborted',
  ERROR = 'builds_error',
  FAILED = 'builds_failed',
  INITIATING = 'builds_initiating',
  PASSED = 'builds_passed',
  RUNNING = 'builds_running',
  TOTAL = 'total_builds_executed',
}

export enum TaskStatusTypes {
  // ABORTED = 'aborted',
  ERROR = 'error',
  FAILED = 'failed',
  INITIATING = 'initiating',
  PASSED = 'passed',
  RUNNING = 'running',
}
