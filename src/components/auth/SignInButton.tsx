import Link from "next/link";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

interface UserButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export default function SignInButton({
  isLoading: isSignedIn,
  ...props
}: UserButtonProps) {
  if (isSignedIn) {
    return <Skeleton className="h-10 w-20"></Skeleton>;
  }

  return (
    <Button asChild variant="outline" {...props}>
      <Link href="/sign-in" prefetch>
        Sign In
      </Link>
    </Button>
  );
}
