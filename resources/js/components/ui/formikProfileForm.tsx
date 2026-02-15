/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Formik, Form, Field, FieldArray, type FormikHelpers } from "formik";
import type * as Yup from "yup";
import { Toast } from "@/components/ui/toast";

interface FormikProfileFormProps {
  initialValues: any;
  validationSchema: Yup.ObjectSchema<any>;
  onSubmit: (values: any, formikHelpers: FormikHelpers<any>) => void;
  fields: {
    name: string;
    label: string;
    type: string;
    options?: string[];
  }[];
  submitButtonText: string;
  title?: string;
  description?: string;
  isSubmitting: boolean;
  toastState: "initial" | "loading" | "success" | "error";
  toastMessage: string;
  children? : any
}

export function FormikProfileForm({
  initialValues,
  validationSchema,
  onSubmit,
  fields,
  submitButtonText,
  title,
  description,
  isSubmitting,
  toastState,
  toastMessage,
  children
}: FormikProfileFormProps) {
  const [localToastState, setLocalToastState] = useState<
    "initial" | "loading" | "success"
  >("initial");

  const handleSubmit = async (
    values: any,
    formikHelpers: FormikHelpers<any>
  ) => {
    setLocalToastState("loading");
    try {
      await onSubmit(values, formikHelpers);
      setLocalToastState("success");
      setTimeout(() => setLocalToastState("initial"), 2000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setLocalToastState("initial");
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ errors, touched, values, setFieldValue, resetForm }) => (
        <Form className="space-y-4 max-w-2xl">
          {title && <h1 className="text-2xl font-bold mb-4">{title}</h1>}
          {description && <p className="text-gray-700 mb-4">{description}</p>}

          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700"
              >
                {field.label}
              </label>
              {field.type === "array" ? (
                <FieldArray name={field.name}>
                  {({ push, remove }) => (
                    <div className="space-y-2">
                      {(values[field.name] as any[]).map((_, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <Field
                            name={`${field.name}.${index}`}
                            className="flex-grow border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2b998a] focus:border-transparent"
                          />
                          <button
                            type="button"
                            id="remove"
                            onClick={() => remove(index)}
                            className="text-red-500"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              className="w-5 h-5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => push("")}
                        className={`flex items-center text-[#2b998a] text-sm font-semibold hover:underline ${field.name}`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="w-5 h-5 mr-2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        Add {field.label}
                      </button>
                    </div>
                  )}
                </FieldArray>
              ) : field.type === "select" ? (
                <Field
                  as="select"
                  name={field.name}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2b998a] focus:border-transparent"
                >
                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Field>
              ) : field.type === "radio" ? (
                <div className="space-x-4">
                  {field.options?.map((option) => (
                    <label key={option} className="inline-flex items-center">
                      <Field
                        type="radio"
                        name={field.name}
                        value={option}
                        className="mr-2"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <Field
                  type={field.type}
                  name={field.name}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2b998a] focus:border-transparent"
                />
              )}
              {errors[field.name] && touched[field.name] && (
                <div className="text-red-500 text-xs">
                  {errors[field.name] as string}
                </div>
              )}
            </div>
          ))}
          {children}

          <div className="flex items-center lg:gap-20 sm:justify-between">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#2b998a] text-white px-6 py-2  mr-10 text-sm font-medium hover:bg-[#238577] transition-colors"
            >
              {isSubmitting ? "BEZIG MET OPSLAAN..." : submitButtonText}
            </button>
            <Toast state={toastState} message={toastMessage} />
          </div>
        </Form>
      )}
    </Formik>
  );
}
