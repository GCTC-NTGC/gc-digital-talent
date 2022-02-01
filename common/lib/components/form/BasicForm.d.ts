import React, { PropsWithChildren, ReactElement } from "react";
import { FieldValues, SubmitHandler, UseFormProps } from "react-hook-form";
export declare const BasicForm: {
    <TFieldValues extends FieldValues, TContext extends object = object>({ onSubmit, children, options, }: React.PropsWithChildren<{
        onSubmit: SubmitHandler<TFieldValues>;
        options?: Partial<{
            mode: keyof import("react-hook-form").ValidationMode;
            reValidateMode: "onBlur" | "onChange" | "onSubmit";
            defaultValues: import("react-hook-form").UnpackNestedValue<import("react-hook-form").DeepPartial<TFieldValues>>;
            resolver: import("react-hook-form").Resolver<TFieldValues, any>;
            context: any;
            shouldFocusError: boolean;
            shouldUnregister: boolean;
            shouldUseNativeValidation: boolean;
            criteriaMode: import("react-hook-form").CriteriaMode;
            delayError: number;
        }> | undefined;
    }>): ReactElement;
    parameters: any;
};
export default BasicForm;
