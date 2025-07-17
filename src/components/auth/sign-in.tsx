import authClient from "#auth/client";
import { Card, CardContent } from "../ui/card";

export default function SignIn() {
  return (
    <div className="container mx-auto px-4 py-16 min-h-[80vh] flex items-center justify-center">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 pb-8 px-6">Sign In Component</CardContent>
      </Card>
    </div>
  );
}
