import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './Badge'
const meta: Meta<typeof Badge> = { title: 'Components/Badge', component: Badge }
export default meta
type S = StoryObj<typeof Badge>
export const Count: S = { args: { type: 'text', count: 3 } }
export const Capped: S = { args: { type: 'text', count: 128 } }
export const Dot: S = { args: { type: 'notext' } }
