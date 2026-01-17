'use client';

import React, { useState } from 'react';
import { Input } from 'antd';
import { BadgeXIcon, ColumnsSettingsIcon } from 'lucide-react';

export default function InputField({
  label = '',
  type = 'text',
  placeholder = '',
  value = '',
  onValueChange,
  inputClassName = '',
}) {
  const handleChange = (e) => {
    onValueChange(e.target.value);
  };



  return (
    <div>
      {label && <label className="block text-sm font-medium">{label}</label>}
      <Input
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        style={{ width: "100%" }}
        allowClear={{
          clearIcon: (
            <BadgeXIcon
              size="16px"
              style={{ color: inputClassName === "" ? "black" : "white" }}
            />
          ),
        }}
        className={`mt-2 ${inputClassName}`}
      />
    </div>
  );
}
