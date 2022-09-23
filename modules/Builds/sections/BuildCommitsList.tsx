import InfiniteScroll from 'react-infinite-scroller';

import EllipsisText from '../../../components/EllipsisText';

import { statusFound } from '../../../redux/helper';

interface BuildCommitsListProps {
  hasMoreData: boolean;
  isLoading: boolean;
  list: any[];
  loadMore: () => void;
  onSelect: (item: any) => void;
  selected: any;
}

const BuildCommitsList = ({
  hasMoreData,
  isLoading,
  list,
  loadMore,
  onSelect,
  selected,
}: BuildCommitsListProps) => {
  return (
    <div className="commit__list bg-white px-10 py-15 flex flex-col rounded-md">
      <span className="block mb-10 pl-5">Commits</span>
      <ul className="designed-scroll pr-10 flex-1 designed-scroll-commit-list">
        <InfiniteScroll
          getScrollParent={() => document.querySelector('.designed-scroll-commit-list')}
          hasMore={hasMoreData && !isLoading}
          initialLoad
          loader={<div className="loader"></div>}
          loadMore={hasMoreData && !isLoading ? loadMore : () => {}}
          pageStart={0}
          threshold={50}
          useWindow={false}
        >
          {list &&
            list.length > 0 &&
            list.map((el: any) => (
              <li
                className={`cursor-pointer ${el.status} ${
                  selected.commit_id == el.commit_id ? 'active' : ''
                } rounded`}
                key={el.commit_id}
                onClick={() => onSelect(el)}
              >
                <div className="flex items-center justify-between">
                  <EllipsisText copy length={7} text={el.commit_id} />
                  {statusFound(el.status) && (
                    <span className="bg-gray-150 text-size-10 px-10 h-17 rounded-full tracking-wide text-gray-600 justify-between text-ellipsis inline-flex">
                      {el.status}...
                    </span>
                  )}
                </div>
              </li>
            ))}
        </InfiniteScroll>
      </ul>
    </div>
  );
};

export default BuildCommitsList;
