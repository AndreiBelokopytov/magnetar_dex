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
import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils";

type Props = Omit<React.ComponentProps<typeof InputGroup>, "onChange"> & {
  synth: SynthWithLogo;
  balance?: BigNumber;
  value?: string;
  readonly?: boolean;
  onChange?: (value: string) => void;
};

const PLACEHOLDER_SETTINGS = {
  opacity: 1,
  color: "text.500",
};

export const SynthAmountInput = ({
  balance,
  synth,
  value,
  readonly,
  onChange,
  ...rest
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  useIMask(inputRef, { scale: 18, value });

  const balanceString = balance ? formatEther(balance) : "";

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      onChange?.(event.target.value),
    [onChange]
  );

  const handleMaxButtonClick = useCallback(
    () => onChange?.(balanceString),
    [balanceString, onChange]
  );

  const handleHalfButtonClick = useCallback(
    () => balance && onChange?.(formatEther(balance.div(2))),
    [balance, onChange]
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
            <Text fontSize={"sm"}>{balanceString}</Text>
          </Flex>
          <Flex flexDir={"row"}>
            <Button
              size={"xs"}
              variant={"outline"}
              mr={2}
              onClick={handleMaxButtonClick}
            >
              Max
            </Button>
            <Button
              size={"xs"}
              variant={"outline"}
              onClick={handleHalfButtonClick}
            >
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
          readOnly={readonly}
          onChange={handleChange}
          ref={inputRef}
        />
      </InputGroup>
    </label>
  );
};
