import type { Meta, StoryObj } from '@storybook/react'
import { RadioButton } from './RadioButton'
const meta: Meta<typeof RadioButton> = { title: 'Components/RadioButton', component: RadioButton }
export default meta
type S = StoryObj<typeof RadioButton>
export const Group: S = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <RadioButton name="plan" label="Free" defaultChecked />
      <RadioButton name="plan" label="Pro" />
      <RadioButton name="plan" label="Team" />
    </div>
  ),
}
export const Invalid: S = { args: { name: 'a', label: 'Accept', isInvalid: true } }
export const Disabled: S = { args: { name: 'b', label: 'Unavailable', disabled: true } }
