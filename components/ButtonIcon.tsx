import React, { ComponentProps } from "react";
import { Button } from "@/components/Button";

type Props = ComponentProps<typeof Button> & { children: React.ReactNode; size?: number };

export const ButtonIcon = ({ children, size = 60, ...rest }: Props) => {
  return (
    <Button
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        flex: 0,
        elevation: 10,
      }}
      {...rest}
    >
      {children}
    </Button>
  );
};
