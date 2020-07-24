/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable jsx-a11y/anchor-is-valid */
/** 定制化筛选控制器 */
import React, { useMemo, useCallback, CSSProperties } from 'react';
import { Popover, Checkbox } from 'antd';
import styled from 'styled-components';

const CheckboxGroupWrap = styled.div`
  max-height: 260px;
  overflow-y: scroll;
`;

const CheckboxWrap = styled.div`
  margin: 4px;
`;

export interface CustomFilterControllerProps {
  allConfigs: { key: string; name: string; disabled?: boolean }[];
  activeKeys?: string[];
  onChange?: (keys: string[]) => void;
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  popoverOverlayStyle?: CSSProperties;
}

export default ({
  allConfigs,
  activeKeys,
  onChange,
  getPopupContainer,
  popoverOverlayStyle,
}: CustomFilterControllerProps) => {
  const content = useMemo(
    () =>
      allConfigs.map(item => (
        <CheckboxWrap key={item.key}>
          <Checkbox value={item.key} disabled={item.disabled}>
            {item.name}
          </Checkbox>
        </CheckboxWrap>
      )),
    [allConfigs]
  );
  const proxyChange = useCallback(
    val => {
      if (onChange) {
        onChange(val);
      }
    },
    [onChange]
  );

  return (
    <Popover
      content={
        <CheckboxGroupWrap>
          <Checkbox.Group value={activeKeys} onChange={proxyChange}>
            {content}
          </Checkbox.Group>
        </CheckboxGroupWrap>
      }
      title="请勾选需要使用的筛选项"
      overlayStyle={popoverOverlayStyle}
      getPopupContainer={getPopupContainer}
      placement="leftTop"
      trigger="click"
    >
      <a className="action" role="button">
        自定义
      </a>
    </Popover>
  );
};
