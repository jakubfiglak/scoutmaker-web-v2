import { useRouter } from 'next/router'

import { StyledTableCell } from '@/components/tables/cell'
import { TableMenu } from '@/components/tables/menu'
import { StyledTableRow } from '@/components/tables/row'
import { useTableMenu } from '@/utils/hooks/use-table-menu'

import { ReportTemplateDto } from '../types'

interface ITableRowProps {
  data: ReportTemplateDto
  onEditClick: () => void
  onDeleteClick: () => void
  isEditOptionEnabled: boolean
  isDeleteOptionEnabled: boolean
}

export const ReportTemplatesTableRow = ({
  data,
  onEditClick,
  onDeleteClick,
  isEditOptionEnabled,
  isDeleteOptionEnabled,
}: ITableRowProps) => {
  const router = useRouter()

  const {
    menuAnchorEl,
    isMenuOpen,
    handleMenuClick,
    handleMenuClose,
    handleMenuAction,
  } = useTableMenu()

  const { id, name, maxRatingScore } = data

  return (
    <StyledTableRow
      hover
      key={id}
      onClick={
        isMenuOpen ? undefined : () => router.push(`/report-templates/${id}`)
      }
    >
      <StyledTableCell padding="checkbox">
        <TableMenu
          menuAnchorEl={menuAnchorEl}
          isMenuOpen={isMenuOpen}
          onMenuClick={handleMenuClick}
          onMenuClose={handleMenuClose}
          isDeleteOptionEnabled={isDeleteOptionEnabled}
          isEditOptionEnabled={isEditOptionEnabled}
          onDeleteClick={() => handleMenuAction(onDeleteClick)}
          onEditClick={() => handleMenuAction(onEditClick)}
        />
      </StyledTableCell>
      <StyledTableCell>{name}</StyledTableCell>
      <StyledTableCell>{maxRatingScore}</StyledTableCell>
    </StyledTableRow>
  )
}
