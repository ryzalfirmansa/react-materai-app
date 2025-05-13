import React from "react";
import Select from "react-select";

const CustomerDropdown = ({ customers, onSelect }) => {
  const options = customers.map((name) => ({ value: name, label: name }));

  return (
    <div>
      <h4>Pilih Nama Customer</h4>
      <Select options={options} onChange={(selected) => onSelect(selected.value)} />
    </div>
  );
};

export default CustomerDropdown;
