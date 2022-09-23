import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'underscore';

import { fetchContributors, unmountContributors } from 'redux/actions/contributorAction';

import DropdownAsync from 'components/DropdownAsync';

export default function FilterAuthorList({ currentAuthor, setCurrentAuthor, repo }: any) {
  const dispatch = useDispatch();

  const contributorData = useSelector((state: any) => state.contributorData, _.isEqual);
  const {
    contributors,
    isContributorsFetching,
  }: { contributors: any; isContributorsFetching: any } = contributorData;

  const [authorsList, setAuthorsList]: any = useState([{ label: 'All authors', value: '' }]);

  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contributors?.length) {
      const formattedArr = contributors?.map?.((el: any) => {
        return { value: el?.author?.Name, label: el?.author?.Name };
      });
      setAuthorsList([{ value: '', label: 'All authors' }, ...formattedArr]);
    }
  }, [contributors]);

  useEffect(() => {
    if (repo) {
      getContributorsList(repo);
    }
  }, [repo]);

  useEffect(() => {
    return () => {
      dispatch(unmountContributors());
    };
  }, []);

  const getContributorsList = (repo: any) => {
    if (repo) {
      dispatch(fetchContributors(repo, '', {}));
    }
  };

  return (
    <div className="width-150 relative" ref={sectionRef}>
      <DropdownAsync
        disabled={isContributorsFetching}
        getData={getContributorsList}
        hasMoreData={!authorsList.length}
        loading={isContributorsFetching}
        onClick={(_value, option) => setCurrentAuthor(option)}
        options={authorsList}
        getPopupContainer={() => sectionRef.current as HTMLElement}
        selectedOption={currentAuthor}
        toggleLabel="Select author"
        toggleStyles={{
          background: '#fff',
          fontSize: 12,
          height: '32px',
        }}
        showSearch
        valueKey="value"
        labelKey="label"
        forcePosition
      />
    </div>
  );
}
