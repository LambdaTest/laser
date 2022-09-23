/**
 * Validations for FTM setting
 * - branch               required
 * - algo_name            required
 * - threshold            required, number between 1 and 200 (inclusive)
 * - consecutive_runs     required, number between 1 and 50 (inclusive)
 */
export default function validateConfig(config: any): boolean {
  if (
    !config ||
    !config.branch ||
    !config.algo_name ||
    !config.threshold ||
    isNaN(config.threshold) ||
    config.threshold < 1 ||
    config.threshold > 200 ||
    !config.consecutive_runs ||
    isNaN(config.consecutive_runs) ||
    config.consecutive_runs < 1 ||
    config.consecutive_runs > 50
  ) {
    return false;
  }

  return true;
}
