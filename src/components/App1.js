import React, { useState, useEffect } from "react";
import "./App1.css";

const App = () => {
  const [formType, setFormType] = useState("");
  const [formStructure, setFormStructure] = useState(null);
  const [formData, setFormData] = useState([]);
  const [progress, setProgress] = useState(0);

  // Mock API response object
  const mockApiResponse = {
    "User Information": {
      fields: [
        {
          name: "firstName",
          type: "text",
          label: "First Name",
          required: true,
        },
        { name: "lastName", type: "text", label: "Last Name", required: true },
        { name: "age", type: "number", label: "Age", required: false },
      ],
    },
    "Address Information": {
      fields: [
        { name: "street", type: "text", label: "Street", required: true },
        { name: "city", type: "text", label: "City", required: true },
        {
          name: "state",
          type: "dropdown",
          label: "State",
          options: ["California", "Texas", "New York"],
          required: true,
        },
        { name: "zipCode", type: "text", label: "Zip Code", required: false },
      ],
    },
    "Payment Information": {
      fields: [
        {
          name: "cardNumber",
          type: "text",
          label: "Card Number",
          required: true,
        },
        {
          name: "expiryDate",
          type: "date",
          label: "Expiry Date",
          required: true,
        },
        { name: "cvv", type: "password", label: "CVV", required: true },
        {
          name: "cardholderName",
          type: "text",
          label: "Cardholder Name",
          required: true,
        },
      ],
    },
  };

  // useEffect to set form structure when formType changes
  useEffect(() => {
    if (formType) {
      setFormStructure(mockApiResponse[formType]);
    }
  }, [formType]); // formType is the only dependency

  // Handle form submission and update progress
  const handleFormSubmit = (data) => {
    setFormData([...formData, data]);
    setProgress(100);
    setTimeout(() => setProgress(0), 2000); // Reset progress bar after submission
  };

  return (
    <div className="App">
      <h1>Dynamic Form</h1>
      <select onChange={(e) => setFormType(e.target.value)} value={formType}>
        <option value="">Select Form Type</option>
        <option value="User Information">User Information</option>
        <option value="Address Information">Address Information</option>
        <option value="Payment Information">Payment Information</option>
      </select>

      {formStructure && (
        <DynamicForm structure={formStructure} onSubmit={handleFormSubmit} />
      )}
      <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      <Table data={formData} />
    </div>
  );
};

// Dynamic form rendering based on the structure
const DynamicForm = ({ structure, onSubmit }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};
    structure.fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required.`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      setFormData({});
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {structure.fields.map((field) => (
        <div key={field.name}>
          <label>{field.label}</label>
          {field.type === "dropdown" ? (
            <select onChange={(e) => handleChange(field.name, e.target.value)}>
              <option value="">Select</option>
              {field.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.type}
              onChange={(e) => handleChange(field.name, e.target.value)}
            />
          )}
          {errors[field.name] && <span>{errors[field.name]}</span>}
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  );
};

// Table to display submitted form data
const Table = ({ data }) => (
  <table>
    <thead>
      <tr>
        {data.length > 0 &&
          Object.keys(data[0]).map((key) => <th key={key}>{key}</th>)}
      </tr>
    </thead>
    <tbody>
      {data.map((row, index) => (
        <tr key={index}>
          {Object.values(row).map((value, idx) => (
            <td key={idx}>{value}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

export default App;
