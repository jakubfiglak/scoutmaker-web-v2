import { useRouter } from 'next/router'
import { TFunction, useTranslation } from 'next-i18next'

import { Table } from '@/components/tables/table'
import { ICommonTableProps, IHeadCell } from '@/types/tables'

import { UserNoteAclDto } from '../types'
import { UserNoteAclTableRow } from './row'

interface ITableProps extends ICommonTableProps {
  data: UserNoteAclDto[]
  handleDeleteItemClick: (data: { id: string }) => void
}

function generateHeadCells(t: TFunction): IHeadCell[] {
  return [
    { id: 'note', label: t('NOTE') },
    { id: 'user', label: t('USER') },
    {
      id: 'permissionLevel',
      label: t('PERMISSION_LEVEL'),
      isSortingDisabled: true,
    },
    { id: 'createdAt', label: t('CREATED_AT') },
  ]
}

export const UserNoteAclTable = ({
  page,
  rowsPerPage,
  sortBy,
  order,
  handleChangePage,
  handleChangeRowsPerPage,
  handleSort,
  total,
  actions,
  data,
  handleDeleteItemClick,
}: ITableProps) => {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <Table
      page={page}
      rowsPerPage={rowsPerPage}
      sortBy={sortBy}
      order={order}
      handleChangePage={handleChangePage}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
      handleSort={handleSort}
      total={total}
      headCells={generateHeadCells(t)}
      actions={actions}
    >
      {data.map(acl => (
        <UserNoteAclTableRow
          key={acl.id}
          data={acl}
          onEditClick={() => router.push(`/user-note-acl/edit/${acl.id}`)}
          onDeleteClick={() => handleDeleteItemClick({ id: acl.id })}
        />
      ))}
    </Table>
  )
}
