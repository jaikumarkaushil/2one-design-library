import type { Meta, StoryObj } from '@storybook/react'
import { Avatar } from './Avatar'
const meta: Meta<typeof Avatar> = { title: 'Components/Avatar', component: Avatar }
export default meta
type S = StoryObj<typeof Avatar>
export const Icon: S = { args: { type: 'icon' } }
export const Initial: S = { args: { type: 'initial', initial: 'YS' } }
export const Image: S = { args: { type: 'image', src: 'https://placehold.co/80', alt: 'User' } }
