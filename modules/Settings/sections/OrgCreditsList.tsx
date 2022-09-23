import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import _ from 'underscore';
import { areEqual, FixedSizeList as List } from 'react-window';
import debounce from 'lodash.debounce';
import InfiniteLoader from 'react-window-infinite-loader';
import moment from 'moment';

import { fetchCreditsUsageByOrgsDetails, unmountSettings } from 'redux/actions/settingsAction';
import DateFormats from 'constants/DateFormats';
import usePrevious from 'hooks/usePrevious';
import { getCookieGitProvider, getCookieOrgName } from 'helpers/genericHelpers';

import Loader from 'components/Loader';
import NoData from 'components/Nodata';
import PeriodFilter, { TRange } from 'components/PeriodRangeFilter';

import OrgCreditsRow from '../components/OrgCreditRow';

const LOADED = 2;

let itemStatusMap: { [key: number]: number } = {};
const isItemLoaded = (index: number) => !!itemStatusMap[index];

const setItemLoadedStatusForRecentlyLoadedPage = (list: any[]) => {
  for (let index = list.length && list.length - 11; index < list.length; index++) {
    itemStatusMap[index] = LOADED;
  }
};

const ItemRow = (props: any) => {
  const { data, gitProvider, index, orgName, style } = props || {};
  let label;
  const dataItem = data[index];
  if (itemStatusMap[index] === LOADED && dataItem) {
    label = (
      <OrgCreditsRow data={dataItem} key={index} gitProvider={gitProvider} orgName={orgName} />
    );
  } else {
    label = (
      <Loader additionalClassesToAdd="px-20 py-10" length={1} key={index} loader_for="settings" />
    );
  }
  return (
    <div className="ListItem" style={style}>
      {label}
    </div>
  );
};

const OrgCreditsList = () => {
  const dispatch = useDispatch();
  const { settingsData }: any = useSelector((state) => state, _.isEqual);
  const { creditsByOrgData, creditsByOrgMetadata, areCreditsByOrgLoading } = settingsData;

  const prevAreCreditsByOrgLoading = usePrevious(areCreditsByOrgLoading);

  const [periodRange, setPeriodRange] = useState<TRange>(() => [
    moment().subtract(1, 'month').format(DateFormats.DATE_TIME),
    moment().format(DateFormats.DATE_TIME),
  ]);

  const orgName = getCookieOrgName();
  const gitProvider = getCookieGitProvider();

  const fetchData = (cursor = null) => {
    const [startDate, endDate] = periodRange;
    dispatch(fetchCreditsUsageByOrgsDetails({ endDate, nextCursor: cursor, startDate }));
  };

  const fetchNextPageData = useCallback(
    debounce(() => {
      fetchData(creditsByOrgMetadata.next_cursor);
    }, 500),
    [creditsByOrgMetadata.next_cursor]
  );

  useEffect(() => {
    return fetchNextPageData.cancel;
  }, [creditsByOrgMetadata.next_cursor]);

  useEffect(() => {
    return () => {
      dispatch(unmountSettings());
      itemStatusMap = {};
    };
  }, []);

  useEffect(() => {
    itemStatusMap = {};
    fetchData();
  }, [periodRange]);

  const getDisplayLabel = () => {
    let el = document.getElementById('tas_period_filter_label');
    //@ts-ignore
    return el && el?.textContent;
  }

  /**
   * @description
   * - This code is used to set item loading status for recently fetched page, when loading completes
   * - Not doing it in useEffect because want it before the list is rendered
   */
  if (prevAreCreditsByOrgLoading && !areCreditsByOrgLoading) {
    setItemLoadedStatusForRecentlyLoadedPage(creditsByOrgData);
  }

  let contentDom;
  if (creditsByOrgData && creditsByOrgData.length === 0 && !areCreditsByOrgLoading) {
    contentDom =  <div className="inline-flex bg-white w-full justify-center items-center radius-3" style={{height: '78vh'}}><NoData msg={`No usage data found for ${getDisplayLabel()}.`} /></div>;
  } else {
    contentDom = (
      <div>
        <div className="flex justify-between items-center bg-white px-20 py-10  radius-3 rounded-b-none border-b text-size-12 text-tas-400 font-medium">
          <div className="px-15 w-2/12">
            <span className="w-full leading-none inline-flex items-center">Job ID</span>
          </div>
          <div className="px-15 w-2/12">
            <span className="w-full leading-none inline-flex items-center">Commit ID</span>
          </div>
          <div className="px-15  w-3/12">
            <span className="w-full leading-none inline-flex items-center">System Config</span>
          </div>
          <div className="px-15  w-2/12">
            <span className="w-full leading-none inline-flex items-center">Duration</span>
          </div>
          <div className="px-15  w-2/12">
            <span className="w-full leading-none inline-flex items-center">Credits</span>
          </div>
        </div>
        {areCreditsByOrgLoading && !creditsByOrgData.length ? (
          <Loader additionalClassesToAdd="px-20 py-10" loader_for="settings" />
        ) : (
          ''
        )}
        {creditsByOrgData.length ? (
          <InfiniteLoader
            loadMoreItems={fetchNextPageData}
            isItemLoaded={isItemLoaded}
            itemCount={
              creditsByOrgMetadata?.next_cursor
                ? creditsByOrgData?.length + 1
                : creditsByOrgData?.length
            }
          >
            {({ onItemsRendered, ref }) => (
              <List
                className="List designed-scroll"
                height={window.innerHeight - 235}
                itemCount={
                  creditsByOrgMetadata?.next_cursor
                    ? creditsByOrgData?.length + 1
                    : creditsByOrgData?.length
                }
                itemSize={45}
                onItemsRendered={onItemsRendered}
                ref={ref}
                width={`100%`}
              >
                {React.memo(
                  (props: any) => (
                    <ItemRow
                      {...props}
                      data={creditsByOrgData}
                      gitProvider={gitProvider}
                      orgName={orgName}
                    />
                  ),
                  areEqual
                )}
              </List>
            )}
          </InfiniteLoader>
        ) : (
          ''
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-15">
        <PeriodFilter onChange={setPeriodRange} label="Showing usage for - " value={periodRange} />
      </div>
      <div>{contentDom}</div>
    </div>
  );
};

export default OrgCreditsList;
