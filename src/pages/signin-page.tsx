import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/context/auth-context'
import { toast } from 'sonner'

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type SignInFormValues = z.infer<typeof signInSchema>

export function SignInPage({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const { checkAuth } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
  })

  const onSubmit = async (data: SignInFormValues) => {
    const res = await fetch(`http://localhost:8080/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      toast.error('Invalid credentials')
      return
    }

    await checkAuth()

    toast.success('Login successful')

    navigate('/accounts')
  }

  return (
    <div
      className={cn(
        'flex flex-col max-w-[400px] p-4 mx-auto gap-6 h-screen justify-center',
        className
      )}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle>Sign in to your account</CardTitle>
          <CardDescription>Enter your email and password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input {...register('email')} />
                {errors.email && (
                  <p className='text-xs text-red-500'>{errors.email.message}</p>
                )}
              </Field>

              <Field>
                <FieldLabel>Password</FieldLabel>
                <Input type='password' {...register('password')} />
                {errors.password && (
                  <p className='text-xs text-red-500'>
                    {errors.password.message}
                  </p>
                )}
              </Field>

              <Button type='submit'>Sign In</Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
