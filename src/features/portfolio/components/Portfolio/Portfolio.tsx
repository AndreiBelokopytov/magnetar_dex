import React, { useEffect } from "react";
import { useInjectedInstance } from "../../../../shared";
import { PortfolioVM } from "./Portfolio.vm";
import {
  Text,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Avatar,
} from "@chakra-ui/react";
import { formatEther } from "ethers/lib/utils";
import { observer } from "mobx-react";

export const Portfolio = observer(() => {
  const vm = useInjectedInstance(PortfolioVM);
  useEffect(() => {
    vm.init();
    return () => vm.dispose();
  }, [vm]);

  const synths = vm.synths.map((synth) => (
    <Tr key={synth.name}>
      <Td>
        <Text>
          <Avatar
            verticalAlign={"middle"}
            name={synth.name}
            src={synth.logoUrl}
            size={"sm"}
            mr={3}
          />
          {synth.name}
        </Text>
      </Td>
      <Td>
        <Text fontSize={"sm"} as="b">{`${synth.currencyPrice.toFixed(
          2
        )}$`}</Text>
        <Text fontSize={"sm"}>{formatEther(synth.balance)}</Text>
      </Td>
    </Tr>
  ));

  return (
    <>
      <Text as="h3" fontSize="xl" fontWeight={"bold"} mb={12}>
        Portfolio
      </Text>

      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Synth</Th>
              <Th>Balance</Th>
            </Tr>
          </Thead>
          <Tbody>{synths}</Tbody>
        </Table>
      </TableContainer>
    </>
  );
});
