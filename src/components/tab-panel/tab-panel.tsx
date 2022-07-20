import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import { ReactNode } from 'react'

const StyledBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),

  [theme.breakpoints.down('sm')]: {
    padding: `${theme.spacing(2)}px 0`,
  },
}))

interface ITabPanelProps {
  children: ReactNode
  index: number
  value: number
  title: string
}

export const TabPanel = ({ children, index, value, title }: ITabPanelProps) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`${title}-${index}`}
    aria-labelledby={`${title}-${index}`}
  >
    {value === index && <StyledBox>{children}</StyledBox>}
  </div>
)
