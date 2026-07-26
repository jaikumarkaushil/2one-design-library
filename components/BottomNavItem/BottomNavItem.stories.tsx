import type { Meta, StoryObj } from '@storybook/react'
import { BottomNavItem } from './BottomNavItem'
const Home = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 11l9-8 9 8M5 10v10h14V10" />
  </svg>
)
const meta: Meta<typeof BottomNavItem> = { title: 'Components/BottomNavItem', component: BottomNavItem, args: { icon: <Home />, label: 'Home' } }
export default meta
type S = StoryObj<typeof BottomNavItem>
export const Default: S = {}
export const Selected: S = { args: { selected: true } }
export const Bar: S = {
  render: () => (
    <div style={{ display: 'flex', width: 320, borderTop: '1px solid #e4e4e7' }}>
      <BottomNavItem icon={<Home />} label="Home" selected />
      <BottomNavItem icon={<Home />} label="Search" />
      <BottomNavItem icon={<Home />} label="Profile" />
    </div>
  ),
}
