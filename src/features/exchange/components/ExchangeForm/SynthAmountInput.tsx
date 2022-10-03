import { useCallback, useRef } from "react";
import {
  Avatar,
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import { useIMask } from "../../../../shared";
import { SynthWithLogo } from "../../stores";

type Props = React.ComponentProps<typeof InputGroup> & {
  synth: SynthWithLogo;
  balance?: string;
  value?: string;
  onChange?: (value: string) => void;
  onHalfButtonClick?: () => void;
  onMaxButtonClick?: () => void;
};

const PLACEHOLDER_SETTINGS = {
  opacity: 1,
  color: "text.500",
};

export const SynthAmountInput = ({
  balance,
  synth,
  value,
  onChange,
  onHalfButtonClick,
  onMaxButtonClick,
  ...rest
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  useIMask(inputRef);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      onChange?.(event.target.value),
    [onChange]
  );

  return (
    <label>
      {balance && (
        <Flex
          flexDir={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
          mb={2}
        >
          <Flex flexDir={"row"}>
            <Text fontSize={"sm"} color={"gray.400"} mr={2}>
              Available:
            </Text>
            <Text fontSize={"sm"}>{balance}</Text>
          </Flex>
          <Flex flexDir={"row"}>
            <Button
              size={"xs"}
              variant={"outline"}
              mr={2}
              onClick={onMaxButtonClick}
            >
              Max
            </Button>
            <Button size={"xs"} variant={"outline"} onClick={onHalfButtonClick}>
              Half
            </Button>
          </Flex>
        </Flex>
      )}

      <InputGroup {...rest}>
        <InputRightElement
          width={24}
          justifyContent={"flex-end"}
          height={"100%"}
          pr={1}
        >
          <Button size="sm" colorScheme={"gray"}>
            <Avatar size={"xs"} name={synth.name} src={synth.logoUrl} mr={2} />
            {synth.name}
          </Button>
        </InputRightElement>
        <Input
          value={value}
          size={"lg"}
          pr={2}
          placeholder="0.0000"
          _placeholder={PLACEHOLDER_SETTINGS}
          onChange={handleChange}
          ref={inputRef}
        />
      </InputGroup>
    </label>
  );
};
