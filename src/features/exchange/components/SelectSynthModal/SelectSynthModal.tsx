import {
  Avatar,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SystemStyleObject,
  Text,
} from "@chakra-ui/react";
import React, { useCallback, useMemo } from "react";
import { SynthUI } from "../../../../shared";

type Props = Omit<React.ComponentProps<typeof Modal>, "children"> & {
  synths: SynthUI[];
  onSelectSynth?: (name: string) => void;
};

export const SelectSynthModal = ({
  onClose,
  onSelectSynth,
  synths,
  ...rest
}: Props) => {
  const handleItemClick = useCallback(
    (synth: SynthUI) => {
      onSelectSynth?.(synth.name);
      onClose();
    },
    [onClose, onSelectSynth]
  );

  const hoverStyle: SystemStyleObject = useMemo(
    () => ({
      backgroundColor: "gray.500",
      cursor: "pointer",
    }),
    []
  );

  const list = useMemo(
    () =>
      synths.map((synth) => (
        <Flex
          key={synth.name}
          flexDir={"row"}
          alignItems={"center"}
          pt={3}
          pb={3}
          pr={3}
          pl={3}
          _hover={hoverStyle}
          onClick={() => handleItemClick(synth)}
        >
          <Avatar name={synth.name} src={synth.logoUrl} size={"sm"} mr={3} />
          <Flex flexDir={"column"}>
            <Text fontSize={"sm"} fontWeight={"semibold"}>
              {synth.name}
            </Text>
            <Text fontSize={"sm"}>{`Synthetic ${synth.description}`}</Text>
          </Flex>
        </Flex>
      )),
    [handleItemClick, hoverStyle, synths]
  );
  return (
    <Modal {...rest} onClose={onClose} size={"sm"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select Synth</ModalHeader>
        <ModalCloseButton />
        <ModalBody paddingLeft={0} paddingRight={0} paddingTop={0}>
          {list}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
