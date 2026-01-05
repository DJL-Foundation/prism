"use client";

/*
import authClient from "#auth/client";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { motion } from "motion/react";
import { Button } from "../ui/button";
import { KeyRound } from "lucide-react";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LabeledSeparator } from "../ui/separator";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Checkbox } from "../ui/checkbox";

type FormData = Parameters<typeof authClient.signUp.email>[0];

const test = null as unknown as FormData;
void test.username;
void test.email;
void test.password;
void test.displayUsername;
void test.image; // If then only in settings
void test.callbackURL;

const MotionButton = motion.create(Button);
const MotionLabel = motion.create(Label);
const MotionInput = motion.create(Input);

export default function SignUp() {
  const [hovered, setHovered] = useState<
    "Passkey" | "Google" | "GitHub" | "email"
  >("email");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {},
    resolver: zodResolver(
      z.object({
        email: z.string().email("Invalid email address"),
        password: z
          .string()
          .min(6, "Password must be at least 6 characters long")
          .max(128, "Password must be at most 128 characters long"),
      }),
    ),
  });
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    await authClient.signIn.email({
      email: data.email,
      password: data.password,
    });
  };

  async function passkeyAuth() {
    const data = await authClient.signIn.passkey();
    void data;
  }

  async function googleAuth() {
    const data = await authClient.signIn.social({
      provider: "google",
    });
    void data;
  }

  async function githubAuth() {
    const data = await authClient.signIn.social({
      provider: "github",
    });
    void data;
  }

  useEffect(() => {
    PublicKeyCredential.isConditionalMediationAvailable?.()
      .then((isAvailable) => {
        if (!isAvailable) {
          return;
        }

        void authClient.signIn.passkey({ autoFill: true });
      })
      .catch((error) => {
        console.error("Error checking passkey availability:", error);
      });
  });

  useEffect(() => {
    void authClient.oneTap();
  });

  return (
    <div className="flex flex-col items-center justify-between bg-background px-4 py-12">
      <div className="w-full flex-grow flex flex-col items-center justify-center">
        <div className="w-full mx-auto">
          {/* Header */ /*} 
          <div className="text-center space-y-2 mx-auto mb-8">
            <Image
              src="/logo.png"
              alt="Logo"
              width={48}
              height={48}
              className="mx-auto mb-4"
            />
            <h1 className="text-3xl font-semibold tracking-tight">
              Welcome back!
            </h1>
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account yet?{" "}
              <Link
                href="/sign-up"
                className="underline underline-offset-4 hover:text-primary"
                prefetch
              >
                Sign up now
              </Link>
            </p>
          </div>

          <div className="space-y-4 max-w-md mx-auto">
            {/* Social Sign In */ /*}

            <div className="flex py-2 space-x-2">
              <MotionButton
                variant="outline"
                className="w-full h-11 font-normal"
                onClick={googleAuth}
                onMouseEnter={() => setHovered("Google")}
                onMouseLeave={() => setHovered("email")}
              >
                <GoogleIcon className="mr-2 h-4 w-4" />
                Google
              </MotionButton>

              <MotionButton
                variant="outline"
                className="w-full h-11 font-normal"
                onClick={githubAuth}
                onMouseEnter={() => setHovered("GitHub")}
                onMouseLeave={() => setHovered("email")}
              >
                <GitHubIcon className="mr-2 h-4 w-4" />
                GitHub
              </MotionButton>
            </div>

            {/* Divider */ /*}
            <LabeledSeparator label="Or continue with email" />

            {/* Email Form */ /*}
            <motion.form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-2"
            >
              <div className="space-y-2">
                <MotionLabel htmlFor="email" className="text-sm font-medium">
                  Email
                </MotionLabel>
                <MotionInput
                  id="email"
                  placeholder="Type your email"
                  className="h-11"
                  {...register("email", {
                    required: "Email is required",
                  })}
                  autoComplete="email webauthn"
                />
                {errors.email && (
                  <p className="text-destructive text-sm">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <MotionLabel htmlFor="password" className="text-sm font-medium">
                  Password
                </MotionLabel>
                <MotionInput
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="h-11"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  autoComplete="current-password webauthn"
                />
                {errors.password && (
                  <p className="text-destructive text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */ /*}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Controller
                    name="rememberMe"
                    control={control}
                    render={({ field }) => (
                      <>
                        <Checkbox
                          id="rememberMe"
                          onCheckedChange={field.onChange}
                          checked={field.value}
                        />
                        <Label htmlFor="rememberMe">Remember me</Label>
                      </>
                    )}
                  />
                </div>
                <MotionButton
                  variant="link"
                  className="text-sm p-0 h-auto"
                  asChild
                >
                  <Link href="/forgot-password" prefetch>
                    Forgot password?
                  </Link>
                </MotionButton>
              </div>

              <MotionButton
                type="submit"
                variant="default"
                className="w-full h-11 mt-2"
              >
                Continue with email
              </MotionButton>
            </motion.form>
          </div>
        </div>
      </div>
      {/* Terms - Forced to bottom */ /*}
      <div className="text-center text-xs text-muted-foreground mt-8">
        By clicking &quot;Continue with {hovered}&quot; <br />
        you agree to our{" "}
        <Link
          href="/terms"
          className="underline underline-offset-4 hover:text-primary"
        >
          Terms of Use
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="underline underline-offset-4 hover:text-primary"
        >
          Privacy Policy
        </Link>
      </div>
    </div>
  );
}

*/
