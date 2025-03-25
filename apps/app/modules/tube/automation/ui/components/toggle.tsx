import { Field, Switch } from '@headlessui/react';
import {
  ErrorMessage,
  ExplainText,
  Label,
} from '@repo/design-system/components/input';
import { TooltipExplanation } from '@repo/design-system/components/ui/tooltip-explanation';
import { cn } from '@repo/design-system/lib/utils';
import type { FieldError } from 'react-hook-form';

export interface ToggleProps {
  name: string;
  label?: string;
  labelRight?: string;
  tooltipText?: string;
  enabled: boolean;
  explainText?: string;
  error?: FieldError;
  onChange: (enabled: boolean) => void;
  bgClass?: string;
}

export const Toggle = (props: ToggleProps) => {
  const { label, labelRight, tooltipText, enabled, onChange } = props;

  const enabledColor = 'var(--green-500, #10b981)'; // bright green
  const disabledDarkColor = '#1f2937'; // dark gray-800
  const disabledBorderDark = '#4b5563'; // gray-600

  return (
    <div>
      <Field as="div" className="flex items-center">
        {label && (
          <span className="mr-3 flex items-center gap-1 text-nowrap">
            <Label name={props.name} label={label} />
            {tooltipText && <TooltipExplanation text={tooltipText} />}
          </span>
        )}
        <Switch
          checked={enabled}
          onChange={onChange}
          className={cn(
            'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2',
            enabled
              ? 'border-transparent'
              : 'border-gray-400 dark:border-gray-600',
            'transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 dark:focus:ring-primary dark:focus:ring-offset-gray-900'
          )}
          style={{
            backgroundColor: enabled
              ? enabledColor
              : 'var(--color-bg-secondary, #e5e7eb)',
            borderColor: enabled ? 'transparent' : disabledBorderDark,
          }}
        >
          <span className="sr-only">{label}</span>
          <span
            aria-hidden="true"
            className="pointer-events-none inline-block h-5 w-5 transform rounded-full shadow ring-0 transition duration-200 ease-in-out"
            style={{
              backgroundColor: enabled
                ? 'white'
                : 'var(--color-bg-tertiary, #d1d5db)', // gray-300
              transform: enabled ? 'translateX(20px)' : 'translateX(0px)',
            }}
          />
        </Switch>
        {labelRight && (
          <span className="ml-3 flex items-center gap-1 text-nowrap">
            <Label name={props.name} label={labelRight} />
            {tooltipText && <TooltipExplanation text={tooltipText} />}
          </span>
        )}
      </Field>
      {props.explainText ? (
        <ExplainText>{props.explainText}</ExplainText>
      ) : null}
      {props.error?.message ? (
        <ErrorMessage message={props.error?.message} />
      ) : null}
    </div>
  );
};
