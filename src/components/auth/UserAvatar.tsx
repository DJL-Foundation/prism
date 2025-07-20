import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { User } from "lucide-react";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { cn } from "~/lib/utils";

interface UserAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  name?: string | null;
  tooltip?: boolean;
  modify?: {
    userIconSize?: string;
  };
}

const UserAvatar = React.forwardRef<HTMLDivElement, UserAvatarProps>(
  (
    {
      src,
      name = "Unknown User",
      modify,
      tooltip = false,
      className,
      ...props
    },
    ref,
  ) => {
    if (tooltip) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Avatar ref={ref} className={cn("h-12 w-12", className)} {...props}>
                <AvatarImage src={src ?? undefined} alt={name ?? undefined} />
                <AvatarFallback className="bg-gradient-to-br from-[#8A2BE2] to-[#4169E1] text-white flex items-center justify-center">
                  <User className={cn("w-6 h-6", modify?.userIconSize)} />
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>{name ?? "Unknown User"}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return (
      <Avatar ref={ref} className={cn("h-12 w-12", className)} {...props}>
        <AvatarImage src={src ?? undefined} alt={name ?? undefined} />
        <AvatarFallback className="bg-gradient-to-br from-[#8A2BE2] to-[#4169E1] text-white flex items-center justify-center">
          <User className={cn("w-6 h-6", modify?.userIconSize)} />
        </AvatarFallback>
      </Avatar>
    );
  },
);

UserAvatar.displayName = "UserAvatar";

export default UserAvatar;
