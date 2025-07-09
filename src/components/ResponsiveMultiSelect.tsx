import React from 'react';
import { Select } from 'antd';

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
      <Select
        mode="multiple"
        value={value}
        onChange={onChange}
        options={options}
      style={style}
        placeholder={placeholder}
        maxTagCount={maxTagCount}
        maxTagPlaceholder={omittedValues => (
        <span>
            +{omittedValues.length}
          </span>
        )}
      />
  );
};

export default ResponsiveMultiSelect; 