import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Switch } from './Switch'
const meta: Meta<typeof Switch> = { title: 'Components/Switch', component: Switch }
export default meta
type S = StoryObj<typeof Switch>
export const Off: S = { render: () => { const [on, setOn] = useState(false); return <Switch checked={on} onChange={setOn} label="Notifications" /> } }
export const On: S = { render: () => { const [on, setOn] = useState(true); return <Switch checked={on} onChange={setOn} label="Wi-Fi" /> } }
export const Disabled: S = { args: { disabled: true, label: 'Unavailable' } }
