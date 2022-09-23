import moment from 'moment';

import TasLink from '../../../components/TasLink';
import Duration from 'components/Duration';

import { IColumnConfig } from '../../../components/Grid';
import BuildCellRenderer from '../components/BuildCellRenderer';
import CommitCellRenderer from '../components/CommitCellRenderer';
import UnitCellRenderer from '../components/UnitCellRenderer';
import UserCellRenderer from '../components/UserCellRenderer';

import AnalyticsTabsToShow from '../constants/AnalyticsTabsToShow';

const AnalyticsTableConfig: { [key: string]: Function } = {
  [AnalyticsTabsToShow.SLOWEST_TESTS]: (): IColumnConfig[] => [
    {
      header: 'Test Name',
      key: 'name',
      width: '40%',
      cellRenderer: ({ value }) => (
        <TasLink
          addDots
          id={value.id}
          path="tests"
          text={value.name}
          textLength={30}
          tooltipProps={{
            'data-effect': 'solid',
            'data-place': 'top',
            'data-tip': value.name,
          }}
        />
      ),
      cellValueFormatter: (_value: any, rowData: any) => rowData,
    },
    {
      header: 'Commit ID',
      key: 'debut_commit',
      width: '20%',
      cellRenderer: (props) => <CommitCellRenderer {...props} />,
    },
    {
      header: 'Max Execution Time',
      key: 'max_execution_time',
      cellRenderer: (props) => <UnitCellRenderer {...props} unit="" />,
      cellValueFormatter: (_value: any, rowData: any) => {
        return <Duration value={rowData.execution_details?.duration} />;
      },
    },
    {
      header: 'Last Executed',
      key: 'executed',
      cellValueFormatter: (_value: any, rowData: any) =>
        moment(rowData.execution_details?.created_at)?.fromNow(),
    },
    {
      header: 'Contributor',
      key: 'contributor',
      cellRenderer: (props) => <UserCellRenderer showTooltip={true} {...props} />,
      cellValueFormatter: (_value: any, rowData: any) => {
        return rowData.execution_details.commit_author;
      },
    },
  ],
  [AnalyticsTabsToShow.FAILING_TESTS]: (): IColumnConfig[] => [
    {
      header: 'Test Name',
      key: 'name',
      width: '40%',
      cellRenderer: ({ value }) => (
        <TasLink
          addDots
          id={value.id}
          path="tests"
          text={value.name}
          textLength={30}
          tooltipProps={{
            'data-effect': 'solid',
            'data-place': 'top',
            'data-tip': value.name,
          }}
        />
      ),
      cellValueFormatter: (_value: any, rowData: any) => rowData,
    },
    {
      header: 'Commit ID',
      key: 'debut_commit',
      width: '30%',
      cellRenderer: (props) => <CommitCellRenderer {...props} />,
    },
    {
      header: 'Times Failed',
      key: 'times_failed',
      cellValueFormatter: (_value: any, rowData: any) => rowData.execution_meta?.tests_failed,
    },
    {
      header: 'Last Failed',
      key: 'last_failed',
      cellValueFormatter: (_value: any, rowData: any) =>
        moment(rowData.execution_details?.created_at)?.fromNow(),
    },
  ],
  [AnalyticsTabsToShow.FAILED_BUILDS]: (): IColumnConfig[] => [
    {
      header: 'Contributor',
      key: 'commit_author',
      width: '30%',
      cellRenderer: (props) => <UserCellRenderer showTooltip={true} {...props} />,
    },
    {
      header: 'Job ID',
      key: 'builds_list',
      width: '30%',
      cellRenderer: (props) => <BuildCellRenderer {...props} />,
    },
    {
      header: 'Job Failure',
      key: 'times_build_failed',
      cellRenderer: (props) => (
        <UnitCellRenderer {...props} unit={`${props.value <= 1 ? 'time' : 'times'}`} />
      ),
      cellValueFormatter: (_value: any, rowData: any) =>
        rowData.build_execution_status?.builds_failed,
    },
    {
      header: 'Last Job Failed',
      key: 'last_build_failed',
      cellValueFormatter: (_value: any, rowData: any) => {
        return moment(rowData.created_at).fromNow();
      },
    },
  ],
};

export default function getAnalyticsTableConfig(key: string, repo: string): IColumnConfig[] {
  return AnalyticsTableConfig[key]({ repo });
}
