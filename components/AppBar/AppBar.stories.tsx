import type { Meta, StoryObj } from '@storybook/react'
import { AppBar } from './AppBar'
const meta: Meta<typeof AppBar> = { title: 'Components/AppBar', component: AppBar, parameters: { layout: 'fullscreen' }, args: { title: 'Account' } }
export default meta
type S = StoryObj<typeof AppBar>
export const Default: S = { args: { onBack: () => {} } }
export const WithTrailing: S = { args: { onBack: () => {}, trailingSlot: <button aria-label="More">···</button> } }
