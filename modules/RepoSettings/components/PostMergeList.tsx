import { useState, useEffect, useRef } from 'react';

import Grid from 'components/Grid';

import getPostmergeGridConfig from '../services/getPostmergeGridConfig';
import validateStrategy from '../utils/validateStrategy';

const PostMergeList = ({
  data,
  deleteStrategy,
  editStrategy,
  loading,
  showAddStrategy,
  strategies,
}: {
  data: any[];
  deleteStrategy: Function;
  editStrategy: Function;
  loading: boolean;
  showAddStrategy: boolean;
  strategies: any[];
}) => {
  const [activeStrategy, setActiveStrategy] = useState<any>(null);
  const gridRef = useRef(null);

  const isValidStrategy = validateStrategy(activeStrategy);

  const onChange = (field: string, value: any) => {
    setActiveStrategy((activeStrategy: any) => ({
      ...activeStrategy,
      [field]: value,
    }));
  };

  const onShowEdit = (activeStrategy: any) => {
    setActiveStrategy({
      ...activeStrategy,
      strategy_name: strategies.find((strategy) => strategy.value === activeStrategy.strategy_name),
    });
  };

  const onCancelEdit = () => {
    setActiveStrategy(null);
  };

  const onApplyEdit = () => {
    const formattedStrategy = {
      ...activeStrategy,
      strategy_name: activeStrategy.strategy_name.value,
    };
    setActiveStrategy(null);
    editStrategy(formattedStrategy);
  };

  const onDelete = (strategy: any) => {
    deleteStrategy(strategy);
  };

  const listGridConfig = getPostmergeGridConfig({
    activeStrategy,
    gridRef,
    isValidStrategy,
    onApplyEdit,
    onCancelEdit,
    onChange,
    onDelete,
    onShowEdit,
    strategies,
  });

  const gridData = data.map((strategy) =>
    strategy.id === activeStrategy?.id ? activeStrategy : strategy
  );

  useEffect(() => {
    setActiveStrategy(null);
  }, [showAddStrategy]);

  return (
    <div ref={gridRef}>
      <Grid
        columnConfig={listGridConfig}
        data={gridData}
        isLoading={loading}
        noDataText="No post merge strategies present."
      />
    </div>
  );
};

export default PostMergeList;
