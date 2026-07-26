import type { Meta, StoryObj } from '@storybook/react'
import { Dropdown } from './Dropdown'
const meta: Meta<typeof Dropdown> = { title: 'Components/Dropdown', component: Dropdown, args: { label: 'Country', placeholder: 'Select a country' } }
export default meta
type S = StoryObj<typeof Dropdown>
export const Default: S = {}
export const Filled: S = { args: { value: 'India' } }
export const Open: S = { args: { open: true } }
export const Invalid: S = { args: { isInvalid: true, helperText: 'Selection required.' } }
export const Disabled: S = { args: { disabled: true } }
