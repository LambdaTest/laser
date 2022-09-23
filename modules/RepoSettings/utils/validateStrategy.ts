export default function validateStrategy(strategy: any): boolean {
  if (!strategy || !strategy.threshold || isNaN(strategy.threshold) || strategy.threshold < 1) {
    return false;
  }

  return strategy.branch && strategy.strategy_name;
}
