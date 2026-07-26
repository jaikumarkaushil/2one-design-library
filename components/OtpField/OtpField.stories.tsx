import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { OtpField } from './OtpField'
const meta: Meta<typeof OtpField> = { title: 'Components/OtpField', component: OtpField }
export default meta
type S = StoryObj<typeof OtpField>
export const Default: S = { render: () => { const [v, setV] = useState(''); return <OtpField value={v} onChange={setV} /> } }
export const Invalid: S = { render: () => { const [v, setV] = useState('123'); return <OtpField value={v} onChange={setV} isInvalid /> } }
