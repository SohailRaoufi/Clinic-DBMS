import React, { useState } from "react";
import json from "../utils/DataObjects.json";

interface OperationOptionsProps {
  chartStyle: any;
  disabled: boolean;
  selectedOps: string[];
  setSelectedOps: React.Dispatch<React.SetStateAction<string[]>>;
}

interface Operation {
  label: string;
  name: string;
  value: string;
}

const OperationOptionsTable: React.FC<OperationOptionsProps> = ({
  chartStyle,
  disabled,
  selectedOps,
  setSelectedOps,
}) => {
  // list of operations
  const listOfOperations: Operation[] = json.Operations;
  const [errors, setErrors] = useState<string | null>(null);
  // state to manage selected operations (checkbox values)
  // const [selectedOps, setSelectedOps] = useState<string[]>([]);

  // handle checkbox change
  const handleCheckboxChange = (value: string) => {
    setErrors(null);
    if (selectedOps.includes(value)) {
      setSelectedOps(selectedOps.filter((op) => op !== value));
    } else {
      if (selectedOps.length >= 1) {
        setErrors("1 Treatment is Only Allowed");
        return;
      }
      setSelectedOps([...selectedOps, value]);
    }
  };

  return (
    <>
      <div
        className={`mx-10 border border-slate-600 rounded max-w-sm mb-2 ${chartStyle?.head}`}
      >
        <table className={`w-full ${chartStyle?.table}`}>
          <thead className="bg-black text-white border-b border-slate-600">
            <tr>
              <th className="">Operation</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="text-white">
            {listOfOperations.map((op) => (
              <tr key={op.label} className={chartStyle?.body}>
                <td className="pl-2">
                  <span className="text-black">{op.label}</span>
                </td>
                <td className="pl-2 text-center">
                  <input
                    name={op.name}
                    className="check rounded border-slate-600 w-5 h-5"
                    type="checkbox"
                    value={op.value}
                    checked={selectedOps.includes(op.value)}
                    disabled={disabled}
                    onChange={() => handleCheckboxChange(op.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {errors && <div className="text-red-500 font-medium mx-10">{errors}</div>}
    </>
  );
};

export default OperationOptionsTable;
