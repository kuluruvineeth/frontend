import { cn } from "@/lib/utils";
import { Icons } from "../icons";
import { Button } from "./button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

export function HelpTooltip({
  children,
  classNameTrigger,
  classNameContent,
}: {
  children: React.ReactNode;
  classNameTrigger?: string;
  classNameContent?: string;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={"ghost"}
            className={cn(classNameTrigger, "rounded-full")}
          >
            <Icons.help className="h-8 w-8" />
            <span className="sr-only">Help</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent className={cn(classNameContent)}>
          {children}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
