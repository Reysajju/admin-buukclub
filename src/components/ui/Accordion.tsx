"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type AccordionContextValue = {
    value?: string;
    onValueChange?: (value: string) => void;
    type?: "single" | "multiple";
    collapsible?: boolean;
};

const AccordionContext = React.createContext<AccordionContextValue>({});

type AccordionItemContextValue = {
    value: string;
    isOpen: boolean;
};

const AccordionItemContext = React.createContext<AccordionItemContextValue>({
    value: "",
    isOpen: false,
});

interface AccordionProps {
    type?: "single" | "multiple";
    collapsible?: boolean;
    value?: string;
    onValueChange?: (value: string) => void;
    children: React.ReactNode;
    className?: string;
}

export const Accordion = ({ type = "single", collapsible = false, value, onValueChange, children, className }: AccordionProps) => {
    const [internalValue, setInternalValue] = React.useState<string>("");
    const currentValue = value !== undefined ? value : internalValue;
    const handleValueChange = onValueChange || setInternalValue;

    return (
        <AccordionContext.Provider value={{ value: currentValue, onValueChange: handleValueChange, type, collapsible }}>
            <div className={cn("w-full", className)}>{children}</div>
        </AccordionContext.Provider>
    );
};

interface AccordionItemProps {
    value: string;
    children: React.ReactNode;
    className?: string;
}

export const AccordionItem = ({ value, children, className }: AccordionItemProps) => {
    const context = React.useContext(AccordionContext);
    const isOpen = context.value === value;

    return (
        <AccordionItemContext.Provider value={{ value, isOpen }}>
            <div className={cn("border-b border-border", className)}>{children}</div>
        </AccordionItemContext.Provider>
    );
};

interface AccordionTriggerProps {
    children: React.ReactNode;
    className?: string;
}

export const AccordionTrigger = ({ children, className }: AccordionTriggerProps) => {
    const accordionContext = React.useContext(AccordionContext);
    const itemContext = React.useContext(AccordionItemContext);

    const handleClick = () => {
        if (accordionContext.onValueChange) {
            const newValue = itemContext.isOpen && accordionContext.collapsible ? "" : itemContext.value;
            accordionContext.onValueChange(newValue);
        }
    };

    return (
        <button
            className={cn(
                "flex w-full items-center justify-between py-4 text-left font-medium transition-all hover:text-primary",
                className
            )}
            onClick={handleClick}
        >
            {children}
            <ChevronDown
                className={cn("h-4 w-4 shrink-0 transition-transform duration-200", itemContext.isOpen && "rotate-180")}
            />
        </button>
    );
};

interface AccordionContentProps {
    children: React.ReactNode;
    className?: string;
}

export const AccordionContent = ({ children, className }: AccordionContentProps) => {
    const itemContext = React.useContext(AccordionItemContext);

    return (
        <AnimatePresence initial={false}>
            {itemContext.isOpen && (
                <motion.div
                    initial="collapsed"
                    animate="open"
                    exit="collapsed"
                    variants={{
                        open: { opacity: 1, height: "auto" },
                        collapsed: { opacity: 0, height: 0 },
                    }}
                    transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                >
                    <div className={cn("pb-4 pt-0 text-muted-foreground", className)}>{children}</div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
