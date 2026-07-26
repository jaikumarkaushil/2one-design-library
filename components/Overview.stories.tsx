import type { Meta, StoryObj } from '@storybook/react'
import type { ReactNode } from 'react'
import { useState } from 'react'
import {
  Button, TextField, Checkbox, Avatar, AppBar, Badge, Logo,
  OtpField, Dropdown, RadioButton, BottomNavItem, Switch,
} from '../index'

const Home = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 11l9-8 9 8M5 10v10h14V10" />
  </svg>
)

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ fontSize: 12, color: '#6b7280' }}>{title}</div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>{children}</div>
    </div>
  )
}

function Kitchen() {
  const [otp, setOtp] = useState('42')
  const [sw, setSw] = useState(true)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: 24, width: 560 }}>
      <Section title="Button"><Button appearance="primary">Continue</Button><Button appearance="secondary">Cancel</Button><Button disabled>Disabled</Button></Section>
      <Section title="TextField"><TextField label="Email" placeholder="you@example.com" /><TextField label="Bad" isInvalid message="Required" /></Section>
      <Section title="Checkbox / Radio / Switch"><Checkbox label="Checked" defaultChecked /><Checkbox label="Indeterminate" indeterminate /><Checkbox label="Invalid" isInvalid /><RadioButton name="k" label="Radio" defaultChecked /><Switch checked={sw} onChange={setSw} label="Switch" /></Section>
      <Section title="Dropdown"><Dropdown label="Country" value="India" /><Dropdown placeholder="Select" open /></Section>
      <Section title="OTP"><OtpField length={4} value={otp} onChange={setOtp} /></Section>
      <Section title="Avatar / Badge"><Avatar type="icon" /><Avatar type="initial" initial="YS" /><Badge type="text" count={3} /><Badge type="text" count={128} /><Badge type="notext" /></Section>
      <Section title="Logo"><Logo variant="black" width={120} /></Section>
      <Section title="AppBar"><div style={{ width: 360 }}><AppBar title="Account" onBack={() => {}} /></div></Section>
      <Section title="Bottom nav"><div style={{ display: 'flex', width: 320, borderTop: '1px solid #e4e4e7' }}><BottomNavItem icon={<Home />} label="Home" selected /><BottomNavItem icon={<Home />} label="Search" /><BottomNavItem icon={<Home />} label="Profile" /></div></Section>
    </div>
  )
}

const meta: Meta = { title: 'Overview', parameters: { layout: 'fullscreen' } }
export default meta
export const All: StoryObj = { render: () => <Kitchen /> }
