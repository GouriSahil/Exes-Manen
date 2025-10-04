import { cva, type VariantProps } from "class-variance-authority"

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary-600 text-white hover:bg-primary-700",
        destructive: "bg-error-600 text-white hover:bg-error-700",
        outline: "border border-neutral-300 bg-transparent hover:bg-neutral-100",
        secondary: "bg-secondary-100 text-secondary-900 hover:bg-secondary-200",
        ghost: "hover:bg-neutral-100",
        link: "text-primary-600 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export const inputVariants = cva(
  "flex w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-neutral-300",
        error: "border-error-500 focus-visible:ring-error-500",
        success: "border-success-500 focus-visible:ring-success-500",
      },
      size: {
        default: "h-10 px-3 py-2",
        sm: "h-9 px-2 py-1 text-xs",
        lg: "h-11 px-4 py-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export const cardVariants = cva(
  "rounded-lg border bg-white text-neutral-950 shadow-sm",
  {
    variants: {
      variant: {
        default: "border-neutral-200",
        elevated: "border-neutral-200 shadow-md",
        outlined: "border-neutral-300",
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
    },
  }
)

export const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-white text-neutral-950 border-neutral-200",
        destructive: "border-error-200 bg-error-50 text-error-900 [&>svg]:text-error-600",
        warning: "border-warning-200 bg-warning-50 text-warning-900 [&>svg]:text-warning-600",
        success: "border-success-200 bg-success-50 text-success-900 [&>svg]:text-success-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary-100 text-primary-800 hover:bg-primary-200",
        secondary: "border-transparent bg-secondary-100 text-secondary-800 hover:bg-secondary-200",
        destructive: "border-transparent bg-error-100 text-error-800 hover:bg-error-200",
        outline: "text-neutral-950",
        success: "border-transparent bg-success-100 text-success-800 hover:bg-success-200",
        warning: "border-transparent bg-warning-100 text-warning-800 hover:bg-warning-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
export type InputVariants = VariantProps<typeof inputVariants>
export type CardVariants = VariantProps<typeof cardVariants>
export type AlertVariants = VariantProps<typeof alertVariants>
export type BadgeVariants = VariantProps<typeof badgeVariants>
