import { useState, useEffect, useRef } from 'react';

import { getCookieOrgName } from 'helpers/genericHelpers';

import Grid from 'components/Grid';

import getFTMGridConfig from '../services/getFTMGridConfig';
import FTMConfigEdit from './FTMConfigEdit';

const FTMConfigList = ({
  configTypes,
  data,
  deleteConfig,
  editConfig,
  loading,
  repo = '',
  showAddConfig,
  strategies,
}: {
  configTypes: any[];
  data: any[];
  deleteConfig: Function;
  editConfig: Function;
  loading: boolean;
  repo: string;
  showAddConfig: boolean;
  strategies: any[];
}) => {
  const [activeConfig, setActiveConfig] = useState<any>(null);
  const gridRef = useRef(null);

  const onApplyEdit = (activeConfig: any) => {
    const formattedConfig = {
      ...activeConfig,
      auto_quarantine: !!activeConfig.auto_quarantine,
      consecutive_runs: Number(activeConfig.consecutive_runs),
      org: getCookieOrgName(),
      repo: repo,
      threshold: Number(activeConfig.threshold),
    };
    setActiveConfig(null);
    editConfig(formattedConfig);
  };

  const onDelete = (config: any) => {
    deleteConfig({ ...config, org: getCookieOrgName(), repo: repo });
  };

  const listGridConfig = getFTMGridConfig({
    configTypes,
    onDelete,
    onShowEdit: setActiveConfig,
    strategies,
  });

  const gridData = data.map((config) => (config.id === activeConfig?.id ? activeConfig : config));

  useEffect(() => {
    setActiveConfig(null);
  }, [showAddConfig]);

  return (
    <>
      <div ref={gridRef}>
        <Grid
          columnConfig={listGridConfig}
          data={gridData}
          isLoading={loading}
          noDataText="No FTM Configuration present."
        />
      </div>
      {!!activeConfig && (
        <FTMConfigEdit
          configTypes={configTypes}
          config={activeConfig}
          onApply={onApplyEdit}
          onCancel={() => setActiveConfig(null)}
          repo={repo}
        />
      )}
    </>
  );
};

export default FTMConfigList;
