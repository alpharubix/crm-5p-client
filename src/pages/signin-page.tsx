import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Link } from 'react-router-dom'

export function SignInPage({
  className,
  ...props
}: React.ComponentProps<'div'>) {

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(e)
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
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor='email'>Email</FieldLabel>
                <Input
                  id='email'
                  type='email'
                  placeholder='m@example.com'
                  required
                />
              </Field>
              <Field>
                <div className='flex items-center'>
                  <FieldLabel htmlFor='password'>Password</FieldLabel>
                </div>
                <Input id='password' type='password' required />
              </Field>
              <Field>
                <Button type='submit'>SignIn</Button>
                <FieldDescription className='text-center'>
                  Don&apos;t have an account?{' '}
                  <Link to='/signup' className='underline'>
                    Sign up
                  </Link>{' '}
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
