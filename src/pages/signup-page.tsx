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

export function SignUpPage({ ...props }: React.ComponentProps<typeof Card>) {
  return (
    <div className='flex flex-col max-w-[400px] h-screen p-4 mx-auto gap-6 justify-center'>
      <Card {...props}>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your information below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor='name'>Full Name</FieldLabel>
                <Input id='name' type='text' placeholder='John Doe' required />
              </Field>
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
                <FieldLabel htmlFor='password'>Password</FieldLabel>
                <Input id='password' type='password' required />
              </Field>
              <Field>
                <FieldLabel htmlFor='confirm-password'>
                  Confirm Password
                </FieldLabel>
                <Input id='confirm-password' type='password' required />
              </Field>
              <FieldGroup>
                <Field>
                  <Button type='submit'>Create Account</Button>
                  <FieldDescription className='px-6 text-center'>
                    Already have an account?{' '}
                    <Link to='/login' className='underline'>
                      Sign in
                    </Link>{' '}
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
