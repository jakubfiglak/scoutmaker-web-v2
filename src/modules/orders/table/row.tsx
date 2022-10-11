import { Badge, Tooltip } from '@mui/material'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

import {
  AcceptIcon,
  CloseIcon,
  NoteIcon,
  RejectIcon,
  ReportsIcon,
} from '@/components/icons'
import { StyledTableCell } from '@/components/tables/cell'
import { CellWithLink } from '@/components/tables/cell-with-link'
import { TableMenu } from '@/components/tables/menu'
import { TableMenuItem } from '@/components/tables/menu-item'
import { StyledTableRow } from '@/components/tables/row'
import {
  getMatchDisplayName,
  getSingleMatchRoute,
} from '@/modules/matches/utils'
import { getSinglePlayerRoute } from '@/modules/players/utils'
import { getSingleTeamRoute } from '@/modules/teams/utils'
import { formatDate } from '@/utils/format-date'
import { useTableMenu } from '@/utils/hooks/use-table-menu'

import { OrderStatusChip } from '../StatusChip'
import { OrderDto } from '../types'

interface ITableRowProps {
  data: OrderDto
  onDeleteClick: () => void
  onAcceptOrderClick: (id: string) => void
  onRejectOrderClick: (id: string) => void
  onCloseOrderClick: (id: string) => void
}

export const OrdersTableRow = ({
  data,
  onDeleteClick,
  onAcceptOrderClick,
  onRejectOrderClick,
  onCloseOrderClick,
}: ITableRowProps) => {
  const router = useRouter()
  const { t } = useTranslation()

  const {
    menuAnchorEl,
    isMenuOpen,
    handleMenuClick,
    handleMenuClose,
    handleMenuAction,
  } = useTableMenu()

  const {
    id,
    player,
    status,
    scout,
    createdAt,
    description,
    _count: count,
    match,
  } = data

  return (
    <StyledTableRow
      hover
      key={id}
      onClick={isMenuOpen ? undefined : () => router.push(`/orders/${id}`)}
    >
      <StyledTableCell padding="checkbox">
        <TableMenu
          menuAnchorEl={menuAnchorEl}
          isMenuOpen={isMenuOpen}
          onMenuClick={handleMenuClick}
          onMenuClose={handleMenuClose}
          onDeleteClick={() => handleMenuAction(onDeleteClick)}
        >
          {status === 'OPEN' ? (
            <TableMenuItem
              icon={<AcceptIcon fontSize="small" />}
              text={t('orders:ACCEPT')}
              onClick={() => {
                handleMenuAction(() => onAcceptOrderClick(id))
              }}
            />
          ) : (
            <>
              <TableMenuItem
                icon={<RejectIcon fontSize="small" />}
                text={t('REJECT')}
                onClick={() => {
                  handleMenuAction(() => onRejectOrderClick(id))
                }}
              />
              <TableMenuItem
                icon={<CloseIcon fontSize="small" />}
                text={t('CLOSE')}
                onClick={() => {
                  handleMenuAction(() => onCloseOrderClick(id))
                }}
              />
            </>
          )}
        </TableMenu>
      </StyledTableCell>
      <CellWithLink
        href={getSinglePlayerRoute(player?.slug || '')}
        label={player ? `${player?.firstName} ${player?.lastName}` : ''}
      />
      <StyledTableCell>{player?.primaryPosition.name}</StyledTableCell>
      {player?.teams[0] ? (
        <CellWithLink
          href={getSingleTeamRoute(player.teams[0].team.slug)}
          label={player.teams[0].team.name}
        />
      ) : (
        <StyledTableCell>-</StyledTableCell>
      )}
      {match ? (
        <CellWithLink
          href={getSingleMatchRoute(match.id)}
          label={getMatchDisplayName({
            homeTeamName: match.homeTeam.name,
            awayTeamName: match.awayTeam.name,
          })}
        />
      ) : (
        <StyledTableCell>-</StyledTableCell>
      )}
      <StyledTableCell>
        <OrderStatusChip status={status} />
      </StyledTableCell>
      <StyledTableCell>
        {scout ? `${scout.firstName} ${scout.lastName}` : ''}
      </StyledTableCell>
      <StyledTableCell>{formatDate(createdAt)}</StyledTableCell>
      <StyledTableCell padding="checkbox" align="center">
        {!!description && (
          <Tooltip title={description}>
            <NoteIcon />
          </Tooltip>
        )}
      </StyledTableCell>
      <StyledTableCell align="center">
        <Badge badgeContent={count.reports || '0'} color="secondary">
          <ReportsIcon />
        </Badge>
      </StyledTableCell>
    </StyledTableRow>
  )
}
