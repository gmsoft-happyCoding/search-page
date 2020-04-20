/** 定制化筛选控制器 */
import React, { useMemo, useCallback } from 'react';
import { Popover, Checkbox, Row, Col } from 'antd';

export interface CustomFilterControllerProps {
  allConfigs: { key: string; name: string; disabled?: boolean }[];
  activeKeys?: string[];
  onChange?: (keys: string[]) => void;
}

export default ({ allConfigs, activeKeys, onChange }: CustomFilterControllerProps) => {
  const content = useMemo(
    () => (
      <Row type="flex" justify="start" gutter={24}>
        {allConfigs.map(item => (
          <Col span={8} key={item.key}>
            <Checkbox value={item.key} disabled={item.disabled}>
              {item.name}
            </Checkbox>
          </Col>
        ))}
      </Row>
    ),
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
        <div style={{ maxWidth: 600 }}>
          <Checkbox.Group value={activeKeys} onChange={proxyChange}>
            {content}
          </Checkbox.Group>
        </div>
      }
      title="请勾选需要使用的筛选项"
      placement="leftTop"
      trigger="click"
    >
      <a className="action" role="button">
        自定义
      </a>
    </Popover>
  );
};
