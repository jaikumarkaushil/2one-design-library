import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'
const meta: Meta<typeof Button> = { title: 'Components/Button', component: Button, args: { children: 'Continue' } }
export default meta
type S = StoryObj<typeof Button>
export const Primary: S = { args: { appearance: 'primary' } }
export const Secondary: S = { args: { appearance: 'secondary', children: 'Cancel' } }
export const Disabled: S = { args: { disabled: true } }
