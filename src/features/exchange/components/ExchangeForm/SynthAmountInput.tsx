import { useRef } from "react";
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

type Props = React.ComponentProps<typeof Input> & {
  synth: SynthWithLogo;
  balance?: string;
};

const PLACEHOLDER_SETTINGS = {
  opacity: 1,
  color: "text.500",
};

export const SynthAmountInput = ({ balance, synth, ...rest }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  useIMask(inputRef);

  return (
    <label>
      {balance && (
        <Flex flexDir={"row"} mb={2}>
          <Text fontSize={"sm"} color={"gray.400"} mr={2}>
            Available:
          </Text>
          <Text fontSize={"sm"}>{balance}</Text>
        </Flex>
      )}

      <InputGroup>
        <InputRightElement width={24} justifyContent={"flex-end"} pr={1}>
          <Button size="sm" colorScheme={"gray"}>
            <Avatar size={"xs"} name={synth.name} src={synth.logoUrl} mr={2} />
            {synth.name}
          </Button>
        </InputRightElement>
        <Input
          pr={2}
          placeholder="0.0000"
          _placeholder={PLACEHOLDER_SETTINGS}
          {...rest}
          ref={inputRef}
        />
      </InputGroup>
    </label>
  );
};
