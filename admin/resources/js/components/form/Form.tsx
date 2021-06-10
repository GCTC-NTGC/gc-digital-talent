import * as React from "react";
import { useForm } from "react-hook-form";

interface FormProps {
  defaultValues?: { [key: string]: any };
  onSubmit: (event: any) => void;
  children?: React.ReactChild | React.ReactChild[];
}

const Form: React.FunctionComponent<FormProps> = ({
  defaultValues,
  onSubmit,
  children,
  ...rest
}) => {
  const methods = useForm({ defaultValues });
  const { handleSubmit } = methods;

  return (
    <form onSubmit={handleSubmit(onSubmit)} {...rest}>
      {children &&
        React.Children.map(children, (child: React.ReactChild) => {
          if (!React.isValidElement(child)) {
            return child;
          }
          return child && child.props.name
            ? React.createElement(child.type, {
                ...{
                  ...child.props,
                  register: methods.register,
                  key: child.props.name,
                },
              })
            : child;
        })}
    </form>
  );
};

export default Form;
