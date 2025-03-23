'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { googleLogin, login } from '@repo/backend/auth/actions';
import { Input } from '@repo/design-system/components/precomposed/input';
import { Prose } from '@repo/design-system/components/prose';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/design-system/components/ui/form';
import { OrDivider } from '@repo/design-system/components/ui/or-divider';
import { handleError } from '@repo/design-system/lib/handle-error';
import { parseError } from '@repo/observability/error';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
  email: z.string().email(),
});

export const LoginForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await login(values.email);
      toast.success('Check your email for a login link.');
    } catch (error) {
      const message = parseError(error);

      if (message.includes('Signups not allowed for otp')) {
        handleError("You don't have an account yet. Please sign up.");
      } else {
        handleError(error);
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const url = await googleLogin();

      window.location.href = url;
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className="grid w-full gap-4 rounded-lg border bg-background p-8 shadow-sm">
      <Prose className="prose-sm text-center">
        <h1 className="m-0 font-semibold text-lg">Sign in to Open Studio</h1>
        <p className="m-0 text-muted-foreground">
          Welcome back! Please sign in to continue.
        </p>
      </Prose>
      <div className="grid gap-2">
        <div className="grid grid-cols-1 gap-4">
          <Button
            variant="outline"
            onClick={handleGoogleLogin}
            // disabled
            // className="disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Image
              src="/icons/google.svg"
              alt=""
              width={16}
              height={16}
              className="h-4 w-4"
            />
            Google
          </Button>
        </div>
        <OrDivider />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="kuluruvineeth@openstudio.tech"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={
                form.formState.disabled ||
                !form.formState.isValid ||
                form.formState.isSubmitted ||
                form.formState.isSubmitting
              }
            >
              Continue
            </Button>
          </form>
        </Form>
      </div>
      <Prose className="prose-sm text-center">
        <p className="text-muted-foreground">
          Don't have an account?{' '}
          <Link href="/sign-up" className="text-white">
            Sign up
          </Link>
        </p>
      </Prose>
    </div>
  );
};
