import {
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material'
import { useTranslation } from 'next-i18next'

import { StyledTableCell } from '@/components/tables/cell'
import { TableMenu } from '@/components/tables/menu'
import { TableMenuItem } from '@/components/tables/menu-item'
import { StyledTableRow } from '@/components/tables/row'
import { useTableMenu } from '@/utils/hooks/use-table-menu'
import { CountryDto } from '../types'

interface ICountriesTableRowProps {
  data: CountryDto
  onEditClick: () => void
  onDeleteClick: () => void
  isEditOptionEnabled: boolean
  isDeleteOptionEnabled: boolean
}

export const CountriesTableRow = ({
  data,
  onEditClick,
  onDeleteClick,
  isEditOptionEnabled,
  isDeleteOptionEnabled,
}: ICountriesTableRowProps) => {
  const { t } = useTranslation()

  const {
    menuAnchorEl,
    isMenuOpen,
    handleMenuClick,
    handleMenuClose,
    handleMenuAction,
  } = useTableMenu()

  const { id, name, code, isEuMember } = data

  return (
    <StyledTableRow
      hover
      key={id}
    >
      <StyledTableCell padding="checkbox">
        <TableMenu
          menuAnchorEl={menuAnchorEl}
          isMenuOpen={isMenuOpen}
          onMenuClick={handleMenuClick}
          onMenuClose={handleMenuClose}
        >
          <TableMenuItem
            icon={<EditIcon fontSize="small" />}
            text={t('EDIT')}
            onClick={() => {
              handleMenuAction(onEditClick)
            }}
            disabled={!isEditOptionEnabled}
          />
          <TableMenuItem
            icon={<DeleteIcon fontSize="small" />}
            text={t('DELETE')}
            onClick={() => {
              handleMenuAction(onDeleteClick)
            }}
            disabled={!isDeleteOptionEnabled}
          />
        </TableMenu>
      </StyledTableCell>
      <StyledTableCell>{name}</StyledTableCell>
      <StyledTableCell>{code}</StyledTableCell>
      <StyledTableCell>{isEuMember}</StyledTableCell>
    </StyledTableRow>
  )
}