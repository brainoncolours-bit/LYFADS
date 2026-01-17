import { AutoComplete } from "antd";

export default function AutoCompleteInput({
    label = "",
    options = [],
    placeholder = "",
    onValueChange,
    value = "",
    keyMap = { label: "label", value: "value" },
    inputClassName=false
  }) {
    const mappedOptions = options.map(opt =>
      typeof opt === "string"
        ? { value: opt }
        : { value: opt[keyMap.value], label: opt[keyMap.label] }
    );
  
    const handleChange = (val) => {
      const obj = options.find(
        opt => (typeof opt === "object" ? opt[keyMap.value] === val : opt === val)
      );
      onValueChange(obj || val);        // send object or free text
    };
  
    return (
      <div>
        <label className="block text-sm font-medium mb-2">{label}</label>
        <AutoComplete
          options={mappedOptions}
          value={value}
          onChange={handleChange}        // handles both typing & selecting
          placeholder={placeholder}
          style={{ width: "100%"}}
          allowClear
          filterOption={(input, option) =>
            option?.value?.toLowerCase().includes(input.toLowerCase())
          }
          className={inputClassName?"dark-autocomplete-css":""}
        />
      </div>
    );
  }
  