"use client";

import { forwardRef } from "react";
import {
  buttonVariants,
  type ButtonSize,
  type ButtonVariant,
} from "@/components/ui/buttonStyles";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

/** 명랑한 알약형 버튼. 누르면 살짝 눌리는 애니메이션. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { className, variant = "primary", size = "md", fullWidth, ...props },
    ref,
  ) {
    return (
      <button
        ref={ref}
        className={buttonVariants({ variant, size, fullWidth, className })}
        {...props}
      />
    );
  },
);
