/* eslint-disable @typescript-eslint/no-unused-vars */
import authClient from "#auth/client";
import { Card, CardContent, CardHeader } from "../ui/card";
import { useForm, type SubmitHandler } from "react-hook-form";
import { motion } from "motion/react";
import { Button } from "../ui/button";
import { KeyRound } from "lucide-react";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

type FormData = Parameters<typeof authClient.signIn.email>[0];

const test = null as unknown as FormData;

const MotionCard = motion.create(Card);
const MotionButton = motion.create(Button);
const MotionLabel = motion.create(Label);
const MotionInput = motion.create(Input);

export default function SignIn() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    await authClient.signIn.email({
      email: data.email,
      password: data.password,
    });
  };

  async function passkeyAuth() {
    const data = await authClient.signIn.passkey();
    console.log("Passkey Auth Data:", data);
  }

  async function googleAuth() {
    const data = await authClient.signIn.social({
      provider: "google",
    });
    console.log("Google Auth Data:", data);
  }

  async function githubAuth() {
    const data = await authClient.signIn.social({
      provider: "github",
    });
    console.log("GitHub Auth Data:", data);
  }

  return (
    <div className="container mx-auto px-4 py-16 min-h-[80vh] flex items-center justify-center">
      <Card className="max-w-md w-full">
        <CardHeader>
          <h2 className="text-2xl font-bold">Sign In</h2>
        </CardHeader>
        <CardContent className="pt-0 pb-8 px-6">
          <motion.section className="p-2">
            <MotionButton
              variant="outline"
              className="py-2 w-full"
              onClick={passkeyAuth}
            >
              <KeyRound className="mr-0" />
              using Passkey
            </MotionButton>
            <div className="flex items-center justify-center py-2 mx-2">
              <MotionButton
                variant="outline"
                className="py-2 w-full mx-1"
                onClick={googleAuth}
              >
                <GoogleIcon className="mr-2" />
                Google
              </MotionButton>
              <MotionButton
                variant="outline"
                className="py-2 w-full mx-1"
                onClick={githubAuth}
              >
                <GitHubIcon className="mr-2" />
                GitHub
              </MotionButton>
            </div>
          </motion.section>
          <motion.form onSubmit={handleSubmit(onSubmit)} className="mt-6">
            <div>
              <MotionLabel
                htmlFor="email"
                className="block text-sm font-medium"
              >
                Email
              </MotionLabel>
              <MotionInput
                id="email"
                placeholder="Enter your email"
                className="mt-1 block w-full"
                {...register("email", {
                  required: "Email is required",
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="mt-4">
              <MotionLabel
                htmlFor="password"
                className="block text-sm font-medium"
              >
                Password
              </MotionLabel>
              <MotionInput
                id="password"
                type="password"
                placeholder="Enter your password"
                className="mt-1 block w-full"
                {...register("password", {
                  required: "Password is required",
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <MotionButton type="submit" className="mt-6 w-full">
              Sign In
            </MotionButton>
          </motion.form>
        </CardContent>
      </Card>
    </div>
  );
}
