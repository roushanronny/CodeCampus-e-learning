import React, { useState, useEffect } from "react";
import { Field, ErrorMessage } from "formik";
import Select from "react-select";
import { getAllCategories } from "../../../api/endpoints/category";
import { toast } from "react-toastify";

interface Category {
  name: string;
  description: string;
}
        
const SelectInterest: React.FC = () => {
  const [categories, setCategories] = useState<Category[] | null>(null);

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      setCategories(response?.data);
    } catch (error) {
      toast.error("Something went wrong", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className='mt-2'>
      <label
        htmlFor='interests'
        className='block text-sm font-medium leading-5 text-gray-700'
      >
        Interests (Optional)
      </label>
      {categories && categories.length > 0 ? (
        <Field
          id='interests'
          name='interests'
          component={CustomSelect}
          options={categories.map((category) => ({
            value: category?.name,
            label: category?.name,
          }))}
        />
      ) : categories === null ? (
        <div className="mt-2">
          <p className="text-sm text-gray-500">Categories unavailable. You can register without selecting interests.</p>
          <Field
            id='interests'
            name='interests'
            type="hidden"
            value={[]}
          />
        </div>
      ) : (
        <p className="text-sm text-gray-500">Loading categories...</p>
      )}
      <ErrorMessage
        name='interests'
        component='div'
        className='text-red-500 text-xs mt-1'
      />
    </div>
  );
};

const CustomSelect = ({ field, form, options, ...props }: any) => {
  const handleChange = (selectedOption: any) => {
    form.setFieldValue(field?.name, selectedOption);
  };

  return (
    <Select
      {...field}
      {...props}
      options={options}
      isMulti
      onChange={handleChange}
    />
  );
};

export default SelectInterest;
