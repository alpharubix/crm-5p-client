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

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type SignInFormValues = z.infer<typeof signInSchema>

export function SignInPage({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })
  const navigate = useNavigate()
  const onSubmit = (data: SignInFormValues) => {
    console.log(data)
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
          <CardTitle>SignIn to your account</CardTitle>
          <CardDescription>
            Enter your email below to SignIn to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor='email'>Email</FieldLabel>
                <Input
                  id='email'
                  type='email'
                  placeholder='m@example.com'
                  required
                  {...register('email')}
                />
                {errors.email && (
                  <p className='text-xs text-red-500'>{errors.email.message}</p>
                )}
              </Field>
              <Field>
                <div className='flex items-center'>
                  <FieldLabel htmlFor='password'>Password</FieldLabel>
                </div>
                <Input
                  id='password'
                  type='password'
                  required
                  {...register('password')}
                />
                {errors.password && (
                  <p className='text-xs text-red-500'>
                    {errors.password.message}
                  </p>
                )}
              </Field>
              <Field>
                <Button type='submit'>SignIn</Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
