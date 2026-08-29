// A sign-in screen built the way the contract says: real components, real
// tokens, the Logo asset rather than type, one primary button.
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, Logo } from '@2one/design-library'

export function SignIn() {
  return (
    <Card className="max-w-sm">
      <CardHeader>
        <Logo variant="black" width={96} />
        <CardTitle>Sign in</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" />
        </div>
        <Button type="submit">Continue</Button>
      </CardContent>
    </Card>
  )
}
