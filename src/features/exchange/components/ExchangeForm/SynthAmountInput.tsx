import { useRef } from "react";
import { Input, Text } from "@chakra-ui/react";
import { useIMask } from "../../../../shared";

type Props = React.ComponentProps<typeof Input> & {
  label?: string;
};

const PLACEHOLDER_SETTINGS = {
  opacity: 1,
  color: "text.500",
};

export const SynthAmountInput = ({ label, ...rest }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  useIMask(inputRef);
  return (
    <label>
      {label && (
        <Text fontSize={"sm"} color={"text.500"} pb={2}>
          {label}
        </Text>
      )}
      <Input
        placeholder="0.0000"
        _placeholder={PLACEHOLDER_SETTINGS}
        {...rest}
        ref={inputRef}
      />
    </label>
  );
};
