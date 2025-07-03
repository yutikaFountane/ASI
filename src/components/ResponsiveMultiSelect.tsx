import React from 'react';
import { Select } from 'antd';
import './ResponsiveMultiSelect.css';

interface ResponsiveMultiSelectProps {
  value: string[];
  onChange: (val: string[]) => void;
  options: { value: string; label: string }[];
  style?: React.CSSProperties;
  placeholder?: string;
}

const ResponsiveMultiSelect: React.FC<ResponsiveMultiSelectProps> = ({
  value,
  onChange,
  options,
  style,
  placeholder,
}) => {
  const maxTagCount = 2;
  return (
    <div style={{ width: '100%' }} className="responsive-multiselect-container">
      <Select
        mode="multiple"
        value={value}
        onChange={onChange}
        options={options}
        style={{ width: '100%', ...style }}
        placeholder={placeholder}
        maxTagCount={maxTagCount}
        maxTagPlaceholder={omittedValues => (
          <span style={{
            background: '#ededed',
            borderRadius: 8,
            padding: '0 12px',
            fontWeight: 500,
            color: '#444'
          }}>
            +{omittedValues.length}
          </span>
        )}
        className="responsive-multiselect"
      />
    </div>
  );
};

export default ResponsiveMultiSelect; 