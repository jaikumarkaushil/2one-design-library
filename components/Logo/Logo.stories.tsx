import type { Meta, StoryObj } from '@storybook/react'
import { Logo } from './Logo'
const meta: Meta<typeof Logo> = { title: 'Brand/Logo', component: Logo }
export default meta
type S = StoryObj<typeof Logo>
export const Black: S = { args: { variant: 'black', width: 160 } }
export const White: S = {
  args: { variant: 'white', width: 160 },
  decorators: [(Story) => <div style={{ background: '#111', padding: 24 }}><Story /></div>],
}
