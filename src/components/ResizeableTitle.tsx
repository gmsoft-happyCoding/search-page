import React, { Dispatch } from 'react';
import { Resizable } from 'react-resizable';
import { createGlobalStyle } from 'styled-components';
import { debounce, isNil } from 'lodash';
import actions from '../useSearchPage/actions';

const GlobalStyle = createGlobalStyle`
  body {
    .react-resizable {
      position: relative;
    }
    .react-resizable-handle {
      position: absolute;
      width: 20px;
      height: 20px;
      bottom: 0;
      right: 0;
      // eslint-disable-next-line max-len
      background: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pg08IS0tIEdlbmVyYXRvcjogQWRvYmUgRmlyZXdvcmtzIENTNiwgRXhwb3J0IFNWRyBFeHRlbnNpb24gYnkgQWFyb24gQmVhbGwgKGh0dHA6Ly9maXJld29ya3MuYWJlYWxsLmNvbSkgLiBWZXJzaW9uOiAwLjYuMSAgLS0+DTwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DTxzdmcgaWQ9IlVudGl0bGVkLVBhZ2UlMjAxIiB2aWV3Qm94PSIwIDAgNiA2IiBzdHlsZT0iYmFja2dyb3VuZC1jb2xvcjojZmZmZmZmMDAiIHZlcnNpb249IjEuMSINCXhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbDpzcGFjZT0icHJlc2VydmUiDQl4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjZweCIgaGVpZ2h0PSI2cHgiDT4NCTxnIG9wYWNpdHk9IjAuMzAyIj4NCQk8cGF0aCBkPSJNIDYgNiBMIDAgNiBMIDAgNC4yIEwgNCA0LjIgTCA0LjIgNC4yIEwgNC4yIDAgTCA2IDAgTCA2IDYgTCA2IDYgWiIgZmlsbD0iIzAwMDAwMCIvPg0JPC9nPg08L3N2Zz4=');
      background-position: bottom right;
      padding: 0 3px 3px 0;
      background-repeat: no-repeat;
      background-origin: content-box;
      box-sizing: border-box;
      cursor: se-resize;
    }
  }
`;

export type ResizableTitleProps = {
  onResize: Function;
  width: number;
  lockWidth?: boolean;
  [key: string]: any;
};

const ResizableTitle = (props: ResizableTitleProps) => {
  const { onResize, width, lockWidth, ...restProps } = props;

  if (!width || lockWidth) {
    return <th {...restProps} />;
  }

  return (
    <>
      <GlobalStyle />
      <Resizable width={width} height={0} onResize={onResize}>
        <th {...restProps} />
      </Resizable>
    </>
  );
};

type Opt = {
  columnConfs: any[];
  setConfs: Function;
  dispatch: Dispatch<any>;
  tableWidthConfs: { key: string; width: number; __init?: boolean }[];
  storeKey?: string;
};

type HandleResizeOpt = { index: number } & Opt;

const saveWidth = debounce((dispatch, payload) => dispatch(actions.storeTableWidth(payload)), 300);

function handleResize({ index, columnConfs, setConfs, dispatch, storeKey }: HandleResizeOpt) {
  return (_, { size }) => {
    const nextColumns = [...columnConfs];
    nextColumns[index] = {
      ...nextColumns[index],
      width: size.width,
    };
    setConfs(nextColumns);
    saveWidth(dispatch, { nextColumns, storeKey });
  };
}

export function getColumnConfs({
  columnConfs,
  setConfs,
  dispatch,
  tableWidthConfs,
  storeKey,
}: Opt) {
  if (tableWidthConfs[0] && isNil(columnConfs[0].__init)) {
    columnConfs.forEach((c, index) => {
      c.width = tableWidthConfs[index].width;
    });
    columnConfs[0].__init = true;
  }

  return columnConfs.map((column, index: number) => ({
    ...column,
    onHeaderCell: (columnConf: any) => ({
      width: columnConf.width,
      onResize: handleResize({
        index,
        columnConfs,
        setConfs,
        dispatch,
        tableWidthConfs,
        storeKey,
      }),
    }),
  }));
}

export default ResizableTitle;
