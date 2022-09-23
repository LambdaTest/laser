import Input from 'components/Input';
import { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

import useDetectOutsideClick from '../../hooks/useDetectOutsideClick';

enum DirectionX {
  LEFT,
  RIGHT,
}

enum DirectionY {
  TOP,
  BOTTOM,
}

type TPosition = {
  bottom: number | string;
  height?: number | string;
  left: number | string;
  right: number | string;
  top: number | string;
  minWidth?: number | string;
};

type TOption = string | { [key: string]: any };

export type TDropdownProps = {
  directionX?: DirectionX;
  directionY?: DirectionY;
  disabled?: boolean;
  dropdownStyles?: CSSProperties;
  forcePosition?: boolean;
  getPopupContainer?: (triggerNode?: HTMLElement) => HTMLElement;
  isDefaultOpened?: boolean;
  labelKey?: string;
  loading?: boolean;
  offsetX?: number;
  offsetY?: number;
  onClick?: (value: string, option: TOption) => void;
  onSearch?: (search: string, options: TOption[], labelKey: string, valueKey: string) => TOption[];
  optionRenderer?: (option: TOption, optionIndex: number) => JSX.Element;
  options: TOption[];
  prefix?: JSX.Element;
  selectedOption?: TOption;
  showClear?: boolean;
  showSearch?: boolean;
  toggleLabel?: string;
  toggleRenderer?: (props: {
    defaultLabel?: string;
    isActive: boolean;
    selectedOption?: TOption;
  }) => JSX.Element;
  toggleStyles?: CSSProperties;
  valueKey?: string;
};

const defaultToggleStyles = {};
const defaultDropdownStyles = {
  maxWidth: 200,
};
const defaultPosition = {
  bottom: 'auto',
  left: 'auto',
  right: -9999,
  top: -9999,
};

const getOptionLabel = (option: TOption | undefined, labelKey: string): string => {
  if (typeof option === 'string') {
    return option;
  }
  return option?.[labelKey];
};

const getOptionValue = (option: TOption | undefined, valueKey: string): string => {
  if (typeof option === 'string') {
    return option;
  }
  return option?.[valueKey];
};

const defaultSearchHandler = (
  search: string,
  options: TOption[],
  labelKey: string,
  valueKey: string
) => {
  return options.filter((option: TOption) => {
    const searchLowerCase = search.toLowerCase();
    return (
      getOptionLabel(option, labelKey).toLowerCase().indexOf(searchLowerCase) > -1 ||
      getOptionValue(option, valueKey).toLowerCase().indexOf(searchLowerCase) > -1
    );
  });
};

/**
 * Dropdown Component
 * @param {HTMLElement} getPopupContainer should return a DOM element with position **relative**
 */
const Dropdown = ({
  directionX = DirectionX.RIGHT,
  directionY = DirectionY.BOTTOM,
  disabled = false,
  dropdownStyles = {},
  forcePosition = false,
  getPopupContainer,
  isDefaultOpened = false,
  labelKey = 'label',
  loading = false,
  offsetX = 0,
  offsetY = 5,
  onClick = () => {},
  onSearch = defaultSearchHandler,
  optionRenderer,
  options,
  prefix,
  selectedOption,
  showClear = false,
  showSearch = false,
  toggleLabel,
  toggleRenderer,
  toggleStyles = {},
  valueKey = 'value',
}: TDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownToggleRef = useRef<HTMLDivElement>(null);
  const dropdownListRef = useRef<HTMLDivElement>(null);

  const dropdownListContainer =
    getPopupContainer?.(dropdownToggleRef.current as HTMLElement) || document.body;

  const [search, setSearch] = useState('');

  const optionsToShowInList = useMemo(() => {
    return !search ? options : onSearch(search, options, labelKey, valueKey);
  }, [search, options, labelKey, valueKey]);

  const [isActive, setIsActive] = useState(isDefaultOpened);
  const [position, setPosition] = useState<TPosition>(defaultPosition);

  const _selectedOption = options.find(
    (option) => getOptionValue(option, valueKey) === getOptionValue(selectedOption, valueKey)
  );
  const selectedOptionLabel = getOptionLabel(_selectedOption, labelKey);
  const selectedOptionValue = getOptionValue(_selectedOption, valueKey);

  const defaultOption = options[0];
  const defaultOptionValue = getOptionValue(defaultOption, valueKey);

  useDetectOutsideClick([dropdownListRef, dropdownRef], () => {
    setIsActive(false);
  });

  const onToggle = (e: any) => {
    e.preventDefault();
    setIsActive(!isActive);
  };

  const onItemClick = (value: string, option: TOption) => (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    onClick(value, option);
    setIsActive(false);
  };

  const computePosition = () => {
    if (dropdownToggleRef.current && dropdownListRef.current) {
      let xDir = directionX;
      let yDir = directionY;

      const containerBoundingBox = dropdownListContainer?.getBoundingClientRect();
      const containerDimensions = {
        height: dropdownListContainer?.offsetHeight ?? 0,
        left: containerBoundingBox.left,
        scrollHeight: dropdownListContainer?.scrollHeight ?? 0,
        scrollLeft: dropdownListContainer?.scrollLeft ?? 0,
        scrollTop: dropdownListContainer?.scrollTop ?? 0,
        scrollWidth: dropdownListContainer?.scrollWidth ?? 0,
        top: containerBoundingBox.top,
        width: dropdownListContainer?.offsetWidth ?? 0,
      };

      const toggleBoundingBox = dropdownToggleRef.current.getBoundingClientRect();
      const toggleDimensions = {
        height: toggleBoundingBox.height,
        left: toggleBoundingBox.left,
        top: toggleBoundingBox.top,
        width: toggleBoundingBox.width,
      };

      const listDimensions = {
        height: dropdownListRef.current?.offsetHeight ?? 0,
        width: dropdownListRef.current?.offsetWidth ?? 0,
      };

      const computedPositionForAllDirections = {
        fromBottom:
          containerDimensions.scrollHeight -
          (containerDimensions.scrollTop -
            containerDimensions.top +
            toggleDimensions.top -
            offsetY),
        fromLeft:
          containerDimensions.scrollLeft -
          containerDimensions.left +
          toggleDimensions.left +
          offsetX,
        fromRight:
          containerDimensions.scrollWidth -
          (containerDimensions.scrollLeft -
            containerDimensions.left +
            toggleDimensions.left +
            toggleDimensions.width -
            offsetX),
        fromTop:
          containerDimensions.scrollTop -
          containerDimensions.top +
          toggleDimensions.top +
          toggleDimensions.height +
          offsetY,
      };

      const outofViewFromContainer = {
        fromBottom:
          computedPositionForAllDirections.fromTop + listDimensions.height >
          containerDimensions.scrollHeight,
        fromLeft: computedPositionForAllDirections.fromRight - listDimensions.width < 0,
        fromRight:
          computedPositionForAllDirections.fromLeft + listDimensions.width >
          containerDimensions.scrollWidth,
        fromTop: computedPositionForAllDirections.fromBottom - listDimensions.height < 0,
      };

      if (!forcePosition) {
        if (xDir === DirectionX.RIGHT && outofViewFromContainer.fromRight) {
          xDir = DirectionX.LEFT;
        } else if (xDir === DirectionX.LEFT && outofViewFromContainer.fromLeft) {
          xDir = DirectionX.RIGHT;
        }

        if (yDir === DirectionY.TOP && outofViewFromContainer.fromTop) {
          yDir = DirectionY.BOTTOM;
        } else if (yDir === DirectionY.BOTTOM && outofViewFromContainer.fromBottom) {
          yDir = DirectionY.TOP;
        }
      }

      const computedPosition: TPosition = {
        bottom: yDir === DirectionY.TOP ? computedPositionForAllDirections.fromBottom : 'auto',
        left: xDir === DirectionX.RIGHT ? computedPositionForAllDirections.fromLeft : 'auto',
        right: xDir === DirectionX.LEFT ? computedPositionForAllDirections.fromRight : 'auto',
        top: yDir === DirectionY.BOTTOM ? computedPositionForAllDirections.fromTop : 'auto',
        minWidth: toggleDimensions.width,
      };

      setPosition(computedPosition);
    }
  };

  useEffect(() => {
    if (isActive) {
      computePosition();
    }
  }, [isActive]);

  const toggleComponent = toggleRenderer ? (
    toggleRenderer({
      defaultLabel: toggleLabel,
      isActive,
      selectedOption: _selectedOption,
    })
  ) : (
    <button
      className={`tas-custom-focus text-size-12 px-10 bg-gray-100 border rounded text-ellipsis flex items-center justify-between w-full ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
      style={{ ...defaultToggleStyles, ...toggleStyles }}
    >
      <span className="inline-flex items-center text-ellipsis">
        {prefix && <span className="mr-5">{prefix}</span>}
        <span className="block text-ellipsis">{selectedOptionLabel || toggleLabel}</span>
      </span>
      {loading ? (
        <div className="loader"></div>
      ) : (
        <span className="inline-flex items-center justify-center">
          {showClear && defaultOptionValue !== selectedOptionValue && (
            <span
              className={`inline-flex items-center ml-8 hover:bg-gray-160 p-5`}
              onClick={onItemClick(defaultOptionValue, defaultOption)}
            >
              <img
                className="w-full"
                src="/assets/images/icon/cross-black.svg"
                alt="..."
                width="10"
              />
            </span>
          )}
          <span className={`inline-flex items-center ml-8 ${isActive ? 'tas-rotate-180' : ''}`}>
            <img className="w-full" src="/assets/images/arrow_down_gray.svg" alt="..." width="10" />
          </span>
        </span>
      )}
    </button>
  );

  const listComponent = (
    <div
      className="tas-dropdown-list absolute z-10 bg-white border  border-gray-300 rounded-md p-5 overflow-hidden"
      ref={dropdownListRef}
      style={{
        ...defaultDropdownStyles,
        ...dropdownStyles,
        ...position,
      }}
    >
      {showSearch && (
        <div className="mb-8">
          <Input
            autoFocus
            className="text-size-12"
            defaultValue={search}
            onChange={(e: any) => setSearch(e.target.value)}
            placeholder="Search"
            search
          />
        </div>
      )}
      <div className="max-height-200 overflow-y-scroll">
        {optionsToShowInList.map((option, optionIndex) => {
          const value = getOptionValue(option, valueKey);
          const label = getOptionLabel(option, labelKey);
          const isOptionSelected = !!(value === selectedOptionValue);

          return (
            <div className="tas-dropdown-item" onClick={onItemClick(value, option)} key={value}>
              {optionRenderer ? (
                optionRenderer(option, optionIndex)
              ) : (
                <div
                  className={`text-tas-400 text-size-12 block px-8 py-5 cursor-pointer text-ellipsis rounded ${
                    isOptionSelected ? 'active' : ''
                  }`}
                >
                  {label}
                </div>
              )}
            </div>
          );
        })}
        {showSearch && !optionsToShowInList.length && (
          <div className="text-size-12 text-center w-full text-tas-400 tracking-wider py-5 text-ellipsis">
            No results found for <strong>{search}</strong>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="tas-dropdown-container" ref={dropdownRef}>
      <div
        className={`tas-dropdown-toggle`}
        onClick={disabled ? () => {} : onToggle}
        ref={dropdownToggleRef}
      >
        {toggleComponent}
      </div>
      {isActive &&
        dropdownListContainer &&
        ReactDOM.createPortal(listComponent, dropdownListContainer)}
      {isActive && !dropdownListContainer && listComponent}
    </div>
  );
};

Dropdown.DirectionX = DirectionX;
Dropdown.DirectionY = DirectionY;

export default Dropdown;
