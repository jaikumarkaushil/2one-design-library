import type { Meta, StoryObj } from '@storybook/react'
import { TextField } from './TextField'
const meta: Meta<typeof TextField> = { title: 'Components/TextField', component: TextField, args: { label: 'Email', placeholder: 'you@example.com' } }
export default meta
type S = StoryObj<typeof TextField>
export const Default: S = {}
export const WithMessage: S = { args: { message: 'We never share your email.' } }
export const Invalid: S = { args: { isInvalid: true, message: 'Enter a valid email.' } }
export const Disabled: S = { args: { disabled: true } }
