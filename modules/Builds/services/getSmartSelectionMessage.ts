export default function getSmartSelectionMessage({
  impacted,
  smartSelectionEnabled,
  status,
  total,
}: any) {
  return status === 'error'
    ? 'TAS Smart Selection was disabled for this job due to error in job execution.'
    : smartSelectionEnabled
    ? `TAS Smart Selection intelligently executed only ${impacted}/${total} tests as a part of this Job. ${
        total - impacted
      } tests were skipped as they were not impacted by your code changes.`
    : `All of your tests were impacted by this commit. Hence, ${impacted}/${total} tests were executed.`;
}
