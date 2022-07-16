import { ICommonTableProps, IHeadCell } from '@/types/tables'
import {
  Table as MUITable,
  TableBody,
  TableContainer,
  Paper,
  TablePagination,
  TableFooter,
  TableRow,
} from '@mui/material'
import { ReactNode } from 'react'
import { TableHeader } from './header'
import { TablePaginationActions } from './pagination-actions'

interface ITableProps extends ICommonTableProps {
  children: ReactNode
  headCells: IHeadCell[]
}

export const Table = ({
  children,
  page,
  rowsPerPage,
  sortBy,
  order,
  handleChangePage,
  handleChangeRowsPerPage,
  handleSort,
  total,
  headCells,
  actions,
  collapsible,
}: ITableProps) => (
  <TableContainer
    component={Paper}
    sx={{ overflowX: 'auto', margin: '0 auto' }}
  >
    <MUITable sx={{ minWidth: 700 }}>
      <TableHeader
        headCells={headCells}
        sortBy={sortBy}
        order={order}
        handleSort={handleSort}
        actions={actions}
        collapsible={collapsible}
      />
      <TableBody>{children}</TableBody>
      <TableFooter>
        <TableRow>
          <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
            colSpan={8}
            count={total}
            rowsPerPage={rowsPerPage}
            page={page}
            SelectProps={{
              inputProps: { 'aria-label': 'rows per page' },
              native: true,
            }}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            ActionsComponent={TablePaginationActions}
          />
        </TableRow>
      </TableFooter>
    </MUITable>
  </TableContainer>
)
