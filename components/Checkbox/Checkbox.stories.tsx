import type { Meta, StoryObj } from '@storybook/react'
import { Checkbox } from './Checkbox'
const meta: Meta<typeof Checkbox> = { title: 'Components/Checkbox', component: Checkbox, args: { label: 'I agree to the terms' } }
export default meta
type S = StoryObj<typeof Checkbox>
export const Unchecked: S = {}
export const Checked: S = { args: { defaultChecked: true } }
export const Indeterminate: S = { args: { indeterminate: true } }
export const Invalid: S = { args: { isInvalid: true } }
export const Disabled: S = { args: { disabled: true } }
