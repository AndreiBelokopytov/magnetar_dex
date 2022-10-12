import { Button } from "@chakra-ui/react";
import { useCallback } from "react";
import { useMatch, useNavigate } from "react-router-dom";

type Props = Omit<
  React.ComponentProps<typeof Button>,
  "onClick" | "colorScheme" | "variant"
> & {
  to: string;
};

export const NavLink = ({ to, ...rest }: Props) => {
  const match = useMatch(to);
  const navigate = useNavigate();
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      navigate(to);
    },
    [to, navigate]
  );
  return (
    <Button
      {...rest}
      colorScheme={match ? "teal" : undefined}
      as={"a"}
      variant={"ghost"}
      href={to}
      onClick={handleClick}
    />
  );
};
