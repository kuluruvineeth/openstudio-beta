import { ViewIcon, ViewOffIcon } from '@hugeicons/react';
import { Button } from '@repo/design-system/components/ui/button';
import { Input } from '@repo/design-system/components/ui/input';
import { type FC, useState } from 'react';

export type TApiKeyInput = {
  value: string;
  setValue: (key: string) => void;
  isDisabled: boolean;
  placeholder: string;
};

const ApiKeyInput: FC<TApiKeyInput> = ({
  value,
  setValue,
  isDisabled,
  placeholder,
}) => {
  const [showKey, setShowKey] = useState<boolean>(false);
  return (
    <div className="relative flex w-full flex-row items-center gap-2">
      <Input
        placeholder={placeholder}
        value={value}
        disabled={isDisabled}
        type={showKey ? 'text' : 'password'}
        autoComplete="off"
        className="w-full pr-10"
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
      <Button
        variant="ghost"
        size="iconXS"
        className="absolute right-2"
        onClick={() => setShowKey(!showKey)}
      >
        {showKey ? (
          <ViewOffIcon size={16} variant="solid" />
        ) : (
          <ViewIcon size={16} variant="solid" />
        )}
      </Button>
    </div>
  );
};

export default ApiKeyInput;
